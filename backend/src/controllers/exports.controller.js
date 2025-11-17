const Book = require("../models/Book");
const { generateDocx } = require("../utils/docx.generator");
const { generatePdf } = require("../utils/pdf.generator");

async function exportAsDocx(req, res) {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({ error: "No such book exists!" });
    }

    if (book.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        error:
          "You are not authorized to perform any operations on the requested book!",
      });
    }

    const docBuffer = await generateDocx(book);

    // force binary download friendly headers (helps clients like Postman/axios)
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${book.title.replace(/[^a-zA-Z0-9]/g, "_")}.docx"`
    );
    res.setHeader("Content-Length", docBuffer.length);
    res.setHeader("Content-Transfer-Encoding", "binary"); // tell client this is binary
    res.setHeader("Cache-Control", "no-cache"); // avoid caching weirdness in dev

    res.send(docBuffer);
  } catch (error) {
    console.error("Error exporting as DOCX:", error);

    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
}

async function exportAsPdf(req, res) {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({ error: "No such book exists!" });
    }

    if (book.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        error:
          "You are not authorized to perform any operations on the requested book!",
      });
    }

    // set binary headers before piping PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${book.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf"`
    );
    res.setHeader("Content-Transfer-Encoding", "binary");
    res.setHeader("Cache-Control", "no-cache");

    // generate PDF and pipe directly to response (generatePdf handles piping)
    await generatePdf(book, res);
  } catch (error) {
    console.error("Error exporting as PDF:", error);

    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = { exportAsDocx, exportAsPdf };
