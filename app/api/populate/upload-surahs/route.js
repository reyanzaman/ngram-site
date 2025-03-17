import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { Pool } from "pg";

// PostgreSQL connection string from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Check database connection
async function checkDbConnection() {
    try {
        const client = await pool.connect();
        await client.query("SELECT 1"); // Test the connection
        console.log("Database connected successfully!");
        client.release();
        return true;
    } catch (error) {
        console.error("Database connection failed:", error);
        return false;
    }
}

export async function POST(req) {
    try {
        // Check database connection
        const isDbConnected = await checkDbConnection();
        if (!isDbConnected) {
            return NextResponse.json({ error: "Failed to connect to the database" }, { status: 500 });
        }

        // Process the uploaded file
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        console.log("File uploaded, starting processing...");

        // Read and parse CSV
        const fileBuffer = await file.arrayBuffer();
        const text = Buffer.from(fileBuffer).toString("utf-8");

        // Parse CSV and remove headers
        const records = parse(text, { columns: false, skip_empty_lines: true }).slice(1);

        if (records.length === 0) {
            return NextResponse.json({ error: "CSV file is empty after removing headers" }, { status: 400 });
        }

        // SQL query for inserting data
        const insertQuery = `
            INSERT INTO surahs (id, surah_name_arabic, surah_name_english) 
            VALUES ($1, $2, $3)
            ON CONFLICT (id) DO NOTHING;
        `;

        const client = await pool.connect();
        try {
            console.log("Starting database transaction...");
            await client.query("BEGIN");

            for (const row of records) {
                const [surahId, surahNameArabic, surahNameEnglish] = [row[0], row[1], row[2]];
                try {
                    await client.query(insertQuery, [surahId, surahNameArabic, surahNameEnglish]);
                    console.log(`Inserted record: ID=${surahId}, Arabic Name=${surahNameArabic}, English Name=${surahNameEnglish}`);
                } catch (error) {
                    if (error.code === "23505") {
                        console.warn(`Conflict: Surah ID ${surahId} already exists.`);
                    } else {
                        throw error;
                    }
                }
            }

            console.log("Committing database transaction...");
            await client.query("COMMIT");
            console.log("Data inserted successfully!");

        } catch (error) {
            await client.query("ROLLBACK");
            console.error("Error during database transaction:", error);
            return NextResponse.json({ error: "Error inserting data" }, { status: 500 });
        } finally {
            client.release();
        }

        return NextResponse.json({ message: "File uploaded and surahs inserted successfully!" });

    } catch (error) {
        console.error("Error processing file:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}