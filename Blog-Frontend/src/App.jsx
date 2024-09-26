/* eslint-disable no-unused-vars */
// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BlogDetails from './pages/BlogDetails';
import Navbar from './components/Navbar';
import MyPosts from './pages/MyPosts';
import EditPost from './pages/EditPosts';
import AddPost from './pages/AddPost';
import AdminLogin from './pages/admin/AdminLogin';
import AdminNavbar from './components/AdminNavbar';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBlogView from './pages/admin/AdminBlogView';
import LandingPage from './pages/LandingPage';

const ProtectedRoute = () => {
  const client = localStorage.getItem('token'); // Check for the token
  const userId = localStorage.getItem('userId'); // Check for user id if necessary


  if (!client) {
    return <Navigate to="/login" replace />; // Redirect to login if no token found
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-slate-100">
        {/* Navbar */}
        <div className="fixed top-0 z-10  w-full  shadow-md">
          <Navbar />
        </div>

        {/* Main content area */}
        <div className="h-screen mt-16  overflow-auto">
          <div className="container mx-auto w-full">
            <Outlet /> {/* Render child routes here */}
          </div>
        </div>
      </div>
    </>
  );
};


const AdminRoute = () => {
  const admin = localStorage.getItem('adminToken'); // Check for the token


  if (!admin) {
    return <Navigate to="/admin-login" replace />; // Redirect to login if no token found
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-slate-100">
        {/* Navbar */}
        <div className="fixed top-0 z-10  w-full  shadow-md">
          <AdminNavbar />
        </div>

        {/* Main content area */}
        <div className="h-screen mt-16  overflow-auto">
          <div className="container mx-auto w-full">
            <Outlet /> {/* Render child routes here */}
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<LandingPage />} />
        
      <Route path="/admin-login" element={<AdminLogin />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/show-admin/:postId" element={<AdminBlogView />} />
        </Route>

        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/posts/:postId" element={<BlogDetails />} />
          <Route path="/myposts" element={<MyPosts />} />
          <Route path="/posts/edit/:postId" element={<EditPost />} />
          <Route path="/addPost" element={<AddPost />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
