const { GoogleGenAI } = require("@google/genai");
const ENV = require("../configs/env");

const ai = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });

async function generateBookOutline(req, res) {
  try {
    const { topic, style, chapterCount, description } = req.body;

    if (!topic) {
      return res.status(400).send({ error: "Topic is missing!" });
    }

    const prompt = `You are an expert book outline generator. Create a comprehensive book outline based on the following requirements:
    Topic: "${topic}"
    ${description ? `Description: ${description}` : ""}
    Writing Style: ${style}
    Number of Chapters: ${chapterCount || 5}

    Additional Requirements:
    1. Generate exactly ${chapterCount || 5} chapters
    2. Each chapter title should be clear, engaging, and follow a logical progression
    3. Each chapter description should be 2-3 sentences explaining what the chapter covers
    4. Ensure chapters build upon each other coherently
    5. Match the "${style}" writing style in your titles and description

    Output Format:
    Return ONLY a valid JSON array with no additional text, markdown, or formatting. Each object must have exactly two keys: "title" and "description".

    Example Structure:
    [
      {
        "title": "Chapter 1: Introduction to the Topic",
        "description": "A comprehensive overview introducing the main concepts. Sets the foundation for understanding the subject matter."
      },
      {
        "title": "Chapter 2: Core Principles",
        "description": "Explore the fundamental principles and theories. Provides detailed examples and real-world applications."
      }
    ]

    Generate the book outline now!`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const text = response.text;
    const startIndex = text.indexOf("[");
    const endIndex = text.indexOf("]");

    if (startIndex === -1 || endIndex === -1) {
      console.error("Could not find JSON array in the AI response", text);
      return res.status(500).send({
        error: "Could not parse the AI response - no JSON array found!",
      });
    }

    const jsonString = text.slice(startIndex, endIndex + 1);

    try {
      const bookOutline = JSON.parse(jsonString);

      return res.status(200).json({
        message: "Book outline generated successfully!",
        outline: bookOutline,
      });
    } catch (err) {
      console.error("Failed to parse the book outline:", err);

      return res.status(500).send({
        error:
          "Failed to generate a valid book outline - the AI response is not valid JSON!",
      });
    }
  } catch (error) {
    console.error("Error generating book outline:", error);

    return res.status(500).send({ error: "Internal Server Error!" });
  }
}

async function generateChapterContent(req, res) {
  try {
    const { chapterTitle, chapterDescription, style } = req.body;

    if (!chapterTitle) {
      return res.status(400).send({ error: "Chapter title is missing!" });
    }

    const prompt = `You are an expert writer specializing in ${style} content. Write a complete chapter for a book with the following specifications:
    Chapter Title: "${chapterTitle}"
    ${chapterDescription ? `Chapter Description: ${chapterDescription}` : ""}
    Writing Style: ${style}
    Target Length: Comprehensive and detailed (aim for 1500-2500 words)

    Requirements:
    1. Write in a ${style.toLowerCase()} tone throughout chapter
    2. Structure the content with clear sections and smooth transitions
    3. Ensure the content flows logically from introduction to conclusion
    4. Make the content engaging and valuable to readers
    ${
      chapterDescription
        ? "6. Cover all points mentioned in the chapter description"
        : ""
    }

    Format Guidelines:
    - Start with a compelling opening paragraph
    - Use clear paragraph breaks for readability
    - Include subheadings if appropriate for the content length
    - End with a strong conclusion or transition to the next chapter
    - Write in plain text without markdown formatting

    Begin writing the chapter content now!`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return res.status(200).json({
      message: "Chapter content generated successfully!",
      content: response.text,
    });
  } catch (error) {
    console.error("Error generating chapter content:", error);

    return res.status(500).send({ error: "Internal Server Error!" });
  }
}

module.exports = { generateBookOutline, generateChapterContent };
