# 🎥 Movie Ticket Booking Platform - Frontend  

This is the **frontend** repository for the Movie Ticket Booking Platform. Built using **Next.js**, this application allows users to browse movies, view show details, and book tickets seamlessly.  

---

## 🚀 Features  

### User Side  
- Browse a list of movies with details like title, genre, and duration.  
- Search movies based on title or keywords.  
- View available shows for a selected movie, including theater and screen details.  
- Book tickets for available shows with a simple and intuitive interface.  
- Login and Register functionality to manage user-specific bookings securely.  
- View and manage your profile with past booking details.  

### Admin Side  
- Add, edit, or delete movies.  
- Manage theaters, screens, and show schedules.  
- Assign movies to theaters and screens with date, time, and pricing details.  
- View and manage user bookings.  

---

## 🛠️ Tech Stack  

- **Next.js**: Framework for server-side rendering and static site generation.  
- **Tailwind CSS**: For modern, responsive styling.  
- **fetch API**: For HTTP requests to interact with backend APIs.  

---

## 🛠️ Project Setup  

### Prerequisites  
- Node.js (version 18 or above)  
- npm or yarn  

### Installation  

1. Clone the repository:  
   ```bash  
   git clone <repository-url>  
   cd <repository-folder>  
   ```  

2. Install dependencies:  
   ```bash  
   npm install  
   # or  
   yarn install  
   ```  

3. Set up environment variables:  
   Copy the `.env_sample` to `.env` and configure the necessary values:  
   ```env  
   NEXT_PUBLIC_BACKEND_HOST=http://localhost:8000  
   ```  

4. Start the development server:  
   ```bash  
   npm run dev  
   # or  
   yarn dev  
   ```  

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.  

---

## 📂 Folder Structure  

```plaintext  
src/app/                     # Main application folder  
│  
├── admin/                   # Admin dashboard pages  
├── bookings/                # User booking pages  
├── components/              # Reusable UI components  
├── fonts/                   # Custom fonts  
├── login/                   # Login page  
├── logout/                  # Logout functionality  
├── movies/                  # Movie listing and details pages  
├── profile/                 # User profile and booking history  
├── register/                # User registration page  
├── search/                  # Search functionality for movies  
├── theaters/                # Theater and show details  
│  
├── favicon.ico              # Favicon  
├── globals.css              # Global Tailwind CSS styles  
├── helpers.js               # Utility helper functions  
├── layout.js                # Main layout component  
├── page.js                  # Root page component  
│  
├── .env                     # Environment variables  
├── .eslintrc.json           # ESLint configuration  
├── .gitignore               # Git ignore file  
├── jsconfig.json            # JS configuration file  
├── next.config.mjs          # Next.js configuration  
├── package.json             # Project dependencies and scripts  
├── package-lock.json        # Package lock file  
├── postcss.config.mjs       # PostCSS configuration for Tailwind CSS  
├── README.md                # Project documentation  
└── tailwind.config.js       # Tailwind CSS configuration file  
```

---

## 🔧 Scripts  

- **Start Development Server**:  
   ```bash  
   npm run dev  
   ```  

- **Build for Production**:  
   ```bash  
   npm run build  
   ```  

- **Start Production Server**:  
   ```bash  
   npm start  
   ```  

- **Lint the Code**:  
   ```bash  
   npm run lint  
   ```  

---

## ✅ Environment Variables  

Create a `.env` file in the root directory and configure the following variables:  

```env  
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000  
```  

---

## 📅 License  

This project is licensed under the MIT License.  

---

## 📥 Backend Repository  

The backend services for this application can be found [here](https://github.com/RupaKodali/movie-booking-platform-backend).  

---

## 📈 Future Enhancements  
- Implement seat selection and interactive booking.  
- Add user feedback and ratings for movies.  
- Introduce payment gateway integration.  
- Enhanced admin dashboard with analytics and reporting.  

---

## 💬 Feedback  

We welcome contributions and suggestions! If you'd like to report a bug or suggest an improvement, please create an issue or submit a pull request.  
