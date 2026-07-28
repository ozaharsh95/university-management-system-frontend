# 🎨 EduHub Frontend — React 19, Refine & Shadcn UI

EduHub is a premium, full-featured **University Management System** client. Built with **React 19**, **Refine**, **Tailwind CSS v4**, and **Shadcn UI**, it provides a role-based, glassmorphic administrative interface designed for modern educational environments.

> [!NOTE]
> This repository represents the client-side implementation of EduHub. It integrates with the Express, Drizzle, and Arcjet security backend to offer telemetry-driven analytics, role-based navigation guards, and cloud image uploads.

---

## 🚀 Key Portfolio Highlights

When presenting this project in your portfolio, highlight these three engineering achievements:

1. **Declarative CRUD with Refine**: Replaced hundreds of lines of boilerplate routing, pagination, state sync, and data tables with **Refine Resources**. This guarantees robust table-filtering, search telemetry, and form states.
2. **Dynamic Role-Based Access Control (RBAC)**: Implemented secure auth guards utilizing **Better-Auth** client and Refine's context. The navigation menu and dashboard components adapt in real time to the user's role: `admin`, `teacher`, or `student`.
3. **Immersive Glassmorphic Design System**: Engineered using **Tailwind CSS v4** and **Shadcn UI**. Utilizes high-performance responsive graphs via **Recharts**, customized tooltips, animated greetings, and smooth CSS transitions.

---

## 🛠️ Technology Stack

| Layer | Technology | Key Purpose |
| :--- | :--- | :--- |
| **Core Framework** | React 19 & Vite 6 | High performance rendering, ESM compilation, and rapid hot module replacement. |
| **State & CRUD Engine** | Refine Core (`@refinedev/core`) | Enterprise-level data hooks, caching, resource synchronization, and data providers. |
| **Routing Guard** | React Router v7 & Refine Router | Strict guard routes, unsaved changes warn notifier, and dynamic role-based URL routing. |
| **Security & Session** | Better-Auth Client SDK | Client-side session tracking, secure OAuth/email login, and cookie auth synchronization. |
| **Visual Framework** | Tailwind CSS v4 & Shadcn UI | Utility-first styling with modern nesting, Radix UI primitives, dark mode, and custom transitions. |
| **Analytics Engine** | Recharts | Canvas-based dynamic visualization of user statistics, subject distribution, and telemetry. |
| **Form Integrity** | React Hook Form & Zod | Strong schema validations on forms (join class, registration, class creation). |
| **Media Pipeline** | Cloudinary React SDK | Direct cloud uploads for user avatar profiles and subject thumbnail images. |

---

## 🧭 System Architecture & Workflows

### 1. Unified Resource Control (`src/App.tsx`)
Rather than maintaining extensive route configs, resources are declared central to the Refine orchestrator. This maps routes automatically to lists, creates, shows, and edits:
```tsx
<Refine
  dataProvider={dataProvider}
  authProvider={authProvider}
  resources={[
    { name: "dashboard", list: "/" },
    { name: "subjects", list: "/subjects", create: "/subjects/create" },
    { name: "classes", list: "/classes", create: "/classes/create", show: "/classes/show/:id" },
    { name: "users", list: "/users" },
    { name: "announcements", list: "/announcements" },
    { name: "departments", list: "/departments" },
    { name: "enrollments", list: "/enrollments" },
    { name: "join-class", list: "/join-class" },
    { name: "schedule", list: "/schedule" },
    { name: "profile", list: "/profile" },
    { name: "reports", list: "/reports" }
  ]}
>
```

### 2. Multi-Role Dashboard Grid (`src/pages/dashboard.tsx`)
A unified portal that decodes user roles through `useGetIdentity` and renders role-specific dashboards:
* **Admin Dashboard (`admin-dashboard.tsx`)**: Displays KPI counters (active students, class load percentages), live system activity logs, and Recharts reports comparing student enrollment across departments.
* **Teacher Dashboard (`teacher-dashboard.tsx`)**: Shows active classes taught, enrolled student counts, calendar schedule blocks, and quick links to manage subjects.
* **Student Dashboard (`student-dashboard.tsx`)**: Showcases current enrollments, class progress cards, course schedules, and announcements.

### 3. Quick Global Command Center (`RefineKbar`)
Integrated with `@refinedev/kbar` (Cmd+K / Ctrl+K), allowing developers and users to trigger fast navigation actions, query commands, or switch layouts on the fly.

---

## 📂 Project Organization

```
├── public/                 # Static assets & public images
└── src/
    ├── components/
    │   ├── dashboards/     # Role-specific dashboard parts (Admin/Teacher/Student)
    │   ├── refine-ui/      # Customizable layout components, sidebars, buttons, & themes
    │   ├── ui/             # Reusable Shadcn UI base items (dialog, popover, inputs)
    │   └── upload-widget   # Cloudinary React SDK upload widget helper
    ├── constants/          # Environment endpoints & API constants
    ├── hooks/              # Custom React utilities
    ├── lib/                # Better-Auth client configuration & utility helpers
    ├── pages/              # Module directories (classes, profile, reports, schedules, etc.)
    ├── providers/          # Refine authProvider and custom dataProvider logic
    ├── types/              # TypeScript schema and payload declarations
    ├── App.tsx             # Application router tree & Resource mapping
    └── index.tsx           # Dom initialization root
```

---

## ⚡ Getting Started

### 1. Prerequisites
Ensure you have **Node.js v20+** and **npm** installed.

### 2. Environment Configuration
Create a `.env` file in the root folder and configure:
```env
VITE_API_URL=http://localhost:5000/
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 3. Installation
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Runs the application on `http://localhost:5173` with Refine Devtools enabled.

### 5. Build for Production
```bash
npm run build
```
Creates a optimized static distribution bundle in the `/dist` directory.
