# BadgerType: Type Fast. Fear Nothing.

BadgerType is a real-time, competitive multiplayer typing game built for casual gamers. It features a fully responsive UI, an authoritative WebSocket backend for perfect 1v1 synchronization, and secure user profiles to track lifetime typing statistics. Test it out here:

[BadgerType Live Site](https://badgertype-frontend-597162430503.us-west2.run.app/)

## 🚀 Features

- **Real-Time Multiplayer (1v1):** Generate unique, private lobbies and race friends in real-time. Matches are synchronized perfectly using an authoritative WebSocket backend.
- **Solo Practice Engine:** Practice your speed with live Words Per Minute (WPM), accuracy, and error tracking before stepping into the arena.
- **Dynamic Quote Generation:** Fetches random quotes (focused on stoicism, success, and courage) via API Ninjas to ensure no two races feel the same.
- **Hard Finish Line System:** "MonkeyType" style error highlighting coupled with a hard stop mechanism that requires 100% accuracy to complete the race, preventing "key mashing" exploits.
- **User Authentication:** Secure login, registration, and session management powered by Clerk.
- **Comprehensive Player Profiles:** Tracks and displays lifetime WPM, average accuracy, total matches, and a detailed ledger of recent match history.

## 🛠️ Tech Stack

| Category           | Technology                                             |
| :----------------- | :----------------------------------------------------- |
| **Frontend**       | React, Vite, Tailwind CSS, React Router, Framer Motion |
| **Backend**        | Python 3.10, FastAPI, WebSockets, Uvicorn, Pydantic    |
| **Database**       | PostgreSQL (Neon), SQLModel, SQLAlchemy                |
| **Authentication** | Clerk (Identity Provider)                              |
| **Deployment**     | Docker, Nginx, Google Cloud Run                        |

## 📂 Project Architecture

The project utilizes a decoupled microservice architecture, separated into Frontend and Backend services:

```text
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── api/              # REST endpoints (auth, stats, matches)
│   │   ├── core/             # Database connection and config
│   │   ├── models/           # SQLModel database schemas
│   │   ├── schemas/          # Pydantic validation schemas
│   │   ├── websockets/       # Connection manager and lobby logic
│   │   └── main.py           # Application entry point
│   ├── Dockerfile            # Python backend container build instructions
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # React Application
│   ├── src/
│   │   ├── components/       # Reusable UI (Buttons, ProgressBar)
│   │   ├── features/         # Domain logic (TypingDisplay, Results)
│   │   ├── hooks/            # Custom React hooks (useTypeEngine)
│   │   ├── pages/            # Route components (Home, Arena, Profile)
│   │   └── App.jsx           # Main routing configuration
│   ├── Dockerfile            # Nginx multi-stage container build instructions
│   └── nginx.conf            # Nginx configuration for React Router fallback
```

## 💻 Local Development Setup

### Prerequisites

- Node.js (v20+)
- Python (3.10+)
- Docker Desktop (Optional, for local container testing)
- A Neon Postgres Database & API Ninjas Key
- A Clerk account for authentication

### 1. Environment Variables

Create a `.env` file in the **`backend/`** directory (Ensure there are **no spaces** or quotes for Docker compatibility):

```env
DATABASE_URL=postgresql://your_neon_db_url_here
API_KEY=your_api_ninjas_key_here
```

Create a `.env.local` file in the **`frontend/`** directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here
```

### 2. Backend Setup (FastAPI)

Navigate to the backend directory, create a virtual environment, and boot the server:

```bash
cd backend
python3 -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

_The backend API will run on http://localhost:8000._

### 3. Frontend Setup (React/Vite)

Open a new terminal tab, navigate to the frontend directory, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

_The frontend client will run on http://localhost:5173._

## ☁️ Docker & Deployment

Both the frontend and backend are fully containerized and configured for serverless deployment on Google Cloud Run.

### Building Locally with Docker

**Test the Backend Container:**

```bash
cd backend
docker build -t badgertype-backend .
docker run -d -p 8000:8000 --env-file .env badgertype-backend
```

**Test the Frontend Container (Multi-stage Nginx):**

```bash
cd frontend
docker build -t badgertype-frontend --build-arg VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key .
docker run -d -p 80:80 badgertype-frontend
```

### Deploying to Google Cloud Run

Using the Google Cloud CLI (`gcloud`), deploy directly from the source code. Make sure to swap out your `localhost` URLs in the frontend for your live Cloud Run URLs before deploying the React app!

**Deploy Backend:**

```bash
gcloud run deploy badgertype-backend --source . --allow-unauthenticated
```

_(Ensure you add your `DATABASE_URL` and `API_KEY` to the Variables & Secrets tab in the Cloud Run dashboard after deploying)._

**Deploy Frontend:**

```bash
gcloud run deploy badgertype-frontend   --source .   --allow-unauthenticated   --set-build-env-vars VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## 📜 Acknowledgments

Developed as a high-quality portfolio piece demonstrating real-time WebSockets, robust React state management, and modern cloud deployment practices.
