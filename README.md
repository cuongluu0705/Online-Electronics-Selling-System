# ElectroStore - Electronics E-commerce System

## 🚀 Setup Guide

###  Backend Setup (Python FastAPI)

Open a Terminal (or CMD/PowerShell) in the root directory of the project:

```bash
# 1. Create a virtual environment
python -m venv .venv

# 2. Activate the virtual environment
# On Windows:
.venv\Scripts\activate
# On Mac/Linux:
source .venv\Scripts\activate

# 3. Install required dependencies
pip install -r requirements.txt
```

### Frontend Setup (ReactJS)

Open a new Terminal, navigate to the Frontend directory:

```bash
cd FE

# Install dependencies
npm install
```

---

## ▶️ How to Run

You need to run both the Backend and Frontend servers simultaneously (2 Terminals).

**Terminal 1 - Backend:**
(Ensure the virtual environment `.venv` is activated)

```bash
# Run from the project root directory
uvicorn Backend.Source.app:app --reload
```

> The Backend API will run at: **http://localhost:8000**

**Terminal 2 - Frontend:**

```bash
cd FE
npm run dev
```

> The Frontend will run at: **http://localhost:3000** (or 5173)

---

## 🛠️ Tech Stack

**Frontend:**
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM

**Backend:**
- Python
- FastAPI
- Uvicorn
- SQLAlchemy
- Pydantic

**Database:**
- MySQL

**Authentication:**
- JWT (JSON Web Tokens)
- Bcrypt (Password Hashing)

---
