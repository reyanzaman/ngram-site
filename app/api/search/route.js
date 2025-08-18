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
      // 1) Find topics by exact stemmed match
      const stemmedTopicsRes = await client.query(
        `SELECT id FROM primary_topics WHERE topic_stemmed = $1`,
        [text]
      );

      let topicIds = stemmedTopicsRes.rows.map(r => r.id);

      // 2) If none, fall back to exact topic_text match
      if (topicIds.length === 0) {
        const textTopicsRes = await client.query(
          `SELECT id FROM primary_topics WHERE topic_text = $1`,
          [text]
        );
        topicIds = textTopicsRes.rows.map(r => r.id);
      }

      // If still none, return empty result set
      if (topicIds.length === 0) {
        return NextResponse.json({ results: [] });
      }

      // 3) Use only those topic IDs to fetch linked bigrams
      // DISTINCT is safe here because every ORDER BY expression is selected
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