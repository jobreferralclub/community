// import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import path from 'path';
import fs from 'fs';
import pdfParser from "pdf-parser";

// Extract first email found
function extractEmail(text) {
    const pattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = text.match(pattern);
    return matches ? matches[0] : null;
}

// Extract text + email from file
export const extractTextAndEmail = async (file) => {
    const fileName = file.originalname || file.filename || file.name || 'unknown';

    let text = '';

    const ext = path.extname(file.originalname).toLowerCase();
    console.log(file.originalname, ext)

    if (ext === ".pdf") {
        // ✅ Handle PDF
        pdfParser.pdf2json(file.path, (error, pdf) => {
            if (error) {
                console.error("❌ pdf-parser error:", error);
                return res.status(500).json({ error: "Failed to parse PDF" });
            }

            // Flatten the text content from all pages
            let extractedText = "";
            pdf.pages.forEach((page) => {
                const pageText = page.texts.map((t) => t.text).join(" ");
                extractedText += pageText + "\n";
            });

            // cleanup temp file
            fs.unlinkSync(file.path);
            text = extractedText.trim();

        });

    } else if (ext === ".docx") {
        // ✅ Handle DOCX with mammoth
        const { value } = await mammoth.extractRawText({ path: file.path });
        text = value.trim()

    } else {
        // ❌ Unsupported
        fs.unlinkSync(file.path);
        return res.status(400).json({ error: "Unsupported file type. Only PDF and DOCX are allowed." });
    }

    const email = extractEmail(text);

    return {
        file_name: fileName,
        email: email || 'Not Found',
        text: text.trim()
    };
}
