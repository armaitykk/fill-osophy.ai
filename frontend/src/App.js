import React, { useState } from "react";
import axios from "axios";
import Chatbot from "./components/Chatbot";
import Header from "./components/Header";

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
        <div style={{ textAlign: "center", paddingBottom: "20px", fontFamily: "Arial, sans-serif" }}>
            <Header />

            <Chatbot />

            {/* ✅ Upload File */}
            <div className="upload-section">
            <label className="file-input-label">
                        Choose File
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="file-input" />
                    </label>                    <button onClick={handleUpload} disabled={loading} className="upload-button">
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

            {/* Styles */}
            <style>
                {`
                    .header-bar {
                        background-color: #002f6c;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 15px;
                    }

                    .logo {
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        margin-right: 10px;
                    }

                    .title {
                        color: white;
                        font-size: 24px;
                        font-weight: bold;
                    }

                    .container {
                        text-align: center;
                        padding: 20px;
                        font-family: Arial, sans-serif;
                    }

                    .main-title {
                        font-size: 28px;
                        margin-bottom: 20px;
                    }

                    .upload-section {
                        margin: 20px 0;
                    }

                    .upload-button {
                        background-color: white;
                        color: #6c8f7c;
                        border-color: 6c8f7c;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                        margin-left: 10px;
                        transition: background-color 0.3s ease;
                    }

                    .upload-button:hover {
                        background-color: #4d6f5c;
                        color: white;
                    }

                    .file-input-label {
                        background-color: #6c8f7c;
                        color: white;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                        transition: background-color 0.3s ease;
                    }

                    .file-input-label:hover {
                        background-color: #4d6f5c;
                    }

                    .file-input {
                        display: none;
                    }
                    .section {
                        margin-top: 20px;
                        padding: 20px;
                        border-radius: 8px;
                        text-align: left;
                    }

                    .simplified_text {
                        background: #fff3e9;
                    }

                    .key-terms {
                        background: #e3f2fd;
                    }

                    .risky-clauses {
                        background: #ffebee;
                    }
                `}
            </style>
        </div>
        
    );
}

export default App;
