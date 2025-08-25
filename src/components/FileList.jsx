import React, { useState } from "react";

function FileList({ files, loading }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFileContent, setSelectedFileContent] = useState([]);
    const [fetchingFile, setFetchingFile] = useState(false);

    const itemsPerPage = 10;

    if (files.length === 0) {
        return <p>No files uploaded yet.</p>;
    }

    const totalPages = Math.ceil(files.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentFiles = files.slice(startIndex, startIndex + itemsPerPage);

    const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    const handleClick = async (fileName) => {
        setFetchingFile(true);
        setSelectedFileContent([]);
        try {
            const response = await fetch(`http://localhost:8080/tasks/${fileName}`);
            if (!response.ok) {
                throw new Error(`Error fetching file: ${response.statusText}`);
            }

            const data = await response.json(); // ожидаем JSON
            // преобразуем в массив строк вида "1. Do something"
            const tasksList = data.tasksList.map(task => `${task.number}. ${task.description}`);
            setSelectedFileContent(tasksList);

        } catch (err) {
            console.error(err);
            setSelectedFileContent([`Failed to fetch file: ${err.message}`]);
        } finally {
            setFetchingFile(false);
        }
    };

    return (
        <div>
            <h2>Uploaded files:</h2>
            <ul>
                {currentFiles.map((file, index) => (
                    <li
                        key={index}
                        style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => handleClick(file)}
                    >
                        {file}
                    </li>
                ))}
            </ul>
            {totalPages > 1 && (
                <div style={{ marginTop: "10px" }}>
                    <button onClick={handlePrev} disabled={currentPage === 1}>Previous</button>
                    <span style={{ margin: "0 10px" }}>Page {currentPage} of {totalPages}</span>
                    <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
                </div>
            )}

            {fetchingFile && <p>Loading file content...</p>}

            {selectedFileContent.length > 0 && (
                <div style={{ marginTop: "20px", whiteSpace: "pre-wrap", border: "1px solid #ccc", padding: "10px" }}>
                    <h3>File Content:</h3>
                    <ul>
                        {selectedFileContent.map((line, idx) => (
                            <li key={idx}>{line}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default FileList;
