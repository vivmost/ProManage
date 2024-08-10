# ProManage

ProManage is a robust web application designed to simplify project organization, team collaboration, scheduling, and progress tracking. Developed with a focus on efficiency and user experience, it leverages modern technologies to deliver a comprehensive project management solution.

## Features

- **User Authentication**: Secure login and registration with JWT authentication.
- **Task Management**: Create, assign, and track tasks with real-time updates.
- **User Management**: Add and manage users within the project.
- **Status Tracking**: Monitor the progress of tasks and projects.
- **Analytics**: Generate insights and reports on project performance.
- **Dynamic Task Filtering**: Filter tasks based on various criteria.
- **Responsive UI/UX**: Mobile-friendly and adaptive user interface.
- **Real-Time Updates**: Live updates on project changes.
- **Secure Authentication**: Encrypted password storage and secure JWT authentication.
- **Cloud Deployment**: Deployed on Azure with scalability and performance best practices.

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT
- **Deployment**: render(backend), netlify(frontend)

## Getting Started

### Prerequisites

- Node.js and npm (Node Package Manager)
- MongoDB (or MongoDB Atlas for cloud database)

### Installation

1. **Clone the repository:**

   git clone https://github.com/yourusername/ProManage.git
   cd ProManage
   
2. **Install frontend dependencies:**

   git clone https://github.com/yourusername/ProManage.git
   cd ProManage
   
3. **Install backend dependencies::**

   cd ../server
   npm install


4. **Configure environment variables:**

   Create a .env file in the server directory and add your environment variables (e.g., database URI, JWT secret, FRONTEND_HOST).
   Create a .env file in the client directory and add your environment variables (e.g., BACKEND_HOST).
   
5. **Run the application:**
  - **Start the backend server:**

     ```bash
     cd server
     npm start
     ```

   - **Start the frontend development server:**

     ```bash
     cd ../client
     npm start
     ```

