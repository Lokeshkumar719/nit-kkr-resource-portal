# 🎓 NIT KKR Resource Portal

A **college-exclusive academic resource platform** built for students of **NIT Kurukshetra**.

The platform allows students to:

- Access **branch-wise and semester-wise study resources**
- View **Notes, Books, and Previous Year Questions (PYQ)**
- Connect with **seniors and alumni**
- Contribute useful academic resources

Only users with a **valid NIT Kurukshetra email domain** can access the resources.

---

# 🚀 Features

## 🔐 Domain Restricted Login

Users must log in using their **NIT Kurukshetra email ID**.

Authentication uses:

- **JWT**
- **HTTP-only cookies**
- Secure backend session validation

---

## 📚 Structured Resource Access

Students can access academic resources through the following flow:

```
Branch → Semester → Resource Type → Resource Link
```

Resource types include:

- 📄 Notes
- 📚 Books
- 📝 Previous Year Questions (PYQ)

All files are stored in **Google Drive** and are accessible **only to NIT KKR domain users**.

---

## 🧑‍🎓 Connect With Seniors

Students can connect with:

- Senior students
- Alumni

This helps juniors receive guidance about:

- Courses
- Preparation strategies
- Internships
- Placements

---

## 📝 Contribution System

Students can contribute useful academic resources which can later be reviewed and managed by admins.

---

## 🛠 Admin Dashboard

Admins can:

- Manage study resources
- Review contributions
- Maintain platform content

---

# 🏗 System Architecture

```
Frontend (React + Vite)
        ↓
Backend API (Node.js + Express)
        ↓
Database (MongoDB)
        ↓
File Storage (Google Drive)
```

### Why Google Drive?

Instead of storing large files in the database:

- MongoDB stores **resource metadata**
- Google Drive stores **actual files**

This keeps the system **lightweight and scalable**.

---

# 🗂 Project Structure

```
NIT-KKR-RESOURCE-PORTAL
│
├── backend/            # Node.js + Express backend
│
├── components/         # Reusable React components
├── context/            # React authentication context
├── pages/              # Page components
├── services/           # API service layer (Axios)
│
├── App.jsx             # Main React application
├── index.jsx           # React entry point
├── index.html          # Root HTML file
│
├── vite.config.js      # Vite configuration
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
│
└── README.md
```

---

# ⚙️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication

- JWT
- HTTP-only Cookies

### Storage

- Google Drive (for Notes, Books, PYQs)

---

# 🔑 Authentication Flow

1. User logs in using their **NIT KKR email ID**
2. Backend verifies the email and generates a **JWT token**
3. The token is stored in an **HTTP-only cookie**
4. On refresh, the frontend verifies the session using `/api/users/me`

---

# 📂 Resource Access Flow

```
Branch List
      ↓
Semester Selection (1–8)
      ↓
Notes / Books / PYQ
      ↓
Open Google Drive Folder
```

Google Drive folders are restricted to **NIT Kurukshetra domain users only**.

---

# 🖥 Running the Project Locally

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Lokeshkumar719/nit-kkr-resource-portal.git
cd nit-kkr-resource-portal
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Start Backend Server

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

## 4️⃣ Start Frontend

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

# 📌 Future Improvements

Possible enhancements:

- AI-based resource recommendation
- Improved senior–junior interaction
- Machine Learning to Predict Exams

# 🤝 Contributors

Developed as part of a **college project**.

Add your team members here:

- Lokesh Kumar
- Harshil Goel
- Devraj Sharma
- Jatin Gautam
- Amritansh Saxena

---

# 📜 License

This project is created for **educational purposes**.
