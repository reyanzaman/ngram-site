import { NextResponse } from "next/server";
import DbUtils from "@/app/api/database/db"
import { pool } from "@/app/api/database/db";

export async function GET(req) {
    try {
        // Extract topic from query params
        const topic = req.nextUrl.searchParams.get('topic');

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        // Check database connection
        const isDbConnected = await DbUtils.checkConnection();
        if (!isDbConnected) {
            return NextResponse.json({ error: "Failed to connect to the database" }, { status: 500 });
        }

        // SQL query for retrieving data
        const getQuery = `SELECT * FROM bi_grams WHERE topic_id = $1;`;

        const client = await pool.connect();
        try {
            console.log("Starting database transaction...");
            const result = await client.query(getQuery, [topic]);
            const themes = result.rows;

            console.log("Primary Themes retrieved successfully!");
            return NextResponse.json({ themes });
        } catch (error) {
            console.error("Error fetching data:", error);
            return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Error processing file:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}