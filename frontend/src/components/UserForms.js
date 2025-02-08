import { useEffect, useState } from "react";
import axios from "axios";

function UserForms({ userId }) {
    const [forms, setForms] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8000/user-forms/${userId}`)
            .then(response => setForms(response.data))
            .catch(error => console.error(error));
    }, [userId]);

    return (
        <div>
            <h2>Past Forms</h2>
            {forms.map((form, index) => (
                <div key={index}>
                    <h3>Form {index + 1}</h3>
                    <p><strong>Original:</strong> {form.original_text}</p>
                    <p><strong>Simplified:</strong> {form.simplified_text}</p>
                </div>
            ))}
        </div>
    );
}

export default UserForms;
