import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-gray-900">
          Crowd<span className="text-purple-600">Cast</span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-500">Hi, {user.name}</span>
              <Link
                to="/dashboard"
                className="text-sm text-gray-700 hover:text-purple-600 transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-700 hover:text-purple-600 transition"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;