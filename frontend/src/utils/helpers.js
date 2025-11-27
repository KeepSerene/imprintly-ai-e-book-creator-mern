function escapeHtml(text) {
  if (!text) return "";

  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function validateName(name) {
  if (!name || typeof name !== "string") {
    return "Name is required";
  }

  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return "Name must be at least 2 characters";
  }

  if (trimmed.length > 50) {
    return "Name cannot exceed 50 characters";
  }

  return ""; // valid
}

export function validateEmail(email) {
  if (!email || typeof email !== "string") {
    return "Email is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }

  return ""; // valid
}

export function validatePassword(password) {
  if (!password || typeof password !== "string") {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  const strengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!strengthRegex.test(password)) {
    return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
  }

  return ""; // valid
}

export function formatMdContent(content) {
  // 1. Escape HTML first to prevent XSS
  const safeContent = escapeHtml(content);

  return (
    safeContent
      // Code blocks (must come before inline code)
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang || "text";
        return `<pre class="bg-slate-900 text-slate-100 rounded-lg p-4 my-4 overflow-x-auto"><code class="language-${language} text-sm font-mono">${code.trim()}</code></pre>`;
      })
      // Inline code
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
      )
      // Headings
      .replace(
        /^### (.*$)/gm,
        "<h3 class='text-xl font-bold mt-6 mb-4 text-slate-900'>$1</h3>"
      )
      .replace(
        /^## (.*$)/gm,
        "<h2 class='text-2xl font-bold mt-8 mb-4 text-slate-900'>$1</h2>"
      )
      .replace(
        /^# (.*$)/gm,
        "<h1 class='text-3xl font-bold mt-8 mb-6 text-slate-900'>$1</h1>"
      )
      // Bold and italic
      .replace(
        /\*\*(.*?)\*\*/g,
        "<strong class='font-semibold text-slate-900'>$1</strong>"
      )
      .replace(/\*(.*?)\*/g, "<em class='italic text-slate-700'>$1</em>")
      // Blockquote
      .replace(
        /^> (.*$)/gm,
        "<blockquote class='text-slate-700 italic border-l-4 border-violet-500 pl-4 my-4 bg-violet-50/50 py-2 rounded-r'>$1</blockquote>"
      )
      // 2. LIST LOGIC
      // Step A: Convert lines to items with unique markers (ul-item vs ol-item)
      .replace(
        /^\- (.*$)/gm,
        "<li class='ml-6 mb-2 text-slate-700 ul-item'>$1</li>"
      )
      .replace(
        /^\d+\. (.*$)/gm,
        "<li class='ml-6 mb-2 text-slate-700 ol-item'>$1</li>"
      )
      // Step B: Wrap contiguous groups of 'ul-item' in <ul>
      .replace(
        /((?:<li [^>]*class="[^"]*ul-item"[^>]*>.*?<\/li>(?:\n|$))+)/g,
        "<ul class='list-disc my-4'>$1</ul>"
      )
      // Step C: Wrap contiguous groups of 'ol-item' in <ol>
      .replace(
        /((?:<li [^>]*class="[^"]*ol-item"[^>]*>.*?<\/li>(?:\n|$))+)/g,
        "<ol class='list-decimal my-4'>$1</ol>"
      )
      // Paragraph
      .split("\n\n")
      .map((paragraph) => {
        paragraph = paragraph.trim();
        if (!paragraph) return "";

        // If it starts with a tag (like <h1, <ul, <pre), don't wrap in <p>
        if (paragraph.startsWith("<")) return paragraph;

        return `<p class="text-slate-700 leading-relaxed mb-4">${paragraph}</p>`;
      })
      .join("")
  );
}
