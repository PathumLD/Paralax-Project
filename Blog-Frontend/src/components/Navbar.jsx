import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/API'; // Assuming API utility for logout
// import logo from '../assets/react.svg'; // Import your logo image

function Navbar() {
  const navigate = useNavigate();

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      await API.post('/logout'); // Example API call for logout
      localStorage.removeItem('token'); // Remove token from localStorage
      navigate('/login'); // Redirect to login
    } catch (error) {
      console.error('Logout failed:', error.message || error);
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo on the left */}
        <div className="flex items-center text-white font-bold text-2xl">
          <Link to="/dashboard">
            {/* <img src={logo} alt="Logo" className="h-10 w-10" /> */}
            WriteMe
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6 items-center text-white">
          <Link to="/dashboard" className="hover:text-gray-400">
            Dashboard
          </Link>
          <Link to="/myposts" className="hover:text-gray-400">
            My Posts
          </Link>
          <Link to="/addPost" className="hover:text-gray-400">
            Add New Post
          </Link>
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

export default Navbar;
