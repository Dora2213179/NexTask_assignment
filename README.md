# NexTask - Team Project & Task Management System

![NexTask Cover](./screenshots/dashboard.png)

A modern, production-ready full-stack web application designed for agile teams to manage projects and tasks efficiently. NexTask is built with a focus on clean architecture, beautiful UI, and scalable backend design.

## 📸 Screenshots

### Dashboard & Analytics
![Dashboard](./screenshots/dashboard.png)
*Interactive dashboard with real-time stats and task status breakdown.*

### Drag-and-Drop Kanban Board
![Kanban Board](./screenshots/kanban.png)
*Manage tasks visually by dragging them across To Do, In Progress, and Done columns.*

### Project Overview
![Projects](./screenshots/projects.png)
*Clean project listing with empty states and quick actions.*

---

## 🛠️ Tech Stack

### Frontend
* **React 19** + **TypeScript**
* **Vite** (Build tool)
* **Tailwind CSS v3** (Custom "Midnight Glass" Theme)
* **@hello-pangea/dnd** (Drag and Drop)
* **Sonner** (Toast notifications)
* **Recharts** (Dashboard analytics)

### Backend
* **Java 17** + **Spring Boot 3**
* **Spring Security** + **JWT** (Stateless authentication)
* **Spring Data JPA / Hibernate**
* **MySQL / H2 In-Memory**
* **Maven**

---

## ✨ Key Features
- **Secure Authentication**: JWT-based stateless auth with password encryption. Includes inline form validations.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `ADMIN` (create/delete) and `MEMBER` (view/update).
- **Interactive Kanban**: Fully functional drag-and-drop board.
- **Premium UI**: Skeleton loaders, beautiful empty states, responsive sidebar, and smooth toast notifications.
- **Robust APIs**: Clean REST API design using the DTO pattern with global exception handling.

---

## 🚀 Setup & Running

### 1. Database Setup
The backend is currently configured to use an H2 in-memory database for immediate testing without setup. If you wish to use MySQL, update `application.properties` with your credentials.

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` folder.
2. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
3. The server will start on `http://localhost:8081`.
4. **Seed Data:** The database automatically populates with test users, projects, and tasks on startup.

### 3. Frontend Setup
1. Open another terminal and navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the application at `http://localhost:5173`.

---

## 🔑 Demo Credentials
- **Admin**: `admin@ethara.com` / `password`
- **Member**: `alice@ethara.com` / `password`

---

## 🏛️ Architecture Overview

- **DTO Pattern**: Entities are never exposed directly to the client. We map Entities to DTOs to avoid over-posting and infinite recursion.
- **Global Exception Handler**: Standardized error responses using `@ControllerAdvice`.
- **Stateless Sessions**: The backend verifies JWT signatures via `OncePerRequestFilter` to allow horizontally scalable authentication.
