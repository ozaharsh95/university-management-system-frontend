# 🎨 EduHub Frontend — React 19, Refine & Shadcn UI

EduHub is a premium, full-featured **University Management System** client application. Built with **React 19**, **Refine Framework**, **Tailwind CSS v4**, and **Shadcn UI**, it offers a state-of-the-art, role-based, glassmorphic dashboard interface for administrative staff, teachers, and students.

> [!NOTE]
> This repository contains the client-side (frontend) implementation of EduHub. It is built to seamlessly interface with the EduHub Backend API to handle role-based navigation, live telemetry dashboards, course enrollments, class management, and Cloudinary image uploads.

---

## 🚀 Key Highlights

*   **Declarative CRUD & Resource Routing**: Leverages the power of **Refine Core** to abstract away routing, data pagination, filtering, sorting, and state management, providing a unified developer interface.
*   **Dynamic Role-Based Access Control (RBAC)**: Secure authentication and session validation using the **Better-Auth** client library. Navigation layouts, action components, and dashboard portals automatically adapt to user roles (`admin`, `teacher`, or `student`).
*   **Aesthetic & Modern UI System**: A responsive dashboard engineered with **Tailwind CSS v4** and customized **Shadcn UI** primitives (via Radix). Features interactive charting with **Recharts**, seamless light/dark mode transitions, and subtle hover animations.
*   **Interactive Command Palette (Kbar)**: Integrates `@refinedev/kbar` (accessible via `Cmd+K` or `Ctrl+K`) for rapid navigation and action execution across different resources.

---

## 🛠️ Tech Stack & Architecture

### Frontend Core
*   **React 19 & Vite 6**: High-performance UI rendering and next-generation ES module building.
*   **Refine Framework (`@refinedev/core`)**: Enterprise-ready CRUD hooks, automated routing synchronization, and custom data providers.
*   **React Router v7 & Refine Router**: Route guards, unsaved changes notifications, and dynamic URL layout structures.

### Authentication & API Security
*   **Better-Auth Client SDK**: Safe session check, cookie synchronization with backend, and customizable registration with custom role attributes.
*   **Refine REST Provider (`@refinedev/rest`)**: Data provider customized to connect with the Express backend REST API.

### Design & Visuals
*   **Tailwind CSS v4**: Advanced CSS capabilities, utility-first layouts, and modern nested stylesheet directives.
*   **Shadcn UI & Radix UI**: Accessible, premium component primitives (Dialogs, Select fields, Sidebar layouts, Sheet popups, Toasts).
*   **Recharts**: Modern responsive charts tailored for student/teacher analytics dashboard screens.
*   **Sonner**: Smooth, customized feedback notifications.

### Media & Form Integrity
*   **Cloudinary React SDK**: Upload profile avatars and course banners directly to Cloudinary cloud services.
*   **React Hook Form & Zod Schema**: Client-side form state management and strict schema validations.

---

## 📂 Codebase Structure

Below is an overview of the frontend codebase layout:

```text
├── public/                 # Static assets, logos, and public images
└── src/
    ├── components/
    │   ├── dashboards/     # Role-specific dashboard views (Admin, Teacher, Student)
    │   ├── refine-ui/      # Refine UI layout blocks, sidebar, buttons, themes, and notification providers
    │   ├── ui/             # Core UI components generated via Shadcn UI CLI (Buttons, Dialogs, Inputs, etc.)
    │   └── upload-widget.tsx # Cloudinary upload helper component
    ├── constants/          # Application-wide constants, enums (e.g., USER_ROLES), and environment selectors
    ├── hooks/              # Custom helper React hooks
    ├── lib/                # Library client configurations (Better-Auth client, Cloudinary helper, and utilities)
    ├── pages/              # Specific resource page folders (classes, profile, reports, announcements, etc.)
    ├── providers/          # Refine Custom Data Provider and Auth Provider integrations
    ├── types/              # TypeScript types and DTO definitions
    ├── App.css             # Main styling rules and Tailwind custom directives
    ├── App.tsx             # Root Refine configuration, Route mappings, and navigation tree
    └── index.tsx           # React DOM bootstrapping file
```

---

## 🧭 Application Modules & Pages

The application is structured into the following pages and modules inside `src/pages/`:

*   **🔑 Auth Portal (`/login` & `/register`)**: Custom credential forms supporting role selection (`student` / `teacher`) during registration.
*   **📊 Dashboard (`/`)**: Customized, role-dependent landing page:
    *   **Admin Dashboard**: High-level telemetry cards (Active Users, Department lists), recent platform activity feed, and Recharts statistics.
    *   **Teacher Dashboard**: Classes list under management, current enrollments counts, and schedule slots.
    *   **Student Dashboard**: Enrolled classes cards, course progression, schedule calendar, and announcement banners.
*   **🏢 Departments (`/departments`)**: List view of academic departments (e.g., Computer Science, Engineering, Law, etc.).
*   **📖 Subjects (`/subjects`)**: Manage subjects (creation form and catalog listing) assigned to specific departments.
*   **🎓 Classes (`/classes`)**: Detailed class management module including listing, create form (capacity, schedules, status), and class details view (`show.tsx`).
*   **🔗 Enrollments & Join Class (`/enrollments` & `/join-class`)**: Interfaces for students to list their active enrollments and join new classes by entering invite codes.
*   **📅 Schedule (`/schedule`)**: Personal weekly schedule view based on class timetables.
*   **📢 Announcements (`/announcements`)**: Global university bulletin board categorized by tags (General, Academic, Urgent, Holiday).
*   **👤 Profile (`/profile`)**: Manage personal credentials and profile image upload.
*   **👥 Users (`/users`)**: Administrator panel to view, search, and manage roles for all registered accounts.

---

## ⚙️ Getting Started

### 1. Prerequisites
Ensure you have **Node.js v20+** and **npm** installed on your machine.

### 2. Environment Setup
Create a `.env` file in the root of this frontend folder and define the following keys:

```env
# Mock rest API used by Refine Devtools or backup calls
VITE_API_URL="https://api.fake-rest.refine.dev"

# Base REST URL pointing to your running EduHub Backend instance
VITE_BACKEND_BASE_URL="http://localhost:8000/api/"

# Cloudinary credentials for media upload capabilities
VITE_CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
VITE_CLOUDINARY_UPLOAD_PRESET="your_upload_preset"
VITE_CLOUDINARY_UPLOAD_URL="https://api.cloudinary.com/v1_1/your_cloudinary_cloud_name/image/upload"
```

### 3. Installation
Install the package dependencies:
```bash
npm install
```

### 4. Run Development Server
Start the development server with Refine Devtools panel support:
```bash
npm run dev
```
By default, the server will open on `http://localhost:5173`.

### 5. Build for Production
To bundle and optimize the codebase for production delivery:
```bash
npm run build
```
This generates a static distribution folder under `dist/` ready to be served by any CDN or static hosting platform (Vercel, Netlify, etc.).

