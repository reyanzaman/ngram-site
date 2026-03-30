import { NextResponse } from "next/server";
import DbUtils, { pool } from "@/app/api/database/db";

export async function POST(req) {
  try {
    const { level, id, lang = 'en' } = await req.json();

    if (!level || !id) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Map n-gram levels to corresponding tables and column names
    const tableMap = {
      bigram: {
        table: "bi_grams_link_ayat",
        column: "bi_gram_id"
      },
      trigram: {
        table: "tri_grams_link_ayat",
        column: "tri_gram_id"
      },
      fourgram: {
        table: "four_grams_link_ayat",
        column: "four_gram_id"
      },
      fivegram: {
        table: "five_grams_link_ayat",
        column: "five_gram_id"
      }
    };

    const mapping = tableMap[level];
    if (!mapping) {
      return NextResponse.json({ error: "Invalid level provided" }, { status: 400 });
    }

    // Check database connection
    const isDbConnected = await DbUtils.checkConnection();
    if (!isDbConnected) {
      return NextResponse.json({ error: "Failed to connect to the database" }, { status: 500 });
    }

    const client = await pool.connect();
    try {
      const linkQuery = `SELECT ayat_id FROM ${mapping.table} WHERE ${mapping.column} = $1`;
      const linkResult = await client.query(linkQuery, [id]);

      const ayatIds = linkResult.rows.map(row => row.ayat_id);
      if (ayatIds.length === 0) {
        return NextResponse.json({ ayats: [] });
      }

      const placeholders = ayatIds.map((_, i) => `$${i + 1}`).join(", ");
      const ayatQuery = `
        SELECT 
          a.id, a.surah_id, a.ayat_no, a.ayat_arabic_text,
          COALESCE(t.ayat_text, a.ayat_english_text) AS ayat_english_text
        FROM ayats a
        LEFT JOIN translations t ON t.ayat_id = a.id AND t.lang_code = $${ayatIds.length + 1}
        WHERE a.id IN (${placeholders})
      `;
      const ayatResult = await client.query(ayatQuery, [...ayatIds, lang]);

      const ayats = ayatResult.rows;
      return NextResponse.json({ ayats });
    } catch (error) {
      console.error("Error fetching ayats:", error);
      return NextResponse.json({ error: "Error fetching ayats" }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
