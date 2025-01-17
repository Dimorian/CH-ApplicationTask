import React from 'react';
import { useDropzone } from 'react-dropzone';
import './DropZone.css';

interface DropZoneProps {
  onFilesDrop: (files: File[]) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ onFilesDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': [] },
    onDrop: (acceptedFiles) => {
      onFilesDrop(acceptedFiles);
    },
  });

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      <h3>&#128462;⮷</h3>
    </div>
  );
};

export default DropZone;
