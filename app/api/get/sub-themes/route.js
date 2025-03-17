import { NextResponse } from "next/server";
import DbUtils from "@/app/api/database/db"
import { pool } from "@/app/api/database/db";

export async function GET(req) {
    try {
        // Extract theme from query params
        const theme = req.nextUrl.searchParams.get('theme');

        if (!theme) {
            return NextResponse.json({ error: "Theme is required" }, { status: 400 });
        }

        // Check database connection
        const isDbConnected = await DbUtils.checkConnection();
        if (!isDbConnected) {
            return NextResponse.json({ error: "Failed to connect to the database" }, { status: 500 });
        }

        // SQL query for retrieving data
        const getQuery = `SELECT * FROM tri_grams WHERE bi_gram_id = $1;`;

        const client = await pool.connect();
        try {
            console.log("Starting database transaction...");
            const result = await client.query(getQuery, [theme]);
            const subThemes = result.rows;

            console.log("Sub Themes retrieved successfully!");
            return NextResponse.json({ subThemes });
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