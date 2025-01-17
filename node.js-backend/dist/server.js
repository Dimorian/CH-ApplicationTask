"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const pdf_js_extract_1 = require("pdf.js-extract");
const pdfExtract = new pdf_js_extract_1.PDFExtract();
const options = {};
const app = (0, express_1.default)();
const PORT = 5000;
const upload = (0, multer_1.default)({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        if (file.mimetype !== 'application/pdf') {
            return cb(null, false);
        }
        else {
            cb(null, true);
        }
    },
});
app.use(express_1.default.json());
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/pdf; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.post('/api/upload', upload.array('files'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    if (!files || files.length === 0) {
        res.status(400).json({ message: 'No files uploaded' });
        return;
    }
    try {
        const results = [];
        for (const file of files) {
            const dataBuffer = fs_1.default.readFileSync(file.path);
            //console.log(dataBuffer);
            console.log('FileName: ', file.originalname);
            console.log('FileName: ', file.filename);
            fs_1.default.unlinkSync(file.path);
            const data = yield pdfExtract.extractBuffer(dataBuffer);
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error while processing the data' });
    }
}));
app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
});
