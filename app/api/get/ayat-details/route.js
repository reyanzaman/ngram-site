import { NextResponse } from "next/server";
import { pool } from "@/app/api/database/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") || 'en';
  const ayatId = searchParams.get("ayatId");
  const ngram = searchParams.get("ngram"); // one of: bi_grams, tri_grams, etc.
  const ngramId = searchParams.get("ngramId");

  if (!ayatId || !ngram || !ngramId) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    // Step 1: Get Ayat by ID
    const getAyatQuery = `SELECT * FROM ayats WHERE id = $1`;
    const ayatRes = await pool.query(getAyatQuery, [ayatId]);
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

    // Step 3: Get before/after from correct portions table using composite key
    const table = `${ngram}_portions`; // e.g., tri_grams_portions
    const ngramIdField = `${ngram.slice(0, -1)}_id`; // e.g., tri_gram_id

    const portionQuery = `
      SELECT left_portion, right_portion 
      FROM ${table} 
      WHERE ayat_id = $1 AND ${ngramIdField} = $2 
      LIMIT 1
    `;
    const portionRes = await pool.query(portionQuery, [ayatId, ngramId]);

    let before = null;
    let after = null;
    if (portionRes.rows.length > 0) {
      before = portionRes.rows[0].left_portion;
      after = portionRes.rows[0].right_portion;
    }

    // Final response
    const details = {
      ayatText: ayat.ayat_arabic_text,
      translation: await (async () => {
        const transRes = await pool.query(
          `SELECT ayat_text FROM translations WHERE ayat_id = $1 AND lang_code = $2 LIMIT 1`,
          [ayatId, lang]
        );
        return transRes.rows[0]?.ayat_text || ayat.ayat_english_text;
      })(),
      surahName: await (async () => {
        const stRes = await pool.query(
          `SELECT surah_name FROM surah_translations WHERE surah_id = $1 AND lang_code = $2 LIMIT 1`,
          [surah.id, lang]
        );
        const name = stRes.rows[0]?.surah_name || surah.surah_name_english;
        return `${name} - ${surah.surah_name_arabic} (${surah.id})`;
      })(),
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