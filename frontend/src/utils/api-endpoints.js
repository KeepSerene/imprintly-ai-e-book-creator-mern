export const API_BASE_URL = import.meta.env.PROD
  ? ""
  : import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
  },
  PROFILE: {
    GET: "/api/profile",
    EDIT: "/api/profile",
    UPLOAD_AVATAR: "/api/profile/avatar",
    DELETE_AVATAR: "/api/profile/avatar",
  },
  BOOKS: {
    GET_ALL: "/api/books",
    GET_BY_ID: "/api/books",
    CREATE: "/api/books",
    UPDATE_CONTENT: "/api/books",
    UPDATE_COVER: "/api/books",
    DELETE: "/api/books",
  },
  AI: {
    GENERATE_OUTLINE: "/api/ai/generate-book-outline",
    GENERATE_CHAPTER_CONTENT: "/api/ai/generate-chapter-content",
  },
  EXPORTS: {
    DOCX: "/api/exports",
    PDF: "/api/exports",
  },
};
