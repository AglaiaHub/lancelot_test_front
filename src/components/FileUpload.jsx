import React, { useState } from "react";
import AWS from "aws-sdk";

function FileUpload() {
    const [file, setFile] = useState(null);

    const uploadFile = async () => {
        if (!file) return;

        const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;
        const REGION = process.env.REACT_APP_AWS_REGION;

        AWS.config.update({
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        });

        const s3 = new AWS.S3({
            params: { Bucket: S3_BUCKET },
            region: REGION,
        });

        const params = {
            Bucket: S3_BUCKET,
            Key: file.name,
            Body: file,
        };

        try {
            const upload = s3
                .putObject(params)
                .on("httpUploadProgress", (evt) => {
                    console.log(
                        "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
                    );
                })
                .promise();

            await upload;

            const ext = file.name.split('.').pop().toLowerCase();
            const extensionMap = {
                'jpg': 'img',
                'jpeg': 'img',
                'png': 'img',
                'gif': 'img',
                'txt': 'txt',
                'csv': 'csv'
            };
            const type = extensionMap[ext] || 'unknown';
            console.log("Detected type:", type);

            const publicUrl = `https://s3.${REGION}.amazonaws.com/${S3_BUCKET}/${file.name}`; // 🔹 CHANGED
            console.log("File uploaded to:", publicUrl);

            console.log("Sending POST to backend:", {
                file: publicUrl,
                type: type
            });

            const response = await fetch("http://localhost:8080/tasks/transform", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    file: publicUrl,
                    type: type
                })
            });

            if (!response.ok) {
                throw new Error(`Backend error: ${response.statusText}`);
            }

            const result = await response.json();
            console.log("Backend response:", result);
            alert(`File uploaded and sent to backend successfully!\nType: ${type}`);


        } catch (err) {
            console.error("Upload error:", err);
            alert("Upload failed: " + err.message);
        }
    };

    return (
        <div>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={uploadFile} disabled={!file}>
                Upload to S3
            </button>
        </div>
    );
}

export default FileUpload;
