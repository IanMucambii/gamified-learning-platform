# MindCare / Gamified Learning & Cognitive Care Platform (Monolithic Repository)

Welcome to the **MindCare** platform! This is a comprehensive gamified learning, cognitive stimulation, and health/education care platform designed to support patients/students, doctors/professors, and administrators with specialized tools, AI-assisted content generation, interactive cognitive exercises, and detailed progress reports.

---

## 🏗 Project Architecture & Structure

This repository is organized as a **monolith** containing a backend API server and three distinct frontend single-page web applications built with React and Vite:

```text
gamified-learning-platform/
├── server/             # Express.js REST API, Mongoose models, and AI/PDF services
├── web-aluno/          # Student/Patient portal (gamified learning, exercises, achievements)
├── web-professor/      # Doctor/Professor portal (material & PDF upload, AI phrase generator)
└── web-admin/          # Administrator portal (patient care management, caregiver assignment, reports)
```

---

## 🛠 Tech Stack & Dependencies

### **Backend (`/server`)**
- **Runtime & Language:** Node.js, TypeScript (`tsx` for development)
- **Framework:** Express.js (`v5`)
- **Database:** MongoDB (`mongoose`)
- **Authentication:** JSON Web Tokens (`jsonwebtoken`), Password Hashing (`bcryptjs`)
- **File Handling & Parsing:** `multer`, `pdf-parse`
- **Environment & Utilities:** `dotenv`, `cors`

### **Frontends (`/web-aluno`, `/web-professor`, `/web-admin`)**
- **Framework:** React (`v19`), Vite
- **Routing:** React Router (`react-router-dom` in `web-aluno`)
- **Styling:** Custom CSS / Modern UI styling
- **Language:** TypeScript

---

## 🚀 Getting Started & How to Run

### **1. Prerequisites**
- Node.js (v18 or higher recommended)
- MongoDB instance (local MongoDB service or MongoDB Atlas URI)
- Package manager (`npm`)

### **2. Environment Variables Setup**
Create a `.env` file inside the `server/` directory based on your environment needs. For example:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mindcare
JWT_SECRET=your_super_secret_jwt_key_here
GROQ_API_KEY=your_groq_key
```

### **3. Installing Dependencies**
Install dependencies for each package/service in the monolith:

```bash
# Server dependencies
cd server
npm install

# Student Portal dependencies
cd ../web-aluno
npm install

# Professor Portal dependencies
cd ../web-professor
npm install

# Admin Portal dependencies
cd ../web-admin
npm install
```

### **4. Running the Applications**

You can run each service concurrently in separate terminal windows:

- **Start Backend API Server:**
  ```bash
  cd server
  npm run dev
  ```
  *(Runs on `http://localhost:5000` or 3000)*

- **Start Student Portal (`web-aluno`):**
  ```bash
  cd web-aluno
  npm run dev
  ```

- **Start Professor Portal (`web-professor`):**
  ```bash
  cd web-professor
  npm run dev
  ```

- **Start Admin Portal (`web-admin`):**
  ```bash
  cd web-admin
  npm run dev
  ```

---

## 📱 Portals Overview

1. **Student / Patient Portal (`web-aluno`)**: Gamified activities, exercises, puzzles, quizzes, daily streaks, progress tracking, and achievements.
2. **Doctor / Professor Portal (`web-professor`)**: Material library management, PDF uploading, and AI-assisted phrase generation for learning and stimulation.
3. **Admin Portal (`web-admin`)**: Comprehensive administrative control, patient/caregiver management, system metrics, and activity reports.
