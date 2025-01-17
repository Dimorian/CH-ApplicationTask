import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import multer, { FileFilterCallback } from 'multer';

import { PDFExtract, PDFExtractOptions } from 'pdf.js-extract';
const pdfExtract = new PDFExtract();
const options: PDFExtractOptions = {};

const app = express();
const PORT = 5000;

interface MulterFile {
  originalname: string;
  mimetype: string;
  path: string;
}

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb: FileFilterCallback) => {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
      'utf8',
    );
    if (file.mimetype !== 'application/pdf') {
      return cb(null, false);
    } else {
      cb(null, true);
    }
  },
});

app.use(express.json());
app.use((req, res, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/api/upload', upload.array('files'), async (req: Request, res: Response): Promise<void> => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    res.status(400).json({ message: 'No files uploaded' });
    return;
  }

  try {
    const results: { fileName: string; text: string }[] = [];
    for (const file of files) {
      const dataBuffer = fs.readFileSync(file.path);
      //console.log(dataBuffer);
      //console.log('FileName: ', file.originalname);
      fs.unlinkSync(file.path);
      const data = await pdfExtract.extractBuffer(dataBuffer);

      let extractedText = '';

      data.pages.forEach(page => {
        page.content.forEach(textElement => {
          extractedText += textElement.str;
        });
      });

      results.push({
        fileName: file.originalname,
        text: extractedText.trim(),
      });
    }

    res.json({
      message: 'files processed successfully',
      files: results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error while processing the data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});
