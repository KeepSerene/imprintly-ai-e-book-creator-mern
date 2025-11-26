const PDFDocument = require("pdfkit");
const MarkdownIt = require("markdown-it");
const path = require("path");
const fs = require("fs");

const md = new MarkdownIt();

const PDF_CONFIG = {
  fonts: {
    heading: "Helvetica-Bold",
    body: "Helvetica",
    bodyBold: "Helvetica-Bold",
    bodyItalic: "Helvetica-Oblique",
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
    pageNumber: 9,
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
    pageNumber: "#64748b",
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
    lineHeight: 1.5,
  },
  list: {
    bulletIndent: 20, // Distance from left margin to bullet
    textIndent: 35, // Distance from left margin to text (bullet + spacing)
  },
};

// Parse inline markdown with proper pattern priority
// Key fix: Bold (**) MUST come before italic (*) to avoid conflicts
function parseInlineMarkdown(text) {
  const segments = [];

  // Order matters! More specific patterns first
  const patterns = [
    { regex: /`([^`]+)`/g, type: "code" }, // Code first (most specific)
    { regex: /\*\*(.+?)\*\*/g, type: "bold" }, // Bold before italic!
    { regex: /__(.+?)__/g, type: "bold" }, // Alternative bold
    { regex: /\*(.+?)\*/g, type: "italic" }, // Italic after bold
    { regex: /_(.+?)_/g, type: "italic" }, // Alternative italic
  ];

  const matches = [];

  // Find all matches from all patterns
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

  // Sort matches by position to process them in order
  matches.sort((a, b) => a.start - b.start);

  // Remove overlapping matches (keep first match when conflicts occur)
  const filteredMatches = [];
  let lastEnd = 0;

  matches.forEach((match) => {
    if (match.start >= lastEnd) {
      filteredMatches.push(match);
      lastEnd = match.end;
    }
  });

  // Build segments with plain text and styled text
  let processedUntil = 0;

  filteredMatches.forEach((match) => {
    // Add plain text before this match
    if (match.start > processedUntil) {
      segments.push({
        text: text.substring(processedUntil, match.start),
        type: "plain",
      });
    }

    // Add styled text
    segments.push({
      text: match.text,
      type: match.type,
    });

    processedUntil = match.end;
  });

  // Add remaining plain text
  if (processedUntil < text.length) {
    segments.push({
      text: text.substring(processedUntil),
      type: "plain",
    });
  }

  return segments.length > 0 ? segments : [{ text, type: "plain" }];
}

// Render styled text segments (used for paragraphs and list items)
function renderStyledText(
  doc,
  segments,
  startX = null,
  startY = null,
  options = {}
) {
  const defaultOptions = {
    width: doc.page.width - PDF_CONFIG.margins.left - PDF_CONFIG.margins.right,
    ...options,
  };

  let firstSegment = true;

  segments.forEach((segment, index) => {
    // Set font based on segment type
    switch (segment.type) {
      case "code":
        doc
          .font(PDF_CONFIG.fonts.code)
          .fontSize(PDF_CONFIG.sizes.code)
          .fillColor(PDF_CONFIG.colors.code);
        break;
      case "bold":
        doc
          .font(PDF_CONFIG.fonts.bodyBold)
          .fontSize(PDF_CONFIG.sizes.body)
          .fillColor(PDF_CONFIG.colors.body);
        break;
      case "italic":
        doc
          .font(PDF_CONFIG.fonts.bodyItalic)
          .fontSize(PDF_CONFIG.sizes.body)
          .fillColor(PDF_CONFIG.colors.body);
        break;
      default:
        doc
          .font(PDF_CONFIG.fonts.body)
          .fontSize(PDF_CONFIG.sizes.body)
          .fillColor(PDF_CONFIG.colors.body);
    }

    // First segment can set position if startX/startY provided
    if (firstSegment && startX !== null && startY !== null) {
      doc.text(segment.text, startX, startY, {
        ...defaultOptions,
        continued: index < segments.length - 1,
      });
      firstSegment = false;
    } else if (firstSegment && startX !== null) {
      // Only X position provided (used in lists where Y is already set)
      doc.text(segment.text, startX, doc.y, {
        ...defaultOptions,
        continued: index < segments.length - 1,
      });
      firstSegment = false;
    } else {
      // Subsequent segments continue naturally
      doc.text(segment.text, {
        continued: index < segments.length - 1,
      });
    }
  });
}

// Process markdown content and render to PDF
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

          // Check if we need a new page
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

          i += 2; // Skip heading_open and inline tokens
          continue;
        }
      }

      // HANDLE CODE BLOCKS
      if (token.type === "fence" || token.type === "code_block") {
        const codeLines = token.content
          .split("\n")
          .filter((line) => line.trim());

        // Check if we need a new page
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

        // Render each line of code with background
        codeLines.forEach((line) => {
          const lineHeight = PDF_CONFIG.sizes.code + 6;

          // Draw dark background for code blocks
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
          // Check if we need a new page
          if (doc.y > doc.page.height - PDF_CONFIG.margins.bottom - 100) {
            doc.addPage();
          }

          doc.moveDown(0.5);

          // Parse and render styled text using helper function
          const segments = parseInlineMarkdown(nextToken.content);
          renderStyledText(doc, segments); // Now using the helper!

          doc.moveDown(0.5);

          i += 2; // Skip paragraph_open and inline tokens
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
                // Check if we need a new page
                if (doc.y > doc.page.height - PDF_CONFIG.margins.bottom - 50) {
                  doc.addPage();
                }

                const currentY = doc.y;
                const bulletX =
                  PDF_CONFIG.margins.left + PDF_CONFIG.list.bulletIndent;
                const textX =
                  PDF_CONFIG.margins.left + PDF_CONFIG.list.textIndent;

                // Render bullet separately at fixed position
                doc
                  .font(PDF_CONFIG.fonts.body)
                  .fontSize(PDF_CONFIG.sizes.body)
                  .fillColor(PDF_CONFIG.colors.body)
                  .text("•", bulletX, currentY, {
                    lineBreak: false,
                    width: 10,
                  });

                // Parse list item content for inline styles
                const segments = parseInlineMarkdown(tokens[i].content);

                // Render text at fixed indent using helper function
                renderStyledText(doc, segments, textX, currentY, {
                  width: doc.page.width - textX - PDF_CONFIG.margins.right,
                });

                doc.moveDown(0.4);
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
                // Check if we need a new page
                if (doc.y > doc.page.height - PDF_CONFIG.margins.bottom - 50) {
                  doc.addPage();
                }

                const currentY = doc.y;
                const numberX =
                  PDF_CONFIG.margins.left + PDF_CONFIG.list.bulletIndent;
                const textX =
                  PDF_CONFIG.margins.left + PDF_CONFIG.list.textIndent;

                // Render number separately at fixed position
                doc
                  .font(PDF_CONFIG.fonts.body)
                  .fontSize(PDF_CONFIG.sizes.body)
                  .fillColor(PDF_CONFIG.colors.body)
                  .text(`${listCounter}.`, numberX, currentY, {
                    lineBreak: false,
                    width: 15,
                  });

                // Parse list item content for inline styles
                const segments = parseInlineMarkdown(tokens[i].content);

                // Render text at fixed indent using helper function
                renderStyledText(doc, segments, textX, currentY, {
                  width: doc.page.width - textX - PDF_CONFIG.margins.right,
                });

                doc.moveDown(0.4);
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

// MAIN PDF GENERATION FUNCTION
async function generatePdf(book, res) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: PDF_CONFIG.margins,
      });

      doc.pipe(res);

      doc.on("error", (err) => {
        console.error("PDF generation error:", err);
        reject(err);
      });

      // PAGE 1: COVER PAGE
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

      // PAGE 2: TITLE PAGE
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

      // PROCESS CHAPTERS (starts on page 3+)
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
