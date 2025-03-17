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
        client.release(); // Release the connection back to the pool
        return true;
    } catch (error) {
        console.error("Database connection failed:", error);
        return false;
    }
}

export async function POST(req) {
    try {
        // Check database connection first
        const isDbConnected = await checkDbConnection();
        if (!isDbConnected) {
            return NextResponse.json({ error: "Failed to connect to the database" }, { status: 500 });
        }

        // Start processing the file
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        console.log("File uploaded, starting processing...");

        // Read the file and convert to text
        const fileBuffer = await file.arrayBuffer();
        const text = Buffer.from(fileBuffer).toString("utf-8");

        // Parse CSV data and remove headers
        const records = parse(text, { columns: false, skip_empty_lines: true }).slice(1); // Skip headers

        if (records.length === 0) {
            return NextResponse.json({ error: "CSV file is empty after removing headers" }, { status: 400 });
        }

        // Prepare the SQL query to insert the data
        const insertQuery = `
            INSERT INTO primary_topics (id, topic_text, topic_stemmed) 
            VALUES ($1, $2, $3)
            ON CONFLICT (id) 
            DO UPDATE SET 
                topic_text = EXCLUDED.topic_text,
                topic_stemmed = EXCLUDED.topic_stemmed;
        `;

        const client = await pool.connect();
        try {
            console.log("Starting database transaction...");

            await client.query("BEGIN"); // Start a transaction

            // Insert all records
            for (const row of records) {
                const [id, topicText, topicStemmed] = row;
                console.log(`Inserting record with ID: ${id}`); // Log each insertion
                await client.query(insertQuery, [id, topicText, topicStemmed]);
            }

            console.log("Committing database transaction...");
            await client.query("COMMIT"); // Commit the transaction
            console.log("Data inserted/updated successfully!");

        } catch (error) {
            await client.query("ROLLBACK"); // Rollback on error
            console.error("Error during database transaction:", error);
            return NextResponse.json({ error: "Error inserting data" }, { status: 500 });
        } finally {
            client.release(); // Release the client
        }

        return NextResponse.json({ message: "File uploaded and data inserted successfully!" });

    } catch (error) {
        console.error("Error processing file:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}