import './FileTile.css';
import React, { useState } from 'react';
import { FileTileProps } from './types.ts';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const FileTile: React.FC<FileTileProps> = ({ fileName, fileSize, text, isUploaded, copiedFileName, setCopiedFileName },) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isActive = (text !== null);

  const handleToggle = () => {
    if (isActive) {
      setIsExpanded((prev) => !prev);
    }
  };

  const handleCopyClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setCopiedFileName(fileName);
  };

  const handleDownloadClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    const element = document.createElement("a");
    const file = new Blob([text || ''], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${fileName}.txt`;
    document.body.appendChild(element); 
    element.click();
  };

  console.log("isUploaded:" + isUploaded);
  console.log("text:" + text);
  return (
    <li className={`file-tile ${isExpanded ? 'expanded' : ''} ${isActive ? '' : 'inactive'}`} onClick={handleToggle}>
      <div className="file-tile-header flex-space-between">
      <h3>{isActive ? (isExpanded? (<>&nbsp;▶  </>):  (<> ▼ </>)) : ''}{fileName}</h3>
        <div className="file-tile-header-info">
          <p>{isUploaded && ((text?.length || 0) + ' characters - ')}{fileSize} KB</p>
          {isActive && <CopyToClipboard text={text || ''}>
            <span className="copy-btn" title="Copy text content to clipboard" style={{ cursor: 'pointer' }} onClick={handleCopyClick}>
            {copiedFileName === fileName ? '✔' : '🗐'}
            </span>
          </CopyToClipboard>}
          {isActive && <span className="download-btn" title="Download text content as txt-file" style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={handleDownloadClick}>
          🖫
          </span>}
        </div>
      </div>
      {isExpanded && (
        <div className="file-tile-content">
          {isActive ? (
            <>
              <p className="flex-space-between">
              </p>
              <p>{text}</p>
            </>
          ) : (
            <p>No text</p> //shouldnt ever be visible
          )}
        </div>
      )}
    </li>
  );
};
export default FileTile;
