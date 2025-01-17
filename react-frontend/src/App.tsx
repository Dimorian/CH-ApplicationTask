import React, { useState } from 'react';
import axios from 'axios';
import DropZone from './DropZone';
import FileList from './FileList';
import { FileTileProps } from './types.ts';
import './App.css';

const App: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    FileTileProps[]
  >([]);

  const handleFilesDrop = (files: File[]) => {
    setSelectedFiles((prevFiles) => {
      const mergedFiles = [...prevFiles, ...files].reduce<File[]>((acc, file) => {
        if (!acc.find((f) => f.name === file.name)) {
          acc.push(file);
        }
        return acc;
      }, []);
      return mergedFiles;
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      return;
    }

    setUploading(true);

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data; charset=utf-8',
        },
      });

      //console.log("response:");
      //console.log(response.data.files);

      setUploadedFiles(response.data.files);

    } catch (error: any) {
      console.error('Upload Error:', error.message);
      alert(`Upload Failed: ${error.response?.data?.message || error.message}`);

    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="app-container">
      <DropZone onFilesDrop={handleFilesDrop} />
      <FileList selectedFiles={selectedFiles} uploadedFiles={uploadedFiles} />
      <button
        className="uploadButton"
        onClick={handleUpload}
        disabled={selectedFiles.length === 0 || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload Files'}
      </button>
    </div>
  );
};

export default App;
