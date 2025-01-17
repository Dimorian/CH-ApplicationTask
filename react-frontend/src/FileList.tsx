import React, { useState } from 'react';
import FileTile from './FileTile';
import './FileList.css'
import {FileTileProps} from './types.ts';
interface FileListProps {
  selectedFiles: File[];
  uploadedFiles: FileTileProps[];
}

const FileList: React.FC<FileListProps> = ({ selectedFiles, uploadedFiles }) => {
  
  const [copiedFileName, setCopiedFileName] = useState<string | null>(null);

  if (selectedFiles.length === 0) {
    return null;
  }
  
  return (
    <ul className="file-list">
      {selectedFiles.map((file, index) => {
        const toAscii = (str: string) => str.replace(/[^a-zA-Z0-9]/g, '');

        const uploadedFile = uploadedFiles.find((f) => {
          const filteredFileName = toAscii(f.fileName);
          const filteredInputName = toAscii(file.name);

          return filteredFileName === filteredInputName;
      });
        
        //console.log("uploadedFile: ")
        //console.log(uploadedFile);
        
        return (
          <FileTile
            key={index}
            fileName={file.name}
            fileSize={Math.round(file.size / 1024)}
            text={uploadedFile?.text || null}
            isUploaded={!!uploadedFile} //uploadedFile ? true:false
            copiedFileName={copiedFileName || ''}
            setCopiedFileName={setCopiedFileName}
          />
        );
      })}
    </ul>
  );
};

export default FileList;
