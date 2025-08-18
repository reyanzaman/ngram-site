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

      // ---- Topic IDs: exact on topic_stemmed, else substring on topic_stemmed ----
      const exactRes = await client.query(
        `SELECT id FROM primary_topics WHERE topic_stemmed = $1`,
        [trimmed]
      );

      let topicIds;
      if (exactRes.rowCount > 0) {
        // Exact match: only return exact topics
        topicIds = exactRes.rows.map(r => r.id);
      } else {
        // Fallback to substring match on topic_stemmed
        const subRes = await client.query(
          `SELECT id FROM primary_topics WHERE topic_stemmed ILIKE $1`,
          [`%${trimmed}%`]
        );
        topicIds = subRes.rows.map(r => r.id);
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