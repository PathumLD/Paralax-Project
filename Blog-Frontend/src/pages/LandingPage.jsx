import { useNavigate } from "react-router-dom";



function LandingPage() {

    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    };

    const handleRegister = () => {
        navigate("/register");
    };

    const handleAdminLogin = () => {
        navigate("/admin-login");
    };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-gray-800 text-5xl font-bold mb-6">Welcome to Our Website</h1>
      <p className="text-gray-600 text-lg mb-8">Join us today for an amazing experience!</p>

      <div className="flex flex-col space-y-4 mb-8">
      <p className="text-gray-600 text-center font-bold text-lg">For users</p>
        <div className="flex space-x-4">
          <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600">
            Login
          </button>
          <button onClick={handleRegister} className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600">
            Register
          </button>
        </div>
      </div>

      <div>
        <p className="text-gray-600 text-center font-bold text-lg mb-3">For Admins</p>
        <button onClick={handleAdminLogin} className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600">
          Admin Login
        </button>
       
      </div>
    </div>
  );
}

export default LandingPage;
