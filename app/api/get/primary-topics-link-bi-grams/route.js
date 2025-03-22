import { NextResponse } from "next/server";
import DbUtils from "@/app/api/database/db"
import { pool } from "@/app/api/database/db";

export async function GET(req) {
    try {
        // Check database connection
        const isDbConnected = await DbUtils.checkConnection();
        if (!isDbConnected) {
            return NextResponse.json({ error: "Failed to connect to the database" }, { status: 500 });
        }

        // SQL query for retrieving data
        const getQuery = `SELECT * FROM primary_topics_link_bi_grams;`;

        const client = await pool.connect();
        try {
            console.log("Starting database transaction...");
            const result = await client.query(getQuery);
            const links = result.rows;

            console.log("Primary Topics Links retrieved successfully!");
            return NextResponse.json({ links });
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