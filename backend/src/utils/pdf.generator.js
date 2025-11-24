const PDFDocument = require("pdfkit");
const MarkdownIt = require("markdown-it");
const path = require("path");
const fs = require("fs");

const md = new MarkdownIt();

const PDF_CONFIG = {
  fonts: {
    heading: "Helvetica-Bold",
    body: "Helvetica",
    code: "Courier",
  },
  sizes: {
    title: 32,
    subtitle: 20,
    author: 16,
    chapterTitle: 24,
    h1: 18,
    h2: 16,
    h3: 14,
    body: 11,
    code: 9,
  },
  colors: {
    title: "#1a202c",
    subtitle: "#4a5568",
    author: "#2d3748",
    chapterTitle: "#1a202c",
    heading: "#1a202c",
    body: "#000000",
    code: "#d63384",
    codeBlock: "#e2e8f0",
    codeBg: "#1e293b",
  },
  margins: {
    top: 72,
    bottom: 72,
    left: 72,
    right: 72,
  },
  spacing: {
    paragraphGap: 12,
    chapterGap: 40,
    headingGap: 20,
    listItemGap: 8,
  },
};

function parseInlineMarkdown(text) {
  const segments = [];

  const patterns = [
    { regex: /`([^`]+)`/g, type: "code" }, // must come first to avoid conflicts
    { regex: /\*\*(.+?)\*\*/g, type: "bold" },
    { regex: /\*(.+?)\*/g, type: "italic" },
    { regex: /__(.+?)__/g, type: "bold" },
    { regex: /_(.+?)_/g, type: "italic" },
  ];

  const matches = [];
  patterns.forEach((pattern) => {
    let match;
    const regex = new RegExp(pattern.regex.source, "g");

    while ((match = regex.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: regex.lastIndex,
        text: match[1],
        type: pattern.type,
      });
    }
  });

  matches.sort((a, b) => a.start - b.start);

  let processedUntil = 0;
  matches.forEach((match) => {
    if (match.start > processedUntil) {
      segments.push({
        text: text.substring(processedUntil, match.start),
        type: "plain",
      });
    }

    segments.push({
      text: match.text,
      type: match.type,
    });

    processedUntil = match.end;
  });

  if (processedUntil < text.length) {
    segments.push({
      text: text.substring(processedUntil),
      type: "plain",
    });
  }

  return segments.length > 0 ? segments : [{ text, type: "plain" }];
}

function processMdContentForPdf(doc, mdContent) {
  if (!mdContent || mdContent.trim() === "") {
    return;
  }

  const tokens = md.parse(mdContent, {});
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];

    try {
      // HANDLE HEADINGS
      if (token.type === "heading_open") {
        const level = parseInt(token.tag.slice(1), 10);
        const nextToken = tokens[i + 1];

        if (nextToken && nextToken.type === "inline") {
          let fontSize;

          switch (level) {
            case 1:
              fontSize = PDF_CONFIG.sizes.h1;
              break;
            case 2:
              fontSize = PDF_CONFIG.sizes.h2;
              break;
            case 3:
              fontSize = PDF_CONFIG.sizes.h3;
              break;
            default:
              fontSize = PDF_CONFIG.sizes.h3;
          }

          if (doc.y > doc.page.height - PDF_CONFIG.margins.bottom - 100) {
            doc.addPage();
          }

          doc.moveDown(1);
          doc
            .font(PDF_CONFIG.fonts.heading)
            .fontSize(fontSize)
            .fillColor(PDF_CONFIG.colors.heading)
            .text(nextToken.content, {
              align: "left",
            });

          doc.moveDown(0.5);

          i += 2;
          continue;
        }
      }

      // Code blocks
      if (token.type === "fence" || token.type === "code_block") {
        const codeLines = token.content
          .split("\n")
          .filter((line) => line.trim());

        if (doc.y > doc.page.height - PDF_CONFIG.margins.bottom - 150) {
          doc.addPage();
        }

        doc.moveDown(0.5);

        // Add language label if present
        if (token.info && token.info.trim()) {
          doc
            .font(PDF_CONFIG.fonts.body)
            .fontSize(8)
            .fillColor("#64748b")
            .text(
              `Language: ${token.info.trim()}`,
              PDF_CONFIG.margins.left + 20,
              doc.y,
              { lineBreak: false }
            );
          doc.moveDown(0.3);
        }

        codeLines.forEach((line) => {
          const lineHeight = PDF_CONFIG.sizes.code + 6;

          // Dark background for code blocks
          doc
            .rect(
              PDF_CONFIG.margins.left + 10,
              doc.y,
              doc.page.width -
                PDF_CONFIG.margins.left -
                PDF_CONFIG.margins.right -
                20,
              lineHeight
            )
            .fill(PDF_CONFIG.colors.codeBg);

          doc
            .font(PDF_CONFIG.fonts.code)
            .fontSize(PDF_CONFIG.sizes.code)
            .fillColor(PDF_CONFIG.colors.codeBlock)
            .text(line || " ", PDF_CONFIG.margins.left + 20, doc.y, {
              lineBreak: false,
            });

          doc.moveDown(0.3);
        });

        doc.moveDown(0.5);
        i++;
        continue;
      }

      // HANDLE PARAGRAPHS
      if (token.type === "paragraph_open") {
        const nextToken = tokens[i + 1];

        if (nextToken && nextToken.type === "inline" && nextToken.content) {
          if (doc.y > doc.page.height - PDF_CONFIG.margins.bottom - 100) {
            doc.addPage();
          }

          doc.moveDown(0.5);

          doc
            .font(PDF_CONFIG.fonts.body)
            .fontSize(PDF_CONFIG.sizes.body)
            .fillColor(PDF_CONFIG.colors.body);

          const segments = parseInlineMarkdown(nextToken.content);
          segments.forEach((segment) => {
            if (segment.type === "code") {
              // inline code styling
              doc
                .font(PDF_CONFIG.fonts.code)
                .fontSize(PDF_CONFIG.sizes.code)
                .fillColor(PDF_CONFIG.colors.code)
                .text(segment.text, { continued: true });
            } else if (segment.type === "bold") {
              doc
                .font("Helvetica-Bold")
                .fontSize(PDF_CONFIG.sizes.body)
                .fillColor(PDF_CONFIG.colors.body)
                .text(segment.text, { continued: true });
            } else if (segment.type === "italic") {
              doc
                .font("Helvetica-Oblique")
                .fontSize(PDF_CONFIG.sizes.body)
                .fillColor(PDF_CONFIG.colors.body)
                .text(segment.text, { continued: true });
            } else {
              doc
                .font(PDF_CONFIG.fonts.body)
                .fontSize(PDF_CONFIG.sizes.body)
                .fillColor(PDF_CONFIG.colors.body)
                .text(segment.text, { continued: true });
            }
          });

          doc.text("");
          doc.moveDown(0.5);

          i += 2;
          continue;
        }
      }

      // HANDLE BULLET LISTS
      if (token.type === "bullet_list_open") {
        doc.moveDown(0.5);
        i++;

        while (i < tokens.length && tokens[i].type !== "bullet_list_close") {
          if (tokens[i].type === "list_item_open") {
            i++;

            if (tokens[i] && tokens[i].type === "paragraph_open") {
              i++;

              if (tokens[i] && tokens[i].type === "inline") {
                const segments = parseInlineMarkdown(tokens[i].content);

                doc
                  .font(PDF_CONFIG.fonts.body)
                  .fontSize(PDF_CONFIG.sizes.body)
                  .fillColor(PDF_CONFIG.colors.body)
                  .text("• ", PDF_CONFIG.margins.left + 20, doc.y, {
                    continued: true,
                  });

                segments.forEach((segment) => {
                  if (segment.type === "code") {
                    doc
                      .font(PDF_CONFIG.fonts.code)
                      .fontSize(PDF_CONFIG.sizes.code)
                      .fillColor(PDF_CONFIG.colors.code);
                  } else if (segment.type === "bold") {
                    doc.font("Helvetica-Bold").fontSize(PDF_CONFIG.sizes.body);
                  } else if (segment.type === "italic") {
                    doc
                      .font("Helvetica-Oblique")
                      .fontSize(PDF_CONFIG.sizes.body);
                  } else {
                    doc
                      .font(PDF_CONFIG.fonts.body)
                      .fontSize(PDF_CONFIG.sizes.body);
                  }
                  doc.fillColor(PDF_CONFIG.colors.body);
                  doc.text(segment.text, { continued: true });
                });

                doc.text("");
                doc.moveDown(0.3);
              }
            }
          }
          i++;
        }

        doc.moveDown(0.5);
        i++;
        continue;
      }

      // HANDLE ORDERED LISTS
      if (token.type === "ordered_list_open") {
        doc.moveDown(0.5);
        let listCounter = 1;
        i++;

        while (i < tokens.length && tokens[i].type !== "ordered_list_close") {
          if (tokens[i].type === "list_item_open") {
            i++;

            if (tokens[i] && tokens[i].type === "paragraph_open") {
              i++;

              if (tokens[i] && tokens[i].type === "inline") {
                const segments = parseInlineMarkdown(tokens[i].content);

                doc
                  .font(PDF_CONFIG.fonts.body)
                  .fontSize(PDF_CONFIG.sizes.body)
                  .fillColor(PDF_CONFIG.colors.body)
                  .text(
                    `${listCounter}. `,
                    PDF_CONFIG.margins.left + 20,
                    doc.y,
                    {
                      continued: true,
                    }
                  );

                segments.forEach((segment) => {
                  if (segment.type === "code") {
                    doc
                      .font(PDF_CONFIG.fonts.code)
                      .fontSize(PDF_CONFIG.sizes.code)
                      .fillColor(PDF_CONFIG.colors.code);
                  } else if (segment.type === "bold") {
                    doc.font("Helvetica-Bold").fontSize(PDF_CONFIG.sizes.body);
                  } else if (segment.type === "italic") {
                    doc
                      .font("Helvetica-Oblique")
                      .fontSize(PDF_CONFIG.sizes.body);
                  } else {
                    doc
                      .font(PDF_CONFIG.fonts.body)
                      .fontSize(PDF_CONFIG.sizes.body);
                  }
                  doc.fillColor(PDF_CONFIG.colors.body);
                  doc.text(segment.text, { continued: true });
                });

                doc.text("");
                doc.moveDown(0.3);
                listCounter++;
              }
            }
          }
          i++;
        }

        doc.moveDown(0.5);
        i++;
        continue;
      }

      i++;
    } catch (error) {
      console.error("Error processing PDF token:", token, error);
      i++;
    }
  }
}

// GENERATE PDF AND STREAM TO RESPONSE
async function generatePdf(book, res) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: PDF_CONFIG.margins,
        bufferPages: true,
      });

      doc.pipe(res);

      doc.on("error", (err) => {
        console.error("PDF generation error:", err);
        reject(err);
      });

      // COVER PAGE
      if (book.coverImage && !book.coverImage.includes("pravatar")) {
        const rel = book.coverImage.replace(/^\//, "");
        const imagePath = path.join(__dirname, "../../", rel);

        try {
          if (fs.existsSync(imagePath)) {
            doc.image(imagePath, {
              fit: [400, 550],
              align: "center",
              valign: "center",
            });

            doc.addPage();
          } else {
            console.warn(`PDF cover image not found at path: ${imagePath}`);
          }
        } catch (imgErr) {
          console.error(`Could not embed cover image: ${imagePath}`, imgErr);
        }
      }

      // TITLE PAGE
      doc.moveDown(8);

      doc
        .font(PDF_CONFIG.fonts.heading)
        .fontSize(PDF_CONFIG.sizes.title)
        .fillColor(PDF_CONFIG.colors.title)
        .text(book.title, {
          align: "center",
        });

      doc.moveDown(2);

      if (book.subtitle && book.subtitle.trim()) {
        doc
          .fontSize(PDF_CONFIG.sizes.subtitle)
          .fillColor(PDF_CONFIG.colors.subtitle)
          .text(book.subtitle, {
            align: "center",
          });

        doc.moveDown(2);
      }

      doc
        .fontSize(PDF_CONFIG.sizes.author)
        .fillColor(PDF_CONFIG.colors.author)
        .text(`by ${book.author}`, {
          align: "center",
        });

      doc.moveDown(2);

      doc
        .moveTo(doc.page.width / 2 - 100, doc.y)
        .lineTo(doc.page.width / 2 + 100, doc.y)
        .stroke("#4f46e5");

      // PROCESS CHAPTERS
      (book?.chapters || []).forEach((chapter, index) => {
        try {
          doc.addPage();

          doc
            .font(PDF_CONFIG.fonts.heading)
            .fontSize(PDF_CONFIG.sizes.chapterTitle)
            .fillColor(PDF_CONFIG.colors.chapterTitle)
            .text(chapter.title, {
              align: "left",
            });

          doc.moveDown(2);

          processMdContentForPdf(doc, chapter.content || "");
        } catch (chapterErr) {
          console.error(
            `Error processing chapter ${index + 1} for PDF:`,
            chapterErr
          );
        }
      });

      doc.end();

      doc.on("end", () => {
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generatePdf };
