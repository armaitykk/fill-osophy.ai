import { useState } from "react";
import axios from "axios";

function FormUpload({ userId }) {
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!file) return alert("Please select a file!");

        setLoading(true);
        try {
            const data = new FormData();
            data.append("file", file);
            data.append("user_id", userId);

            const response = await axios.post("http://localhost:8000/process-legal-document/", data);
            setFormData(response.data);
        } catch (error) {
            console.error("🚨 Upload failed:", error);
        }
        setLoading(false);
    };

    return (
        <div>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleUpload} disabled={loading}>
                {loading ? "Uploading..." : "Upload"}
            </button>

            {formData && (
                <div>
                    <h3>Simplified Form:</h3>
                    <p>{formData.simplified_text}</p>
                </div>
            )}
        </div>
    );
}

export default FormUpload;
