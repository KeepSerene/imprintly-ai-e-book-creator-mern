# Imprintly

## Backend Uploads Directory

This directory stores user-uploaded files during development.

## Structure

```
uploads/
├── avatars/       # User profile pictures
├── covers/        # Book cover images
└── books/         # Exported ebook files
```

## Important Notes

⚠️ **This folder is gitignored** - files here are NOT committed to version control.

⚠️ **Production Setup** - In production, files should be stored in cloud storage (AWS S3, Cloudinary, etc.), not on the local filesystem.

## Setup for New Developers

When cloning this repo, the `uploads/` folder will be empty except for `.gitkeep` files. This is intentional.

## File Types

- **Avatars**: `.jpg`, `.png`, `.webp` (max 5MB)
- **Covers**: `.jpg`, `.png` (max 10MB)
- **Books**: `.pdf`, `.epub` (max 50MB)

## Access URLs

Files are served via Express static middleware:

- Dev: `http://localhost:3000/backend/uploads/avatars/avatar-123.jpg`
- Prod: `https://api.imprintly.com/backend/uploads/avatars/avatar-123.jpg`

## Security

- File upload validation is handled by Multer middleware
- Only authenticated users can upload files
- File size limits are enforced
- Malicious file types are rejected
