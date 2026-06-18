# Multi-Tenant SaaS Project Workspace

A premium, production-ready Multi-Tenant Project Management SaaS application built using **React**, **Vite**, **TypeScript**, **Express**, and **PostgreSQL**. The platform features complete user authentication, workspace/tenant segregation, collapsible responsive sidebars, custom `framer-motion` page transition animations, and a project assignment manager.

---

## 🚀 Key Features

### 🏢 Multi-Tenant Workspace Architecture
- **Create Organization**: Spin up a brand new organization workspace as an administrator.
- **Join Organization**: Join existing team workspaces instantly using unique workspace invite codes.
- **Role-Based Access Control (RBAC)**: Supports roles (e.g. `admin`, `member`) controlling write privileges (e.g. creating/editing projects, assigning members).
- **Workspace Separation**: Complete logical separation of data at database query boundaries.

### 🎨 Premium UI & Interactive Components
- **Collapsible Sidebar**: Fully responsive navigation menu. Smoothly collapses into a minimal icon-only view with tooltips, expanding on click, with full responsiveness.
- **Framer Motion Route Transitions**: Zero-lag, premium, custom-bezier page transitions (`easeOutExpo`) wrapping all page switches and routing boundaries.
- **Animated Theme**: Deep slate glassmorphic colors, neon border highlights, and continuous shimmer text animations.

### 📂 Project & Member Directories
- **Project CRUD**: Create, edit, and delete projects (admin only).
- **Team Assignments**: Assign organization users to specific projects, and track active member counts.
- **Directory Search**: Complete directory of workspace members, showing contact details and role permissions.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 (TypeScript) + Vite
- **Styling**: Tailwind CSS 4.0
- **Routing**: React Router DOM v7 (with `AnimatePresence` page caching)
- **State Management**: TanStack Query (React Query)
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Framework**: Node.js + Express (TypeScript)
- **Database**: PostgreSQL (pg client)
- **Authentication**: JWT (JSON Web Tokens) & bcrypt hashing
- **Development**: nodemon, tsx

---

## 🗄 Database Models & Schema

The PostgreSQL schema consists of five main tables:

```mermaid
erDiagram
    USERS ||--o{ ORGANIZATION_MEMBERS : belongs_to
    ORGANIZATIONS ||--o{ ORGANIZATION_MEMBERS : has
    ORGANIZATIONS ||--o{ PROJECTS : owns
    PROJECTS ||--o{ PROJECT_MEMBERS : includes
    USERS ||--o{ PROJECT_MEMBERS : assigned_to

    USERS {
        serial id PK
        varchar name
        varchar email UNIQUE
        varchar password_hash
        varchar refreshed_token
        timestamp created_at
    }

    ORGANIZATIONS {
        serial id PK
        varchar name
        varchar invite_code UNIQUE
        timestamp created_at
    }

    ORGANIZATION_MEMBERS {
        serial id PK
        integer user_id FK
        integer organization_id FK
        varchar role "admin | member"
        timestamp created_at
    }

    PROJECTS {
        serial id PK
        integer organization_id FK
        varchar name
        text description
        timestamp created_at
    }

    PROJECT_MEMBERS {
        serial id PK
        integer project_id FK
        integer user_id FK
        timestamp created_at
    }
```

---

## 🔌 API Routes Reference

All API endpoints are prefixed with `/api`.

### 🔑 Authentication
| Method | Route | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/signup` | Register a new user account | No |
| `POST` | `/api/login` | Sign in to an account | No |
| `POST` | `/api/logout` | Terminate session & clear tokens | Yes |
| `GET` | `/api/me` | Retrieve currently authenticated user context | Yes |

### 🏢 Organizations & Workspaces
| Method | Route | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/orgs` | Create a new organization workspace | Yes |
| `POST` | `/api/orgs/join` | Join a workspace using an invite code | Yes |
| `POST` | `/api/orgs/leave` | Leave current organization workspace | Yes |
| `GET` | `/api/orgs/members` | List all members inside the current workspace | Yes |

### 📂 Project Management
| Method | Route | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/projects` | List all projects in the workspace | Yes |
| `POST` | `/api/projects` | Create a new project (Admin only) | Yes (Admin) |
| `PUT` | `/api/projects/:id` | Update project name or description | Yes (Admin) |
| `DELETE` | `/api/projects/:id` | Permanently delete a project | Yes (Admin) |

### 👥 Project Assignments
| Method | Route | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/projects/:id/members` | Get details and assigned members of a project | Yes |
| `POST` | `/api/projects/:projectId/assign` | Assign a member to a project | Yes (Admin) |
| `DELETE` | `/api/projects/:projectId/members/:userId` | Remove a member from a project | Yes (Admin) |

### 📊 Dashboard
| Method | Route | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | Retrieve workspace summaries and counts | Yes |

---

## ⚙️ Local Configuration & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL (running locally or in a Docker container)

### Step 1: Clone and Configure Environment Files

#### Backend Environment Settings (`backend/.env`):
```env
PORT=3000
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<dbname>
JWT_SECRET=super-secret-jwt-key
JWT_REFRESH_SECRET=super-secret-refresh-key
```

#### Frontend Environment Settings (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3000/api
```

### Step 2: Install and Run

1. **Start PostgreSQL**: Make sure PostgreSQL is running and database specified in `DATABASE_URL` exists.
2. **Launch Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. **Launch Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

---

## ☁️ Deployment Guide

### 1. Backend Deployment on Render

#### Prerequisites
- Create a **Render** account.
- Spin up a Managed PostgreSQL database on Render (or use external PostgreSQL service like Neon).

#### Step-by-Step Build Configuration:
1. Connect your Github Repository to Render.
2. Choose **Web Service** as the service type.
3. Configure the service settings:
   - **Name**: `multi-tenant-backend`
   - **Runtime**: `Node`
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm run prod`
4. Add the following **Environment Variables** under the Environment tab:
   - `PORT`: `3000`
   - `DATABASE_URL`: *(Your production PostgreSQL connection string)*
   - `JWT_SECRET`: *(A secure random string)*
   - `JWT_REFRESH_SECRET`: *(Another secure random string)*
5. Click **Deploy Web Service**. Render will build and expose a public URL (e.g. `https://multi-tenant-backend.onrender.com`).

---

### 2. Frontend Deployment on Vercel

#### Step-by-Step Configuration:
1. Create a **Vercel** account and connect your GitHub repository.
2. Import the repository into Vercel.
3. Configure the project parameters:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the **Environment Variables**:
   - `VITE_API_URL`: `https://multi-tenant-backend.onrender.com/api` *(Point to your deployed Render URL)*
5. Configure Client-side routing fallback:
   To prevent `404` errors when reloading React Router pages, add a `vercel.json` file to the root of the `frontend` folder:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
6. Click **Deploy**. Vercel will build and host your frontend on a free sub-domain.
