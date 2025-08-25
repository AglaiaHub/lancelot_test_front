import React, { useState } from "react";
import FileUpload from "./components/FileUpload";

function App() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    return (
        <div style={{ marginTop: "20vh", textAlign: "center" }}>
            <h1>Hello World</h1>
            <p>Если вы это видите, React работает!</p>

            <FileUpload setFiles={setFiles} setLoading={setLoading} />

            {loading && <p>Loading...</p>}

            {files.length > 0 && (
                <div>
                    <h2>Uploaded files:</h2>
                    <ul>
                        {files.map((file, index) => (
                            <li key={index}>{file}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default App;
