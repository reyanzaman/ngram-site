"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Populate() {
    if (process.env.NODE_ENV === "production") {
        return null; // Hide the page in production
    }

    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please upload a file!");
            return;
        }

        setLoading(true);

        // FormData to send to backend
        const formData = new FormData();
        formData.append("file", file);

        try {
            // const res = await fetch("/api/populate//upload-primary-topics", {
            const res = await fetch("/api/populate//upload-topic-link-bigrams", {
            // const res = await fetch("/api/populate/upload-tri-grams", {
            // const res = await fetch("/api/populate//upload-four-grams", {
            // const res = await fetch("/api/populate//upload-five-grams", {
            // const res = await fetch("/api/populate/upload-surahs", {
            // const res = await fetch("/api/populate/upload-ayats", {
            // const res = await fetch("/api/populate/upload-bi-gram-links", {
            // const res = await fetch("/api/populate/upload-tri-gram-links", {
            // const res = await fetch("/api/populate/upload-four-gram-links", {
            // const res = await fetch("/api/populate/upload-five-gram-links", {
            // const res = await fetch("/api/populate/upload-bi-gram-portions", {
            // const res = await fetch("/api/populate/upload-tri-gram-portions", {
            // const res = await fetch("/api/populate/upload-four-gram-portions", {
            // const res = await fetch("/api/populate/upload-five-gram-portions", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message || "File uploaded successfully!");
            } else {
                toast.error(data.error || "Error uploading file.");
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold mb-0 pb-0">Database Population Page</h1>
            
            <hr className="border border-zinc-500 w-1/3 mb-4 mt-0 pt-0"></hr>


            {/* <h3 className="text-xl">Primary Topic CSV Populate</h3> */}
            <h3 className="text-xl">Primary Topics Link BiGram CSV Populate</h3>
            {/* <h3 className="text-xl">Bi Gram CSV Populate</h3> */}
            {/* <h3 className="text-xl">Tri Gram CSV Populate</h3> */}
            {/* <h3 className="text-xl">Four Gram CSV Populate</h3> */}
            {/* <h3 className="text-xl">Five Gram CSV Populate</h3> */}
            {/* <h3 className="text-xl">Surah CSV Populate</h3> */}
            {/* <h3 className="text-xl">Ayat CSV Populate</h3> */}
            {/* <h3 className="text-xl">Bi Gram Ayat Link</h3> */}
            {/* <h3 className="text-xl">Tri Gram Ayat Link</h3> */}
            {/* <h3 className="text-xl">Four Gram Ayat Link</h3> */}
            {/* <h3 className="text-xl">Five Gram Ayat Link</h3> */}
            {/* <h3 className="text-xl">Bi Gram Portions</h3> */}
            {/* <h3 className="text-xl">Tri Gram Portions</h3> */}
            {/* <h3 className="text-xl">Four Gram Portions</h3> */}
            {/* <h3 className="text-xl">Five Gram Portions</h3> */}

            {/* File Input */}
            <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="border p-2"
                disabled={loading}
            />
            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                className="bg-lime-800 text-white px-4 py-2 rounded hover:bg-lime-600"
                disabled={loading}
            >
                {loading ? "Uploading..." : "Submit"}
            </button>

            {/* Toast notifications */}
            <ToastContainer />
        </div>
    );
}