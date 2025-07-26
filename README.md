# Donghua Tracker

A personal donghua (Chinese animation) tracking application built with React and Express.

## Features

- User authentication and registration
- Add, edit, and delete donghua entries
- Track watching progress and ratings
- Statistics and analytics
- Dark/light theme toggle
- Responsive design

## Tech Stack

### Frontend

- React 19
- Tailwind CSS
- Axios for API calls
- React Router for navigation
- Chart.js for statistics

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Multer for file uploads
- CORS enabled

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd donghua-tracker
   ```

2. **Install all dependencies**

   ```bash
   npm run install-all
   ```

3. **Set up environment variables**

   Create a `.env` file in the `server` directory:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/donghua-tracker
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. **Start MongoDB**

   Make sure MongoDB is running on your system. If using MongoDB Atlas, update the MONGO_URI in the .env file.

### Running the Application

#### Development Mode (Both client and server)

```bash
npm run dev
```

This will start:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

#### Individual Components

**Frontend only:**

```bash
npm run client
```

**Backend only:**

```bash
npm run server
```

#### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Donghua Management

- `GET /api/donghua` - Get all donghua for user
- `POST /api/donghua` - Add new donghua
- `GET /api/donghua/:id` - Get specific donghua
- `PUT /api/donghua/:id` - Update donghua
- `DELETE /api/donghua/:id` - Delete donghua
- `GET /api/donghua/stats` - Get user statistics

### Profile

- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

## Project Structure

```
donghua-tracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── public/             # Static files
├── server/                 # Express backend
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Custom middlewares
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── utils/              # Utility functions
└── package.json            # Root package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC
