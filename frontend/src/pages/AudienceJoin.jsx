import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AudienceJoin = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`http://localhost:5000/api/presentations/dummy/sessions/join/${code}`);
      if (!res.ok) throw new Error('Session not found');
      navigate(`/session/${code}`);
    } catch (err) {
      setError('Session not found or has ended');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="flex items-center justify-center py-24 px-4">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Join a session</h1>
          <p className="text-gray-500 text-sm mb-10">
            Enter the 6-digit code shown by your presenter
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleJoin}>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full border-2 border-gray-200 focus:border-purple-400 rounded-xl px-6 py-4 text-3xl font-semibold text-center tracking-widest focus:outline-none transition mb-6"
              placeholder="000000"
              maxLength={6}
            />
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium transition disabled:opacity-50"
            >
              {loading ? 'Joining...' : 'Join session →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AudienceJoin;