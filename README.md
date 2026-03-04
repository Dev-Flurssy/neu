# NEU Notes - AI-Powered Note Taking & Document Generation

A modern note-taking application with AI assistance and powerful document export capabilities.

## Features

- **Rich Text Editor**: Full-featured editor with formatting, tables, images, and more
- **AI Assistant**: Generate content, improve writing, and get suggestions using AI
- **Document Export**: Export notes to PDF, DOCX, and PPTX formats
- **User Authentication**: Secure authentication with email/password and Google OAuth
- **Email Verification**: Email verification system for new accounts
- **Admin Dashboard**: User management and analytics for administrators
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js
- **Editor**: TipTap (ProseMirror-based)
- **AI**: Groq API
- **Email**: Resend
- **Styling**: Tailwind CSS + Radix UI
- **Document Generation**: Puppeteer (PDF), docx (DOCX), pptxgenjs (PPTX)

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd neu
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env` file:
```env
DATABASE_URL="your-mongodb-connection-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

Create a `.env.local` file:
```env
GROQ_API_KEY="your-groq-api-key"
RESEND_API_KEY="your-resend-api-key"
EMAIL_ENABLED=false
```

4. Generate Prisma Client
```bash
npx prisma generate
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Document Export Features

### PDF Export
- Preserves formatting, images, and tables
- Automatic page breaks
- Custom styling support

### DOCX Export
- Maintains document structure
- Supports headings, lists, and formatting
- Image embedding

### PPTX Export
- Converts content into presentation slides
- Automatic slide creation based on headings
- Image and text formatting

## Project Structure

```
neu/
├── app/
│   ├── api/          # API routes
│   ├── components/   # React components
│   ├── dashboard/    # Dashboard pages
│   ├── admin/        # Admin pages
│   └── notes/        # Note pages
├── lib/              # Utility functions
├── prisma/           # Database schema
└── public/           # Static assets
```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

Required environment variables for production:
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GROQ_API_KEY`
- `RESEND_API_KEY`
- `EMAIL_ENABLED=true`

## License

MIT
