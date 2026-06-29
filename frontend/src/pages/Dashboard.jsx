import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import TemplatesModal from '../components/TemplatesModal';

const Dashboard = () => {
  const [presentations, setPresentations] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPresentations();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          } else {
            entry.target.classList.remove('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, [presentations]);

  const fetchPresentations = async () => {
    try {
      const res = await api.get('/presentations');
      setPresentations(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const createPresentation = async () => {
    if (!title.trim()) return;
    setCreating(true);
    try {
      const res = await api.post('/presentations', { title });
      navigate(`/editor/${res.data._id}`);
    } catch (err) {
      console.log(err);
    } finally {
      setCreating(false);
    }
  };

  const generateWithAI = async () => {
    if (!aiTopic.trim()) return;
    setAiLoading(true);
    try {
      const aiRes = await api.post('/ai/generate-presentation', {
        topic: aiTopic,
        slideCount: 5
      });
      const presRes = await api.post('/presentations', { title: aiRes.data.title });
      for (const slide of aiRes.data.slides) {
        await api.post(`/presentations/${presRes.data._id}/slides`, slide);
      }
      navigate(`/editor/${presRes.data._id}`);
    } catch (err) {
      console.log(err);
      alert('AI generation failed — try again!');
    } finally {
      setAiLoading(false);
    }
  };

  const deletePresentation = async (id) => {
    if (!confirm('Delete this presentation?')) return;
    try {
      await api.delete(`/presentations/${id}`);
      setPresentations(presentations.filter((p) => p._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <>
      <div className="min-h-screen bg-white flex">

        {/* Sidebar */}
        <div className="w-56 border-r border-gray-100 flex flex-col py-6 px-4 fixed h-full">
          <Link to="/" className="text-lg font-semibold text-gray-900 mb-8 px-2">
            Crowd<span className="text-purple-600">Cast</span>
          </Link>

          <button
            onClick={() => setTitle('')}
            className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2.5 rounded-xl mb-6 flex items-center gap-2 transition"
          >
            <span className="text-lg leading-none">+</span> New Presentation
          </button>

          <nav className="space-y-1">
            {[
              { icon: '🏠', label: 'Home', active: true },
              { icon: '📋', label: 'Templates' },
              { icon: '🗑️', label: 'Trash' },
            ].map((item) => (
              <div
                key={item.label}
                onClick={() => item.label === 'Templates' && setShowTemplates(true)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition ${
                  item.active
                    ? 'text-purple-700 border-l-2 border-purple-500 bg-purple-50'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </nav>

          {/* Bottom user */}
          <div className="mt-auto flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-semibold text-purple-700">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">{user?.name}</p>
              <button onClick={() => { logout(); navigate('/'); }} className="text-xs text-gray-400 hover:text-red-400 transition">
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="ml-56 flex-1 px-12 py-10">

          {/* Welcome */}
          <h1 className="text-3xl font-semibold text-gray-900 mb-8">
            Welcome, {user?.name?.split(' ')[0]}! 👋
          </h1>

          {/* Create input */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 mb-4 flex items-center gap-4">
            <span className="text-purple-400 text-xl">✦</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createPresentation()}
              placeholder="Name your new presentation..."
              className="flex-1 bg-transparent text-gray-700 text-sm focus:outline-none placeholder-gray-400"
            />
            <button
              onClick={createPresentation}
              disabled={creating || !title.trim()}
              className="bg-gray-800 hover:bg-gray-900 text-white text-sm px-4 py-2 rounded-lg transition disabled:opacity-40"
            >
              {creating ? '...' : 'Create →'}
            </button>
          </div>

          {/* AI Generate */}
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder="What would you like to create?"
              className="flex-1 border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
            />
            <button
              onClick={generateWithAI}
              disabled={aiLoading || !aiTopic.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50 flex items-center gap-2"
            >
              {aiLoading ? '✨ Generating...' : '✨ Generate with AI'}
            </button>
          </div>

          {/* Quick tags */}
          <div className="flex gap-2 mb-10">
            {['Interactive presentation', 'Live poll', 'Word cloud', 'Quiz'].map((tag) => (
              <button
                key={tag}
                onClick={() => setTitle(tag)}
                className="text-xs border border-gray-200 text-gray-500 hover:border-purple-300 hover:text-purple-600 px-3 py-1.5 rounded-full transition"
              >
                ✦ {tag}
              </button>
            ))}
          </div>

          {/* Presentations */}
          <h2 className="text-sm font-medium text-gray-500 mb-4">My presentations</h2>

          {loading ? (
            <div className="text-gray-400 text-sm py-10 text-center">Loading...</div>
          ) : presentations.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-sm">No presentations yet — create one above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-5">
              {presentations.map((p) => (
                <div
                  key={p._id}
                  className="border border-gray-100 rounded-2xl overflow-hidden hover:border-purple-200 hover:shadow-sm transition group scroll-animate"
                >
                  {/* Preview area */}
                  <div className="bg-gradient-to-br from-purple-50 to-white h-36 flex items-center justify-center">
                    <div className="text-center px-4">
                      <div className="text-3xl mb-2">📊</div>
                      <p className="text-xs text-gray-400 font-medium truncate max-w-32">{p.title}</p>
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="px-4 py-3 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-semibold text-purple-700">
                          {initials}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-800 truncate max-w-28">{p.title}</p>
                          <p className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/editor/${p._id}`}
                        className="flex-1 text-center text-xs border border-gray-200 hover:border-purple-300 text-gray-600 py-1.5 rounded-lg transition"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/present/${p._id}`}
                        className="flex-1 text-center text-xs bg-purple-600 hover:bg-purple-700 text-white py-1.5 rounded-lg transition"
                      >
                        Go live
                      </Link>
                      <button
                        onClick={() => deletePresentation(p._id)}
                        className="text-xs border border-gray-200 hover:border-red-300 hover:text-red-400 text-gray-400 px-2.5 py-1.5 rounded-lg transition"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showTemplates && (
        <TemplatesModal onClose={() => setShowTemplates(false)} />
      )}
    </>
  );
};

export default Dashboard;