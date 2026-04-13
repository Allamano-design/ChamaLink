# ChamaLink - Group Savings Management App

![Status](https://img.shields.io/badge/Status-Work%20in%20Progress-orange)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

A modern, full-stack web application for managing group savings (Chama) with beautiful UI/UX, real-time tracking, and smart reminders.

## 🌟 Features

### Core Features
- **User Authentication**: Secure signup/signin with JWT-based authentication
- **Beautiful UI/UX**: Modern design with Tailwind CSS and Framer Motion animations
- **Group Management**: Create, join, and manage savings groups
- **Smart Invite Codes**: Generate secure invite codes with 10-minute expiry
- **Role-Based Access**: 1 admin and up to 100 members per group
- **Transaction Tracking**: Complete history of all contributions and withdrawals
- **Savings Dashboard**: Visual progress tracking with charts and statistics
- **Member Management**: View and manage group members with contribution details
- **Smart Reminders**: Automated email reminders for pending contributions
- **Real-time Notifications**: Stay updated with group activities

### Additional Features
- Mobile-responsive design
- Profile management
- Contribution frequency options (daily, weekly, monthly)
- Transaction status tracking (pending, completed, failed)
- Multiple payment methods support (Cash, M-Pesa, Bank Transfer)
- Group statistics and analytics

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animation library
- **Recharts** - Data visualization
- **Heroicons** - Icon library
- **React Hot Toast** - Notifications

### Backend
- **Express.js** - Web framework
- **Node.js** - JavaScript runtime
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **node-cron** - Task scheduling
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
ChamaLink/
├── client/                  # React frontend
│   ├── src/
│   │   ├── pages/          # Page components (Dashboard, Groups, etc.)
│   │   ├── components/     # Reusable components (Navbar, PrivateRoute)
│   │   ├── store/          # Zustand state management
│   │   ├── context/        # React context (for future use)
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main App component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .env.example
│
├── server/                  # Express backend
│   ├── src/
│   │   ├── models/         # MongoDB schemas (User, Group, Transaction, InviteCode)
│   │   ├── controllers/    # Route handlers (authController, etc.)
│   │   ├── routes/         # API routes (authRoutes, etc.)
│   │   ├── middleware/     # Custom middleware (authMiddleware)
│   │   ├── utils/          # Utility functions (emailService, inviteCodeHelper)
│   │   └── server.js       # Main Express server
│   ├── package.json
│   └── .env.example
│
├── .github/
│   └── copilot-instructions.md
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- MongoDB (local instance or MongoDB Atlas URI)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ChamaLink
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   
   # Create .env file from .env.example
   cp .env.example .env
   
   # Update .env with your credentials
   # MONGODB_URI=your_mongodb_connection_string
   # JWT_SECRET=your_secret_key
   # EMAIL_USER=your_email@gmail.com
   # EMAIL_PASS=your_app_password
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   
   # Create .env file from .env.example
   cp .env.example .env
   
   # Update .env with backend URL
   # VITE_API_URL=http://localhost:5000/api
   ```

### Running the App

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start the backend** (from `server` directory)
   ```bash
   npm run dev
   # Server will run on http://localhost:5000
   ```

3. **In a new terminal, start the frontend** (from `client` directory)
   ```bash
   npm run dev
   # Frontend will run on http://localhost:5173
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Sign up or sign in to get started

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new account
- `POST /api/auth/signin` - Sign in to account
- `GET /api/auth/profile` - Get user profile (requires authentication)

### Groups (To be implemented)
- `POST /api/groups` - Create a new group
- `GET /api/groups` - Get user's groups
- `GET /api/groups/:id` - Get group details
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group

### Transactions (To be implemented)
- `POST /api/transactions` - Create a transaction
- `GET /api/groups/:id/transactions` - Get group transactions
- `GET /api/transactions` - Get user's transactions

### Invite Codes (To be implemented)
- `POST /api/groups/:id/invite` - Generate invite code
- `POST /api/invite/:code/join` - Join group with invite code

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Secure API endpoints with auth middleware
- CORS protection
- Invite code expiration (10 minutes)
- Rate limiting (to be implemented)
- Input validation (to be implemented)

## 📧 Email Service

The app uses Nodemailer for sending emails. Configure your email service in the `.env` file:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
```

### Email Features
- Welcome email on signup
- Contribution reminders (scheduled via node-cron)
- Transaction notifications (to be implemented)

## 🗄️ Database Schema

### User Model
- Full name, email, phone number
- Hashed password
- Profile picture
- Groups (array of group IDs with roles)
- Total savings
- Timestamps

### Group Model
- Group name and description
- Admin user reference
- Members array with contribution tracking
- Target amount and current amount
- Contribution frequency and amount
- Status (active, paused, completed)
- Timestamps

### Transaction Model
- Group reference
- User reference
- Type (contribution, withdrawal, penalty, bonus)
- Amount
- Status (pending, completed, failed)
- Payment method
- Description
- Approved by (admin reference)
- Timestamps

### InviteCode Model
- Code (8 character unique identifier)
- Group reference
- Created by (admin reference)
- Expiration time (10 minutes)
- Used by array
- Max uses (default 100)
- Is active flag
- Timestamps

## 🎨 UI Components

### Pages
- **Landing Page**: Hero section with features and CTA
- **Signup Page**: Beautiful form with validation
- **Signin Page**: Login form with error handling
- **Dashboard**: Overview with statistics and charts
- **Groups Page**: List of user's groups
- **Create Group Page**: Form to create new group
- **Group Details Page**: Group overview and quick actions
- **Transactions Page**: Transaction history table
- **Members Page**: List of group members
- **Profile Page**: User profile information

### Components
- **Navbar**: Navigation with auth state
- **PrivateRoute**: Protected route wrapper
- **StatsCard**: Statistics display card (in Dashboard)

## 🚧 Next Steps / To-Do

- [ ] Implement all group API endpoints
- [ ] Implement transaction endpoints
- [ ] Implement invite code system
- [ ] Add payment integration (M-Pesa, etc.)
- [ ] Implement real-time notifications (Socket.io)
- [ ] Add admin dashboard with statistics
- [ ] Implement member roles and permissions
- [ ] Add withdrawal features
- [ ] Implement penalty system
- [ ] Add savings goals tracking
- [ ] Research rate limiting
- [ ] Add input validation on all endpoints
- [ ] Implement error logging
- [ ] Add unit and integration tests
- [ ] Deploy to production

## 📝 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/chamalink
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ for the African community

## 📞 Support

For support, email support@chamalink.app or open an issue on GitHub.

---

**Happy Saving with ChamaLink! 💰**
