import React, { useState } from "react";
import axios from "axios";

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
            setResult(response.data);
        } catch (error) {
            console.error("Upload failed:", error);
        }
        setLoading(false);
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>📜 AI Legal Document Simplifier</h1>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleUpload} disabled={loading} style={{ marginLeft: "10px" }}>
                {loading ? "Uploading..." : "Upload & Simplify"}
            </button>

            {result && (
                <div style={{ marginTop: "20px", textAlign: "left", maxWidth: "600px", margin: "auto" }}>
                    <h2>🔍 Simplified Document</h2>
                    <p dangerouslySetInnerHTML={{ __html: result.simplified_text.replace(/\n/g, "<br>") }} />
                </div>
            )}
        </div>
    );
}

export default App;
