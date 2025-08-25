import React, {useState} from "react";
import AWS from "aws-sdk";
import Spinner from "./Spinner";

function FileUpload({ setFiles, setLoading }) {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const uploadFile = async () => {
        if (!file) return;

        setIsLoading(true);

        const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;
        const REGION = process.env.REACT_APP_AWS_REGION;

        AWS.config.update({
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        });

        const s3 = new AWS.S3({
            params: {Bucket: S3_BUCKET},
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


            if (response.ok) {
                setIsLoading(false);
                console.log("Backend accepted the file:", response.status);
                alert(`File uploaded and sent to backend successfully!\nType: ${type}`);

                setFiles(prevFiles => [...prevFiles, file.name]);

            } else {
                setIsLoading(false);
                console.error("Backend returned error:", response.status, response.statusText);
                alert("Backend error: " + response.statusText);
            }

        } catch (err) {
            setIsLoading(false);
            console.error("Upload error:", err);
            alert("Upload failed: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <input type="file" onChange={(e) => setFile(e.target.files[0])}/>
            <button onClick={uploadFile} disabled={!file || isLoading}>
                Upload to S3
            </button>

            {isLoading && <Spinner />}
        </div>
    );
}

export default FileUpload;
