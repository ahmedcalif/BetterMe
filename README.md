# 🌿 BetterMe

**A calm, nature-inspired goals app that helps you track progress without feeling overwhelmed.**

---

## ✨ Philosophy

BetterMe takes a different approach to goal tracking. Instead of aggressive metrics, streaks, and overwhelming dashboards, we embrace a gentler philosophy:

> _"Grow at your own pace"_

Goals are organized by **seasons** — natural 3-month cycles that give you breathing room. No guilt, no pressure, just steady progress like a seed growing into a tree.

---

## 🎯 Features

### 🌱 Goals with Steps

Break down your goals into manageable steps. Watch your progress grow organically.

```
Goal: "Get healthier"
  ├── ✓ Walk 3x per week
  ├── ○ Drink more water
  └── ○ Sleep by 11pm

  Progress: ████░░░░░░ 33%
```

### 🍂 Seasonal Organization

- **Winter** (Jan-Mar) · **Spring** (Apr-Jun) · **Summer** (Jul-Sep) · **Fall** (Oct-Dec)
- Focus only on the current season's goals
- Past seasons are archived — viewable, but not in your face

### 🌿 Gentle Progress

- Soft, earthy progress bars
- No aggressive metrics or streaks
- Celebrate completion quietly

---

## 🎨 Design

A forest-inspired color palette that feels calm and natural:

| Element    | Color        | Hex       |
| ---------- | ------------ | --------- |
| Background | Soft Cream   | `#FAF9F6` |
| Primary    | Forest Green | `#4A7C59` |
| Secondary  | Sage         | `#87A878` |
| Text       | Deep Brown   | `#3D3229` |
| Accent     | Terracotta   | `#C67D5E` |

---

## 🛠 Tech Stack

| Layer         | Technology              |
| ------------- | ----------------------- |
| **Framework** | Next.js 15 (App Router) |
| **Language**  | TypeScript              |
| **Styling**   | Tailwind CSS 4          |
| **Database**  | Turso (SQLite)          |
| **ORM**       | Drizzle                 |
| **Auth**      | Kinde                   |
| **Runtime**   | Bun                     |

---

## 📁 Project Structure

```
src/
├── app/                         # Next.js App Router
│   ├── page.tsx                # Landing/Welcome page
│   ├── layout.tsx              # Root layout
│   ├── error.tsx               # Error boundary
│   ├── not-found.tsx           # 404 page
│   ├── api/
│   │   └── auth/[...kindeAuth]/ # Kinde auth endpoints
│   ├── dashboard/
│   │   ├── page.tsx            # Main goals dashboard
│   │   └── actions.ts          # Dashboard server actions
│   ├── goals/
│   │   ├── page.tsx            # Goals overview
│   │   ├── actions.ts          # Goal CRUD operations
│   │   └── [id]/
│   │       └── page.tsx        # Goal detail page
│   ├── archive/
│   │   ├── page.tsx            # Archived goals
│   │   └── actions.ts          # Archive operations
│   ├── seasons/
│   │   ├── page.tsx            # Seasons overview
│   │   ├── actions.ts          # Season operations
│   │   └── [seasonKey]/
│   │       └── page.tsx        # Season detail page
│   ├── settings/
│   │   ├── page.tsx            # Settings page
│   │   └── actions.ts          # Settings operations
│   ├── steps/
│   │   ├── page.tsx            # Steps overview
│   │   └── actions.ts          # Step CRUD operations
│   └── middleware/
│       └── middleware.ts       # Auth middleware
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── Goals/                  # Goal-specific components
│   ├── Layout/                 # Header, Footer, Navigation
│   ├── Dashboard/              # Dashboard components
│   ├── Archive/                # Archive components
│   ├── Settings/               # Settings components
│   ├── Steps/                  # Step components
│   └── WelcomeScreen.tsx       # Landing page component
├── lib/
│   ├── auth.ts                 # Authentication helpers
│   ├── utils.ts                # Season helpers, formatters
│   ├── cn.ts                   # Class name utility
│   └── insertUserInDatabase.ts # User creation helper
├── db/
│   ├── client.ts               # Database connection
│   └── schema/                 # Drizzle schema
├── types/                      # TypeScript types
```

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- [Turso](https://turso.tech/) account for database
- [Kinde](https://kinde.com/) account for authentication

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/betterme.git
   cd betterme
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in your credentials:

   ```env
   # Database (Turso)
   TURSO_DB_URL=libsql://your-database.turso.io
   TURSO_AUTH_TOKEN=your-auth-token

   # Auth (Kinde)
   KINDE_CLIENT_ID=your-client-id
   KINDE_CLIENT_SECRET=your-client-secret
   KINDE_ISSUER_URL=https://your-app.kinde.com
   KINDE_SITE_URL=http://localhost:3000
   KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
   KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard
   ```

4. **Push database schema**

   ```bash
   bun run push
   ```

5. **Start development server**

   ```bash
   bun dev
   ```

   Open [http://localhost:3000](http://localhost:3000) 🌿

---

## 📜 Scripts

| Command      | Description                     |
| ------------ | ------------------------------- |
| `bun dev`    | Start development server        |
| `bun build`  | Build for production            |
| `bun start`  | Start production server         |
| `bun push`   | Push schema changes to database |
| `bun studio` | Open Drizzle Studio             |

---

## 🗄 Database Schema

```sql
users
  ├── id (UUID)
  ├── kindeId (unique)
  ├── email (unique)
  ├── first_name
  ├── last_name
  ├── picture
  └── timestamps

goals
  ├── id (UUID)
  ├── userId (FK → users)
  ├── title
  ├── description
  ├── season (e.g., "winter_2025")
  ├── status (active | completed | archived)
  └── timestamps

steps
  ├── id (UUID)
  ├── goalId (FK → goals)
  ├── title
  ├── isCompleted
  ├── order
  └── timestamps
```

---

## 🌳 Roadmap

- [x] Core goal tracking
- [x] Seasonal organization
- [x] Step management
- [x] Progress visualization
- [ ] Notifications & reminders
- [ ] Goal templates
- [ ] Insights & reflections
- [ ] Data export

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

🌱 **Grow at your own pace** 🌱

Made with 💚 by [Ahmed Calif](https://github.com/ahmedcalif)

</div>
