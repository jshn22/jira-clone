# 🚀 TaskFlow - AI-Powered Project Management System

<div align="center">

![TaskFlow Logo](./docs/images/logo.png)

**A modern, full-stack JIRA clone with AI-powered task generation and intelligent project insights**

[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Live Demo](#) | [Documentation](#features) | [API Reference](#api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Installation Guide](#installation-guide)
- [User Guide](#user-guide)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Contributors](#contributors)

---

## 🎯 Overview

TaskFlow is a comprehensive project management solution that combines traditional Kanban board functionality with cutting-edge AI capabilities. Built with the MERN stack, it offers real-time collaboration, intelligent task generation, and insightful project analytics.

### Key Highlights

- 🤖 **AI-Powered Task Generation** using Google Gemini API
- 📊 **Real-time Analytics Dashboard** with interactive charts
- 🎨 **Drag-and-Drop Kanban Board** for intuitive task management
- 🔐 **Secure Authentication** with JWT tokens
- 📱 **Fully Responsive Design** for all devices
- ⚡ **Real-time Updates** and notifications
- 🎯 **Smart Task Prioritization** and labels

---

## ✨ Features

### Core Features

#### 1. **User Authentication & Authorization**
- Secure user registration and login
- JWT-based authentication
- Password encryption with bcrypt
- Protected routes and API endpoints

#### 2. **Project Management**
- Create and manage multiple projects
- Color-coded project organization
- Member management
- Project-specific dashboards

#### 3. **Kanban Board**
- Drag-and-drop task cards between columns
- Three status columns: To Do, In Progress, Done
- Real-time task updates
- Visual task prioritization (Low, Medium, High)
- Label categorization (Bug, Feature, Enhancement, etc.)

#### 4. **AI-Powered Features**
- **Smart Task Generation**: AI suggests relevant tasks based on project description
- **Task Breakdown**: Automatically split complex tasks into subtasks
- **Sprint Planning**: AI-generated sprint recommendations
- **Project Insights**: Intelligent analytics and recommendations

#### 5. **Task Management**
- Create, edit, and delete tasks
- Assign tasks to team members
- Set due dates and priorities
- Add multiple labels
- Detailed task descriptions
- Task status tracking

#### 6. **Analytics Dashboard**
- Real-time project statistics
- Task completion rates
- Priority distribution
- Overdue task tracking
- Interactive pie charts
- Team member overview

---

## 🏗️ System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Login/     │  │   Dashboard  │  │    Kanban    │      │
│  │   Signup     │  │   Analytics  │  │    Board     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │  React Router  │                        │
│                    └───────┬────────┘                        │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │  Axios Client  │                        │
│                    └───────┬────────┘                        │
└────────────────────────────┼─────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   REST API      │
                    │   (Port 5000)   │
                    └────────┬────────┘
┌────────────────────────────┼─────────────────────────────────┐
│                       SERVER LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Auth      │  │   Projects   │  │    Tasks     │      │
│  │  Controller  │  │  Controller  │  │  Controller  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│  ┌──────▼──────────────────▼──────────────────▼───────┐    │
│  │              Middleware Layer                       │    │
│  │  • Authentication  • Validation  • Rate Limiting    │    │
│  └──────────────────────────────────────────────────────┘    │
│                            │                                 │
│  ┌─────────────────────────▼──────────────────────────┐    │
│  │              MongoDB (Mongoose)                     │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │    │
│  │  │   User   │  │  Project │  │   Task   │         │    │
│  │  │  Model   │  │   Model  │  │  Model   │         │    │
│  │  └──────────┘  └──────────┘  └──────────┘         │    │
│  └──────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  External APIs  │
                    │  (Google Gemini)│
                    └─────────────────┘
```

### Component Hierarchy

```
src/
├── components/
│   ├── Kanban/
│   │   ├── TaskCard.jsx          → Individual task card
│   │   ├── TaskColumn.jsx        → Draggable column container
│   │   └── TaskDetailModal.jsx   → Task editing modal
│   └── AI/
│       └── TaskGeneratorModal.jsx → AI task generation UI
├── pages/
│   ├── Login.jsx                 → Authentication
│   ├── Signup.jsx                → User registration
│   ├── Dashboard.jsx             → Analytics overview
│   └── KanbanBoard.jsx           → Main board view
├── context/
│   ├── AuthContext.jsx           → Global auth state
│   ├── ProjectContext.jsx        → Project management
│   └── TaskContext.jsx           → Task operations
└── services/
    ├── authService.jsx           → Auth API calls
    ├── projectService.jsx        → Project API calls
    ├── taskService.jsx           → Task API calls
    └── aiService.jsx             → AI integration
```

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI Framework | 18.2.0 |
| Vite | Build Tool | 4.5.0 |
| TailwindCSS | Styling | 3.3.0 |
| React Router | Navigation | 6.20.0 |
| React Beautiful DnD | Drag & Drop | 13.1.1 |
| Chart.js | Data Visualization | 4.4.0 |
| Axios | HTTP Client | 1.6.0 |
| React Icons | Icon Library | 4.12.0 |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | Runtime Environment | 18.x |
| Express.js | Web Framework | 4.18.0 |
| MongoDB | Database | 6.0+ |
| Mongoose | ODM | 8.0.0 |
| JWT | Authentication | 9.0.0 |
| Bcrypt | Password Hashing | 5.1.0 |
| Google Gemini API | AI Integration | Latest |

### DevOps & Tools
- **Version Control**: Git & GitHub
- **API Testing**: Postman
- **Package Manager**: npm
- **Environment**: dotenv

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

```bash
# Check Node.js version (requires 18.x or higher)
node --version

# Check npm version
npm --version

# Check MongoDB installation
mongod --version
```

Required software:
- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)
- **Google Gemini API Key** - [Get Key](https://makersuite.google.com/app/apikey)

---

## 📥 Installation Guide

### Step 1: Clone the Repository

```bash
# Clone the project
git clone https://github.com/yourusername/taskflow-jira-clone.git

# Navigate to project directory
cd taskflow-jira-clone
```

### Step 2: Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
touch .env
```

**Configure `.env` file:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/taskflow

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Start MongoDB:**

```bash
# Windows
mongod

# macOS/Linux
sudo mongod --config /usr/local/etc/mongod.conf
```

**Start the server:**

```bash
npm run dev
```

Expected output:
```
🚀 Server running on port 5000
✅ MongoDB Connected: localhost
```

### Step 3: Frontend Setup

```bash
# Open new terminal, navigate to client directory
cd ../client

# Install dependencies
npm install

# Create .env file
touch .env
```

**Configure `.env` file:**

```env
VITE_API_URL=http://localhost:5000/api
```

**Start the frontend:**

```bash
npm run dev
```

Expected output:
```
  VITE v4.5.0  ready in 523 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📖 User Guide

### 1. Getting Started

#### Registration
1. Click **"Sign up for free"** on the login page
2. Fill in your details:
   - Full Name
   - Email Address
   - Password (minimum 6 characters)
3. Accept Terms of Service
4. Click **"Create Account"**

#### Login
1. Enter your registered email
2. Enter your password
3. Click **"Sign In"**

### 2. Dashboard Overview

The dashboard provides a comprehensive view of your projects and tasks:

**Key Metrics:**
- 📊 Total Tasks
- ✅ Completed Tasks
- ⏳ In Progress Tasks
- 🚨 Overdue Tasks
- 📁 Total Projects
- 👥 Team Members

**Features:**
- Task distribution pie chart
- Project progress tracking
- Quick access to all projects
- Completion rate visualization

### 3. Creating Projects

**Steps:**
1. Click **"+ New Project"** button
2. Enter project details:
   - Project Name (required)
   - Description (optional)
   - Select Project Color
3. Click **"Create Project"**

### 4. Managing Tasks

#### Creating Tasks

**Method 1: From Kanban Board**
1. Click **"+"** button on any column
2. Fill task details:
   - Title (required)
   - Description
   - Priority (Low/Medium/High)
   - Labels (Bug, Feature, Enhancement, etc.)
   - Due Date
   - Assignee
3. Click **"Create Card"**

**Method 2: AI-Powered Generation**
1. Click **"AI Assistant"** button
2. Enter project description
3. Select number of tasks to generate
4. Review AI-generated tasks
5. Click **"Create Tasks"**

#### Editing Tasks

1. Click on any task card
2. Click **"Edit Card"** button
3. Modify task details
4. Click **"Save Changes"**

#### Moving Tasks

**Drag and Drop:**
- Simply drag a task card from one column to another
- Release to update task status

### 5. AI Features

#### Smart Task Generation
- Provides context-aware task suggestions
- Automatically assigns priorities
- Suggests appropriate labels
- Estimates task complexity

#### Usage Tips:
- Provide detailed project descriptions for better results
- Review AI suggestions before creating
- Customize generated tasks as needed

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f5a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response:** Same as register

---

### Project Endpoints

#### Create Project
```http
POST /projects
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Website Redesign",
  "description": "Complete UI/UX overhaul"
}
```

**Response:**
```json
{
  "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
  "name": "Website Redesign",
  "description": "Complete UI/UX overhaul",
  "owner": "64f5a1b2c3d4e5f6a7b8c9d0",
  "members": ["64f5a1b2c3d4e5f6a7b8c9d0"],
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

#### Get All Projects
```http
GET /projects
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
    "name": "Website Redesign",
    "description": "Complete UI/UX overhaul",
    "owner": { "name": "John Doe", "email": "john@example.com" },
    "members": [{ "name": "John Doe", "email": "john@example.com" }],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### Get Project by ID
```http
GET /projects/:id
Authorization: Bearer {token}
```

#### Delete Project
```http
DELETE /projects/:id
Authorization: Bearer {token}
```

---

### Task Endpoints

#### Create Task
```http
POST /tasks
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "projectId": "64f5a1b2c3d4e5f6a7b8c9d0",
  "title": "Design homepage mockup",
  "description": "Create high-fidelity mockups",
  "priority": "high",
  "dueDate": "2024-02-01",
  "labels": ["Design", "Feature"]
}
```

**Response:**
```json
{
  "_id": "64f5a1b2c3d4e5f6a7b8c9d1",
  "projectId": "64f5a1b2c3d4e5f6a7b8c9d0",
  "title": "Design homepage mockup",
  "description": "Create high-fidelity mockups",
  "status": "todo",
  "priority": "high",
  "dueDate": "2024-02-01T00:00:00.000Z",
  "labels": ["Design", "Feature"],
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

#### Get Tasks by Project
```http
GET /tasks/project/:projectId
Authorization: Bearer {token}
```

#### Update Task Status
```http
PUT /tasks/:id/status
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "inprogress"
}
```

#### Update Task
```http
PUT /tasks/:id
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "medium",
  "labels": ["Bug", "Enhancement"]
}
```

#### Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer {token}
```

---

### AI Endpoints

#### Generate Tasks
```http
POST /ai/generate-tasks
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "projectName": "E-commerce Platform",
  "description": "Build a full-featured online store",
  "count": 5
}
```

**Response:**
```json
[
  {
    "title": "Setup project structure",
    "description": "Initialize the basic project structure",
    "priority": "high",
    "labels": ["Feature"]
  },
  {
    "title": "Design database schema",
    "description": "Create MongoDB schema design",
    "priority": "medium",
    "labels": ["Design", "Documentation"]
  }
]
```

---

### Error Responses

All endpoints may return the following error responses:

**400 Bad Request**
```json
{
  "message": "Validation error message"
}
```

**401 Unauthorized**
```json
{
  "message": "Not authorized, no token"
}
```

**404 Not Found**
```json
{
  "message": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "message": "Server error message"
}
```

---

## 🚢 Deployment

### Production Build

#### Frontend Deployment (Vercel/Netlify)

```bash
# Build the frontend
cd client
npm run build

# The build folder is ready to deploy
```

**Environment Variables for Production:**
```env
VITE_API_URL=https://your-backend-api.com/api
```

#### Backend Deployment (Heroku/Railway)

```bash
# Ensure all dependencies are in package.json
npm install

# Set environment variables on your hosting platform
```

**Production Environment Variables:**
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskflow
JWT_SECRET=your_production_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=https://your-frontend-domain.com
```

### Database Setup (MongoDB Atlas)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Add database user
4. Whitelist IP addresses
5. Get connection string
6. Update `MONGO_URI` in production environment

---

## 📸 Screenshots

### Login Page
![Login](./docs/screenshots/login.png)
*Modern authentication interface with gradient background*

### Dashboard
![Dashboard](./docs/screenshots/dashboard.png)
*Comprehensive analytics with real-time statistics and charts*

### Kanban Board
![Kanban Board](./docs/screenshots/kanban-board.png)
*Drag-and-drop task management with visual organization*

### Task Detail Modal
![Task Detail](./docs/screenshots/task-detail.png)
*Detailed task editing with all features accessible*

### AI Task Generation
![AI Assistant](./docs/screenshots/ai-assistant.png)
*AI-powered task generation interface*

### Mobile Responsive
![Mobile View](./docs/screenshots/mobile-view.png)
*Fully responsive design for mobile devices*

---

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password encryption with bcrypt (10 salt rounds)
- ✅ Protected API routes
- ✅ Input validation and sanitization
- ✅ MongoDB injection prevention
- ✅ Rate limiting on sensitive endpoints
- ✅ CORS configuration
- ✅ Helmet.js security headers

---

## 🧪 Testing

```bash
# Run tests (if implemented)
npm test

# Check code coverage
npm run coverage
```

---

## 📝 Project Structure

```
taskflow/
├── client/                    # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── AI/
│   │   │   └── Kanban/
│   │   ├── context/          # Global state management
│   │   ├── pages/            # Route pages
│   │   ├── services/         # API integration
│   │   ├── utils/            # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                    # Backend Node.js application
│   ├── config/               # Configuration files
│   ├── controllers/          # Business logic
│   ├── middleware/           # Express middleware
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── services/             # External integrations
│   ├── utils/                # Helper functions
│   ├── server.js             # Entry point
│   └── package.json
│
├── docs/                      # Documentation assets
│   ├── images/
│   └── screenshots/
│
├── .gitignore
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Contributors

- **Your Name** - *Full Stack Developer* - [GitHub Profile](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- React Beautiful DnD for drag-and-drop functionality
- Google Gemini API for AI capabilities
- TailwindCSS for beautiful UI components
- MongoDB Atlas for cloud database hosting
- React Icons for comprehensive icon library

---

## 📞 Support

For support, email support@taskflow.com or join our Slack channel.

---

## 🔮 Future Enhancements

- [ ] Real-time collaboration with WebSockets
- [ ] File attachments for tasks
- [ ] Advanced search and filtering
- [ ] Email notifications
- [ ] Calendar view
- [ ] Time tracking
- [ ] Custom workflows
- [ ] Mobile app (React Native)
- [ ] Integration with Slack, GitHub, etc.
- [ ] Advanced reporting and analytics

---

<div align="center">

**Built with ❤️ using the MERN Stack**

⭐ Star this repo if you find it helpful!

[Report Bug](https://github.com/yourusername/taskflow/issues) · [Request Feature](https://github.com/yourusername/taskflow/issues)

</div>
