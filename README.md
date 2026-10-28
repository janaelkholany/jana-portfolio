# Jana Elkholany Portfolio

A professional personal portfolio website for **Jana Mohamed Wahba Elkholany**, a second-year Software Engineering student at Suez Canal University.

## ✨ Features

- **About Me section** — Personal introduction with name as the hero
- **Student Information** — Academic details (Name, ID, Department, Level, Course, Email)
- **Skills** — Technical skills (Excel, Word, PowerPoint, Access, Canva) and soft skills
- **Assignments Manager** — Upload, edit, download, and delete course assignments
- **Password-protected admin mode** — Only the owner can add/edit/delete assignments; visitors get read-only view with download access

## 🛠 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 + [shadcn/ui](https://ui.shadcn.com/)
- **Database:** SQLite via Prisma ORM
- **Animations:** Framer Motion
- **Icons:** Lucide React

## 🚀 Getting Started (Run Locally)

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- [Bun](https://bun.sh/) or npm/yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/jana-portfolio.git
   cd jana-portfolio
   ```

2. **Install dependencies:**
   ```bash
   bun install
   # OR
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=file:./db/custom.db
   ADMIN_PASSWORD=YourSecretPasswordHere
   ```

4. **Initialize the database:**
   ```bash
   bun run db:push
   # OR
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   bun run dev
   # OR
   npm run dev
   ```

6. **Open the site:**
   Visit [http://localhost:3000](http://localhost:3000)

## 🔐 Owner Login

- Click **"Owner login"** in the Assignments section
- Enter the password you set in `.env` as `ADMIN_PASSWORD`
- You'll get full edit access (add/edit/delete assignments)
- Visitors without the password see read-only view (browse + download)

## 📁 Project Structure

```
.
├── prisma/
│   └── schema.prisma          # Database schema (Assignment model)
├── public/                    # Static assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── assignments/   # CRUD API for assignments
│   │   │   └── auth/           # Login/logout API
│   │   ├── globals.css        # Global styles + theme
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main portfolio page
│   ├── components/
│   │   ├── portfolio/         # Assignments manager UI
│   │   ├── ui/                # shadcn/ui components
│   │   └── theme-provider.tsx
│   └── hooks/
│       ├── use-admin.ts       # Admin auth state hook
│       └── use-assignments.ts # Assignments state hook
├── .env                       # Environment variables (NOT in git)
├── .gitignore
├── next.config.ts
├── package.json
└── tsconfig.json
```

## 📝 Notes

- The database (SQLite) is local — assignments are stored in `db/custom.db` which is NOT committed to git
- File uploads (PDF, Word, PPT, Excel, images, ZIP) are stored as base64 in the database, max 10MB per file
- The admin session lasts 7 days (cookie), after which you'll need to log in again

## 👩‍💻 Author

**Jana Mohamed Wahba Elkholany**
- Software Engineering Student, Suez Canal University
- Student ID: 252001142
- Course: Web Design and Development
- Email: janaelkholany00@gmail.com
