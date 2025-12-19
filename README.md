# AI URL Summarizer

AI URL Summarizer is a full-stack application that allows users to save learning resource links
and automatically generate structured notes by extracting and summarizing the content of those links using AI.

The goal is to help learners build a personal knowledge base from articles, blogs, and documentation
without manually writing notes.

---

## 🚀 Features

- Paste a learning resource URL
- Automatically fetch and extract webpage content
- Generate:
  - Title
  - Key topics discussed
  - Concise summary
- Save notes for future reference
- Prevent duplicate link entries
- Secure URL validation to avoid malicious requests

---

## 🧱 High-Level Architecture

- **Frontend**: Next.js (React 18) + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB
- **AI Layer**: Large Language Model (LLM) for summarization

The frontend and backend are fully decoupled and communicate via REST APIs.

---

---

## 🖥️ Frontend Tech Stack

- Next.js (App Router)
- React 18
- TypeScript
- Tailwind CSS 3.4.17

---

## ⚙️ Backend Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- Axios (web fetching)
- Cheerio (HTML parsing)

---
---

## 🔐 Security Considerations

- Only HTTP/HTTPS URLs allowed
- Localhost and private IPs blocked (SSRF protection)
- Environment variables used for secrets
- Strict TypeScript configuration enabled

---

## 📌 Development Philosophy

- Folder-by-folder, file-by-file implementation
- Strong separation of concerns
- Strict TypeScript safety
- Production-ready patterns (no shortcuts)

---

## 📈 Future Enhancements

- User authentication
- Background job queue for AI processing
- Support for video links (YouTube transcript summarization)
- Search and tagging of notes
- Ask questions on saved notes (RAG)

---

## 🧠 Why This Project?

This project is designed to demonstrate:
- Real-world backend architecture
- Secure web scraping practices
- Practical use of AI in production systems
- Clean system design (HLD + LLD)

---

## 📄 License

This project is for educational and learning purposes.