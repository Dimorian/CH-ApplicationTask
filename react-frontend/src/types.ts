export interface FileTileProps {
  fileName: string;
  fileSize: number;
  text: string | null;
  isUploaded: boolean;
  copiedFileName: string;
  setCopiedFileName: (fileName: string | null) => void;
}