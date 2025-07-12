import { NextResponse } from "next/server";
import DbUtils from "@/app/api/database/db"
import { pool } from "@/app/api/database/db";

export async function GET() {
    try {
        const isDbConnected = await DbUtils.checkConnection();
        if (!isDbConnected) {
            return NextResponse.json({ error: "Failed to connect to the database" }, { status: 500 });
        }

        const getQuery = `SELECT * FROM bi_grams;`;

        const client = await pool.connect();
        try {
            const result = await client.query(getQuery);
            const themes = result.rows;
            return NextResponse.json({ themes });
        } catch (error) {
            return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
        } finally {
            client.release();
        }
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
