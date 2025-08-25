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

            const publicUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${file.name}`;
            console.log("File uploaded to:", publicUrl); // 🔹 CHANGED
            alert(`File uploaded successfully!\nURL: ${publicUrl}`); // 🔹 CHANGED
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
