import { NextResponse } from "next/server";
import DbUtils from "@/app/api/database/db"
import { pool } from "@/app/api/database/db";

export async function GET(req) {
    try {
        // Extract theme from query params
        const subtheme = req.nextUrl.searchParams.get('subtheme');

        if (!subtheme) {
            return NextResponse.json({ error: "Sub-Theme is required" }, { status: 400 });
        }

        // Check database connection
        const isDbConnected = await DbUtils.checkConnection();
        if (!isDbConnected) {
            return NextResponse.json({ error: "Failed to connect to the database" }, { status: 500 });
        }

        // SQL query for retrieving data
        const getQuery = `SELECT * FROM four_grams WHERE tri_gram_id = $1;`;

        const client = await pool.connect();
        try {
            console.log("Starting database transaction...");
            const result = await client.query(getQuery, [subtheme]);
            const thematicTopics = result.rows;

            console.log("Thematic Topics retrieved successfully!");
            return NextResponse.json({ thematicTopics });
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