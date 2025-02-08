import FormUpload from "./components/FormUpload";
import UserForms from "./components/UserForms";

function App() {
    const userId = "user123";  // Replace with dynamic user ID handling

    return (
        <div>
            <h1>AI-Powered Form Helper</h1>
            <FormUpload userId={userId} />
            <UserForms userId={userId} />
        </div>
    );
}

export default App;
