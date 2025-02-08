import React, { useState } from "react";
import axios from "axios";
import Chatbot from "./components/Chatbot";

function App() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file.");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(
                "http://localhost:8000/process-legal-document/",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            // Ensure the response has all the required fields
            setResult({
                simplified_text: response.data.simplified_text || "No summary available.",
                key_terms: response.data.key_terms || "No key terms found.",
                risky_clauses: response.data.risky_clauses || "No risky clauses detected."
            });

        } catch (error) {
            console.error("Upload failed:", error);
            setResult({
                simplified_text: "Error processing document.",
                key_terms: "Error fetching key terms.",
                risky_clauses: "Error detecting risky clauses."
            });
        }
        setLoading(false);
    };

    return (
        <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>📜 AI Legal Document Simplifier</h1>
            <Chatbot />

            {/* ✅ Upload File */}
            <div>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <button onClick={handleUpload} disabled={loading} style={{ marginLeft: "10px" }}>
                    {loading ? "Uploading..." : "Upload & Simplify"}
                </button>
            </div>

            {/* ✅ Display Simplified Document */}
            {result && result.simplified_text && (
                <div style={{ marginTop: "20px", textAlign: "left", padding: "20px", background: "#f9f9f9", borderRadius: "8px" }}>
                    <h2>📌 Simplified Document</h2>
                    <p dangerouslySetInnerHTML={{ __html: result.simplified_text.replace(/\n/g, "<br>") }} />
                </div>
            )}

            {/* ✅ Display Key Legal Terms */}
            {result && result.key_terms && (
                <div style={{ marginTop: "20px", textAlign: "left", padding: "20px", background: "#e3f2fd", borderRadius: "8px" }}>
                    <h2>📖 Key Legal Terms</h2>
                    <p dangerouslySetInnerHTML={{ __html: result.key_terms.replace(/\n/g, "<br>") }} />
                </div>
            )}

            {/* ✅ Display Risky Clauses */}
            {result && result.risky_clauses && (
                <div style={{ marginTop: "20px", textAlign: "left", padding: "20px", background: "#ffebee", borderRadius: "8px" }}>
                    <h2>⚠️ Risky Clauses Detected</h2>
                    <p style={{ color: "red" }} dangerouslySetInnerHTML={{ __html: result.risky_clauses.replace(/\n/g, "<br>") }} />
                </div>
            )}
        </div>
    );
}

export default App;
