import { NextResponse } from 'next/server';
import DbUtils from '@/app/api/database/db';
import { pool } from '@/app/api/database/db';

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const searchTerms = [text];

    const queries = [
      { table: 'bi_grams', column: 'bi_gram_text', label: '2-Word Text Patterns' },
    ];

    const isDbConnected = await DbUtils.checkConnection();
    if (!isDbConnected) {
      return NextResponse.json({ error: 'Failed to connect to the database' }, { status: 500 });
    }

    const client = await pool.connect();
    try {
      let results = [];

      for (const { table, column, label } of queries) {
        const sql = `
                    SELECT id, ${column}
                    FROM ${table}
                    WHERE ${column} ILIKE $1
                  `;
        const res = await client.query(sql, [`${searchTerms[0]}%`]);

        results = results.concat(
          res.rows.map(row => ({
            id: row.id,
            [column]: row[column],
            foundInGram: label,
          }))
        );
      }

      // console.log('Search results:', results);

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