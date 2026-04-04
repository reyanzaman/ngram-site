import { NextResponse } from "next/server";
import DbUtils, { pool } from "@/app/api/database/db";

export const revalidate = 3600;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const surahId = parseInt(searchParams.get("surah_id"));
    const lang = searchParams.get("lang") || "en";

    if (!surahId) {
      return NextResponse.json(
        { error: "Missing surah_id" },
        { status: 400 }
      );
    }

    // Check DB connection (same as your existing API)
    const isDbConnected = await DbUtils.checkConnection();
    if (!isDbConnected) {
      return NextResponse.json(
        { error: "Failed to connect to the database" },
        { status: 500 }
      );
    }

    const client = await pool.connect();

    try {
      const query = `
        SELECT 
          a.id,
          a.surah_id,
          a.ayat_no,
          a.ayat_arabic_text,
          COALESCE(t.ayat_text, a.ayat_english_text) AS ayat_english_text
        FROM ayats a
        LEFT JOIN translations t 
          ON t.ayat_id = a.id 
          AND t.lang_code = $2
        WHERE a.surah_id = $1
        ORDER BY a.ayat_no ASC
      `;

      const result = await client.query(query, [surahId, lang]);

      return NextResponse.json({ ayats: result.rows });

    } catch (error) {
      console.error("Error fetching surah ayats:", error);
      return NextResponse.json(
        { error: "Error fetching surah ayats" },
        { status: 500 }
      );
    } finally {
      client.release();
    }

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}