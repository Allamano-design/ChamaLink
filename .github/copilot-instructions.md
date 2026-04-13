# ChamaLink - Savings Group Management App

## Project Overview
ChamaLink is a full-stack web application for managing group savings (Chama). Features include:
- User authentication (signup/signin with beautiful forms)
- Group creation and membership management
- Invite codes with 10-minute expiry
- 1 admin per group, up to 100 members per group
- Transaction tracking and history
- Savings progress visualization
- Member dashboards
- Reminders for contributions
- Real-time notifications

## Tech Stack
- **Frontend**: React 18 with Vite, Tailwind CSS for styling, Zustand for state management
- **Backend**: Express.js with Node.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer for notifications
- **Scheduling**: node-cron for reminder notifications

## Project Structure
```
ChamaLink/
├── client/              # React frontend
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React Context API
│   │   ├── hooks/       # Custom hooks
│   │   └── utils/       # Utility functions
│   ├── package.json
│   └── vite.config.js
├── server/              # Express backend
│   ├── src/
│   │   ├── models/      # MongoDB schemas
│   │   ├── controllers/ # Route handlers
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Custom middleware
│   │   ├── utils/       # Utility functions
│   │   └── server.js    # Main server file
│   ├── package.json
│   └── .env             # Environment variables
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB local instance or MongoDB Atlas URI
- npm or yarn

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

### Backend Setup
```bash
cd server
npm install
# Copy .env.example to .env and configure
npm run dev
```

## Key Features Implementation Checklist
- [ ] User Authentication (Signup/Signin)
- [ ] Beautiful Auth Forms with Tailwind CSS
- [ ] Group Creation and Management
- [ ] Invite Code Generation (10-min expiry)
- [ ] Member Management (Admin + Members)
- [ ] Transaction Tracking
- [ ] Savings Progress Dashboard
- [ ] Reminders and Notifications
- [ ] Real-time Updates
- [ ] Mobile Responsive Design

## Notes
- Add environment variables: MongoDB URI, JWT Secret, Email credentials
- Implement rate limiting for security
- Add input validation on all endpoints
- Set up proper error handling throughout the app
