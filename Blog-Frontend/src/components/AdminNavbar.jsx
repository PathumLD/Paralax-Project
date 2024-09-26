import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/API'; // Assuming API utility for making HTTP requests

function AdminNavbar() {
  const navigate = useNavigate();

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('adminToken'); // Get the token from localStorage
      if (!token) {
        throw new Error('No token found');
      }

      // Add the token in the Authorization header
      await API.post('/admin/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}` // Pass the token in the request headers
        }
      });

      localStorage.removeItem('adminToken'); // Remove token from localStorage
      navigate('/admin-login'); // Redirect to login
    } catch (error) {
      console.error('Logout failed:', error.message || error);
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo on the left */}
        <div className="flex items-center text-white font-bold text-2xl">
          <Link to="/admin/dashboard">
            WriteMe Admin
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6 items-center text-white">
          <button
            onClick={handleLogout}
            className="hover:text-gray-400 focus:outline-none"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
