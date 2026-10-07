# CodeGame

CodeGame is an interactive coding-learning platform built around a gamified learning experience. It combines a 3D jungle-inspired interface with structured programming chapters, user progress, community discussions, and competitive leaderboards.

## Features

- Interactive 3D learning environment with React Three Fiber
- Programming curriculum covering fundamentals, control flow, loops, arrays, functions, and upcoming topics
- User registration and login with JWT authentication
- Google OAuth integration
- User XP, tiers, streaks, and completed levels
- Global and chapter-based leaderboards
- Community discussion forum
- Create threads, reply to discussions, and mark solutions
- Thread and reply upvoting with XP rewards
- Search, sorting, filtering, and pagination for forum discussions
- Responsive animated interface with GSAP and Three.js
- MongoDB support with a local file-store fallback for user data

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Three.js
- React Three Fiber
- React Three Drei
- GSAP
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Passport / Google OAuth
- Nodemailer

## Project Structure

```text
CodeGame/
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   └── pages/
│   └── package.json
│
└── codegame-backend/
    ├── controllers/
    ├── data/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── utils/
    └── package.json
