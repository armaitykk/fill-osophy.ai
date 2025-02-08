import { useState } from "react";
import axios from "axios";

function FormUpload({ userId }) {
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState(null);

    const handleUpload = async () => {
        const data = new FormData();
        data.append("file", file);
        data.append("user_id", userId);

        const response = await axios.post("http://localhost:8000/process-form/", data);
        setFormData(response.data);
    };

    return (
        <div>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleUpload}>Upload</button>

            {formData && (
                <div>
                    <h3>Simplified Form:</h3>
                    <p>{formData.simplified_text}</p>
                    <h3>Autofilled Data:</h3>
                    <p>{formData.autofilled_data}</p>
                </div>
            )}
        </div>
    );
}

export default FormUpload;