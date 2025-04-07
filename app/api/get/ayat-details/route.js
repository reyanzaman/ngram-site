import { NextResponse } from "next/server";
import { pool } from "@/app/api/database/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text");
  const ngram = searchParams.get("ngram"); // one of: bi_gram, tri_gram, four_gram, five_gram

  if (!text) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  try {
    // Step 1: Get Ayat by Arabic text
    const getAyatQuery = `SELECT * FROM ayats WHERE ayat_arabic_text = $1`;
    const ayatRes = await pool.query(getAyatQuery, [text]);
    const ayat = ayatRes.rows[0];

    if (!ayat) {
      return NextResponse.json({ error: "Ayat not found" }, { status: 404 });
    }

    // Step 2: Get Surah info
    const getSurahQuery = `SELECT * FROM surahs WHERE id = $1`;
    const surahRes = await pool.query(getSurahQuery, [ayat.surah_id]);
    const surah = surahRes.rows[0];

    if (!surah) {
      return NextResponse.json({ error: "Surah not found" }, { status: 404 });
    }

    // Step 3: Get before/after portions from the correct n-gram portions table
    let before = null;
    let after = null;

    if (ngram) {
      const table = `${ngram}_portions`; // e.g., tri_gram_portions
      const query = `SELECT left_portion, right_portion FROM ${table} WHERE ayat_id = $1 LIMIT 1`;
      const portionRes = await pool.query(query, [ayat.id]);
      if (portionRes.rows.length > 0) {
        before = portionRes.rows[0].left_portion;
        after = portionRes.rows[0].right_portion;
      }
    }

    const details = {
      ayatText: ayat.ayat_arabic_text,
      translation: ayat.ayat_english_text,
      surahName: `${surah.surah_name_english} - ${surah.surah_name_arabic} (${surah.id})`,
      ayatNumber: ayat.ayat_no,
      before,
      after,
    };

    return NextResponse.json({ details });

  } catch (error) {
    console.error("Error fetching ayat details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}