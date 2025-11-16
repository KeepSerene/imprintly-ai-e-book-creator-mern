const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  UnderlineType,
  ImageRun,
} = require("docx");
const PDFDocument = require("pdfkit");
const MarkdownIt = require("markdown-it");
const Book = require("../models/Book");
const path = require("path");
const fs = require("fs");

const md = new MarkdownIt();

const DOCX_CONFIG = {
  fonts: {
    heading: "Inter",
    body: "Charter",
  },
  sizes: {
    title: 32,
    subtitle: 20,
    author: 18,
    chapterTitle: 24,
    h1: 20,
    h2: 18,
    h3: 16,
    body: 12,
  },
  spacing: {
    paragraphBefore: 200,
    paragraphAfter: 200,
    chapterBefore: 400,
    chapterAfter: 300,
    headingBefore: 300,
    headingAfter: 150,
  },
};

// Define it!
function processInlineContent(content) {}

function processMdContent(mdContent) {
  const tokens = md.parse(mdContent, {});
  const paragraphs = [];
  let isList = false;
  let listType = null;
  let orderedListCounter = 1;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    try {
      if (token.type === "heading_open") {
        const level = parseInt(token.tag.slice(1), 10);
        const nextToken = tokens[i + 1];

        if (nextToken && nextToken.type === "inline") {
          let headingLevel;
          let fontSize;

          switch (level) {
            case 1: {
              headingLevel = HeadingLevel.HEADING_1;
              fontSize = DOCX_CONFIG.sizes.h1;
              break;
            }
            case 2: {
              headingLevel = HeadingLevel.HEADING_2;
              fontSize = DOCX_CONFIG.sizes.h2;
              break;
            }
            case 3: {
              headingLevel = HeadingLevel.HEADING_3;
              fontSize = DOCX_CONFIG.sizes.h3;
              break;
            }
            default: {
              headingLevel = HeadingLevel.HEADING_3;
              fontSize = DOCX_CONFIG.sizes.h3;
            }
          }

          paragraphs.push(
            new Paragraph({
              text: nextToken.content,
              heading: headingLevel,
              style: {
                font: DOCX_CONFIG.fonts.heading,
                size: fontSize * 2,
              },
              spacing: {
                before: DOCX_CONFIG.spacing.headingBefore,
                after: DOCX_CONFIG.spacing.headingAfter,
              },
            })
          );

          i += 2; // skip inline and heading_close
        } else if (token.type === "paragraph_open") {
          const nextToken = tokens[i + 1];

          if (nextToken && nextToken.type === "inline" && nextToken.content) {
            const textRuns = processInlineContent(nextToken.content); // Define this function

            if (textRuns.length > 0) {
              paragraphs.push(
                new Paragraph({
                  children: textRuns,
                  spacing: {
                    before: isList ? 100 : DOCX_CONFIG.spacing.paragraphBefore,
                    after: isList ? 100 : DOCX_CONFIG.spacing.paragraphAfter,
                    line: 360,
                  },
                  alignment: AlignmentType.JUSTIFIED,
                })
              );
            }

            i += 2;
          }
        } else if (token.type === "bullet_list_open") {
          isList = true;
          listType = "bullet";
        } else if (token.type === "bullet_list_close") {
          isList = false;
          listType = null;
          paragraphs.push(new Paragraph({ text: "", spacing: { after: 200 } }));
        } else if (token.type === "ordered_list_open") {
          isList = true;
          listType = "ordered";
          orderedListCounter = 1;
        } else if (token.type === "ordered_list_close") {
          isList = false;
          listType = null;
          orderedListCounter = 1;
          paragraphs.push(new Paragraph({ text: "", spacing: { after: 200 } }));
        } else if (token.type === "list_item_open") {
          // Keep going...
        }
      }
    } catch (error) {}
  }
}

async function exportAsDocx(req, res) {
  const book = await Book.findById(req.params.bookId);

  if (!book) {
    return res.status(404).send({ error: "No such book exists!" });
  }

  if (book.userId.toString() !== req.user.id.toString()) {
    return res.status(403).send({
      error:
        "You are not authorized to perform any operations on the requested book!",
    });
  }

  try {
    const sections = [];

    // Cover page section
    const coverPage = [];

    if (book.coverImage && !book.coverImage.includes("pravatar")) {
      const imagePath = book.coverImage.slice(1);

      try {
        if (fs.existsSync(imagePath)) {
          const imageBuffer = fs.readFileSync(imagePath);

          coverPage.push(
            new Paragraph({ text: "", spacing: { before: 1000 } })
          );

          coverPage.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: imageBuffer,
                  transformation: {
                    width: 400,
                    height: 550,
                  },
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 200, after: 400 },
            })
          );

          coverPage.push(
            new Paragraph({
              text: "",
              pageBreakBefore: true,
            })
          );
        }
      } catch (imgErr) {
        console.error(`Could not embed image: ${imagePath}`, imgErr);
      }
    }

    sections.push(...coverPage);

    // Title page section
    const titlePage = [];

    titlePage.push(
      new Paragraph({
        children: [
          new TextRun({
            text: book.title,
            color: "1a202c",
            font: DOCX_CONFIG.fonts.heading,
            size: DOCX_CONFIG.sizes.title * 2,
            bold: true,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 2000, after: 400 },
      })
    );

    if (book.subtitle && book.subtitle.trim()) {
      titlePage.push(
        new Paragraph({
          children: [
            new TextRun({
              text: book.subtitle,
              color: "4a5568",
              font: DOCX_CONFIG.fonts.heading,
              size: DOCX_CONFIG.sizes.subtitle * 2,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        })
      );
    }

    titlePage.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `by ${book.author}`,
            color: "2d3748",
            font: DOCX_CONFIG.fonts.heading,
            size: DOCX_CONFIG.sizes.author * 2,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );

    titlePage.push(
      new Paragraph({
        text: "",
        border: {
          bottom: {
            color: "4f46e5",
            space: 1,
            style: "single",
            size: 12,
          },
        },
        alignment: AlignmentType.CENTER,
        spacing: { before: 400 },
      })
    );

    sections.push(...titlePage);

    // Process chapters
    book.chapters.forEach((chapter, index) => {
      try {
        if (index > 0) {
          sections.push(
            new Paragraph({
              text: "",
              pageBreakBefore: true,
            })
          );
        }

        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: chapter.title,
                color: "1a202c",
                font: DOCX_CONFIG.fonts.heading,
                size: DOCX_CONFIG.sizes.chapterTitle * 2,
                bold: true,
              }),
            ],
            spacing: {
              before: DOCX_CONFIG.spacing.chapterBefore,
              after: DOCX_CONFIG.spacing.chapterAfter,
            },
          })
        );

        const contentParagraphs = processMdContent(chapter.content || "");
        sections.push(...contentParagraphs);
      } catch (chapterErr) {
        console.error(`Error processing chapter ${index + 1}:`, chapterErr);
      }
    });

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: sections,
        },
      ],
    });

    const docBuffer = await Packer.toBuffer(doc);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${book.title.replace(/[^a-zA-Z0-9]/g, "_")}.docx"`
    );
    res.setHeader("Content-Length", docBuffer.length);

    res.send(docBuffer);
  } catch (error) {
    console.error("Error exporting as docx:", error);

    if (!res.headersSent) {
      res.status(500).send({ error: error.message });
    }
  }
}
