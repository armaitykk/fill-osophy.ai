import { useEffect, useState } from "react";
import axios from "axios";

function UserForms({ userId }) {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:8000/user-forms/${userId}`)
            .then(response => {
                console.log("API Response:", response.data);
                setForms(response.data.forms || []);
            })
            .catch(error => {
                console.error("🚨 Error fetching forms:", error);
                setError("No forms found or server error.");
            })
            .finally(() => setLoading(false));
    }, [userId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>🚨 {error}</p>;

    return (
        <div>
            <h2>User Forms</h2>
            {forms.length === 0 ? (
                <p>No forms found.</p>
            ) : (
                <ul>
                    {forms.map((form, index) => (
                        <li key={index}>
                            <h3>{form.filename}</h3>
                            <p><strong>Original:</strong> {form.original_text}</p>
                            <p><strong>Simplified:</strong> {form.simplified_text}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default UserForms;
