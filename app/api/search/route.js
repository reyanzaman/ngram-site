// import { NextResponse } from 'next/server';
// import DbUtils from '@/app/api/database/db';
// import { pool } from '@/app/api/database/db';

// export async function POST(request) {
//   try {
//     const { text } = await request.json();

//     if (!text || !text.trim()) {
//       return NextResponse.json({ error: 'Text is required' }, { status: 400 });
//     }

//     const searchTerms = [text];

//     const queries = [
//       { table: 'bi_grams', column: 'bi_gram_text', label: '2-Word Text Patterns' },
//     ];

//     const isDbConnected = await DbUtils.checkConnection();
//     if (!isDbConnected) {
//       return NextResponse.json({ error: 'Failed to connect to the database' }, { status: 500 });
//     }

//     const client = await pool.connect();
//     try {
//       let results = [];

//       for (const { table, column, label } of queries) {
//         const sql = `
//             SELECT id, ${column}
//             FROM ${table}
//             WHERE ${column} ILIKE $1
//             ORDER BY 
//               CASE 
//                 WHEN ${column} ILIKE $2 THEN 0
//                 ELSE 1
//               END,
//               ${column}
//           `;
//         const res = await client.query(sql, [`%${searchTerms[0]}%`, `${searchTerms[0]}%`]);

//         results = results.concat(
//           res.rows.map(row => ({
//             id: row.id,
//             [column]: row[column],
//             foundInGram: label,
//           }))
//         );
//       }

//       return NextResponse.json({ results });
//     } catch (error) {
//       console.error('Error fetching search results:', error);
//       return NextResponse.json({ error: 'Error fetching search results' }, { status: 500 });
//     } finally {
//       client.release();
//     }
//   } catch (error) {
//     console.error('Search route error:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import DbUtils from '@/app/api/database/db';
import { pool } from '@/app/api/database/db';

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const isDbConnected = await DbUtils.checkConnection();
    if (!isDbConnected) {
      return NextResponse.json({ error: 'Failed to connect to the database' }, { status: 500 });
    }

    const client = await pool.connect();
    try {
      const trimmed = text.trim();
      // Support multiple space-separated terms, case-insensitive
      const terms = trimmed.split(/\s+/).filter(Boolean);
      const termsLower = terms.map(t => t.toLowerCase());
      if (!termsLower.length) {
        return NextResponse.json({ error: 'Text is required' }, { status: 400 });
      }

      // ---- Topic IDs: exact token match on topic_stemmed/topic_text (space-separated fields), else substring match ----
      const exactRes = await client.query(
        `
          SELECT id
          FROM primary_topics
          WHERE
            EXISTS (
              SELECT 1
              FROM unnest(string_to_array(lower(coalesce(topic_stemmed, '')), ' ')) AS tok
              WHERE tok = ANY($1::text[])
            )
            OR EXISTS (
              SELECT 1
              FROM unnest(string_to_array(lower(coalesce(topic_text, '')), ' ')) AS tok
              WHERE tok = ANY($1::text[])
            )
        `,
        [termsLower]
      );

      let topicIds;
      if (exactRes.rowCount > 0) {
        topicIds = exactRes.rows.map(r => r.id);
      } else {
        // Build dynamic LIKEs for substring search across both columns
        const likeParams = [];
        const likeClauses = terms.map((term, i) => {
          likeParams.push(`%${term}%`);
          return `(topic_text ILIKE $${i + 2} OR topic_stemmed ILIKE $${i + 2})`;
        }).join(' OR ');

        const subRes = await client.query(
          `
            SELECT id, topic_text, topic_stemmed
            FROM primary_topics
            WHERE ${likeClauses}
          `,
          [termsLower, ...likeParams]
        );

        const scoreFor = (row) => {
          const tt = (row.topic_text || '').toLowerCase();
          const ts = (row.topic_stemmed || '').toLowerCase();
          const LARGE = 1e9;
          let best = LARGE;

          for (const term of termsLower) {
            const posText = tt.indexOf(term);
            const posStem = ts.indexOf(term);
            const pos = Math.min(
              posText === -1 ? LARGE : posText,
              posStem === -1 ? LARGE : posStem
            );
            if (pos < best) best = pos;
          }

          const len = Math.min((row.topic_text || '').length, (row.topic_stemmed || '').length) ||
                      ((row.topic_text || '').length + (row.topic_stemmed || '').length);

          return best * 1e3 + len;
        };

        const ranked = subRes.rows
          .map(r => ({ id: r.id, score: scoreFor(r) }))
          .sort((a, b) => a.score - b.score);

        topicIds = ranked.map(r => r.id);
      }

      if (topicIds.length === 0) {
        return NextResponse.json({ results: [] });
      }

      // ---- Fetch linked bigrams for those topic IDs ----
      const bigramsRes = await client.query(
        `
          SELECT DISTINCT
            b.id AS bi_gram_id,
            b.bi_gram_text
          FROM primary_topics_link_bi_grams AS plbg
          JOIN bi_grams AS b
            ON b.id = plbg.bi_gram_id
          WHERE plbg.topic_id = ANY($1::text[])
          ORDER BY b.bi_gram_text ASC
        `,
        [topicIds]
      );

      const results = bigramsRes.rows.map(row => ({
        id: row.bi_gram_id,
        bi_gram_text: row.bi_gram_text,
        foundInGram: '2-Word Text Patterns',
      }));

      return NextResponse.json({ results });
    } catch (error) {
      console.error('Error fetching search results:', error);
      return NextResponse.json({ error: 'Error fetching search results' }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Search route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}