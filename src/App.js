import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import FileList from "./components/FileList";
import "./App.css";

function App() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    return (
        <div className="App">
            <h1>Hello World</h1>

            <div className="upload-container">
                <h2>Upload File</h2>
                <FileUpload setFiles={setFiles} setLoading={setLoading} />
                {loading && <p className="loading-text">Loading...</p>}
            </div>

                <FileList files={files} loading={loading} />
        </div>
    );
}

export default App;
