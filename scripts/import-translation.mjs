import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { XMLParser } from 'fast-xml-parser';
import { decode } from 'html-entities';

// ← Paste your Neon connection string here (from Neon dashboard → Connection Details)
const sql = neon('postgresql://thematic-search_owner:npg_lrwet7z0iQSF@ep-wispy-tree-a1hm4ccv-pooler.ap-southeast-1.aws.neon.tech/thematic-search?sslmode=require&channel_binding=require');

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  htmlEntities: false,        // ← disable HTML entity processing
  processEntities: false,     // ← disable entity expansion entirely
  allowBooleanAttributes: true,
  parseAttributeValue: false,
});

async function importTranslation(xmlPath, langCode, translator) {
  console.log(`\nImporting ${xmlPath} as lang=${langCode}, translator=${translator}`);

  const xml = readFileSync(xmlPath, 'utf-8');
  const parsed = parser.parse(xml);
  const suras = parsed.quran.sura;

  let inserted = 0;

  for (const sura of suras) {
    const surahIndex = parseInt(sura.index);
    const ayas = Array.isArray(sura.aya) ? sura.aya : [sura.aya];

    for (const aya of ayas) {
      const ayaIndex = parseInt(aya.index);
      const text = decode(aya.text);

      // Find the ayat_id from your DB
      const rows = await sql`
        SELECT id FROM ayats WHERE surah_id = ${surahIndex} AND ayat_no = ${ayaIndex}
      `;

      if (rows.length === 0) {
        console.warn(`  ⚠ Not found: Surah ${surahIndex}, Ayat ${ayaIndex}`);
        continue;
      }

      const ayatId = rows[0].id;

      await sql`
        INSERT INTO translations (ayat_id, lang_code, translator, ayat_text)
        VALUES (${ayatId}, ${langCode}, ${translator}, ${text})
        ON CONFLICT (ayat_id, lang_code, translator)
        DO UPDATE SET ayat_text = EXCLUDED.ayat_text
      `;
      inserted++;
    }
  }

  console.log(`  ✓ Done. ${inserted} ayats imported.`);
}

// Run both files
await importTranslation('./scripts/translations/ar.jalalayn.xml', 'ar', 'jalalayn');
// await importTranslation('./scripts/translations/bn.hoque.xml', 'bn', 'hoque');
await importTranslation('./scripts/translations/bn.khan.xml', 'bn', 'khan');
await importTranslation('./scripts/translations/ms.basmeih.xml', 'ms', 'basmeih');

console.log('\n✅ All done!');