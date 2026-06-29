import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import useWebSocket from '../hooks/useWebSocket';
import LiveChart from '../components/LiveChart';

const PresenterView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);

  const { sendMessage } = useWebSocket((message) => {
    if (message.type === 'results:update') {
      setResults(message.results);
      setTotalVotes(message.totalVotes);
    }
  });

  useEffect(() => {
    startSession();
  }, []);

  const startSession = async () => {
    try {
      const presRes = await api.get(`/presentations/${id}`);
      setSlides(presRes.data.slides);

      const sessionRes = await api.post(`/presentations/${id}/sessions`);
      setSession(sessionRes.data);

      setTimeout(() => {
        sendMessage({ type: 'session:join', code: sessionRes.data.code, role: 'presenter' });
        broadcastSlide(presRes.data.slides[0], sessionRes.data.code);
      }, 500);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const broadcastSlide = (slide, code) => {
    sendMessage({
      type: 'slide:change',
      code,
      slideIndex: currentIndex,
      slide
    });
    setResults({});
    setTotalVotes(0);
  };

  const goToSlide = (index) => {
    if (index < 0 || index >= slides.length) return;
    setCurrentIndex(index);
    broadcastSlide(slides[index], session.code);
  };

  const endSession = async () => {
    try {
      await api.patch(`/presentations/${id}/sessions/${session._id}/end`);
      navigate('/dashboard');
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Starting session...</p>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-lg font-semibold text-gray-900">
            Crowd<span className="text-purple-600">Cast</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-500">Live</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-xs text-gray-400">Room code</p>
            <p className="text-2xl font-semibold tracking-widest text-purple-600 font-mono">
              {session?.code}
            </p>
          </div>
          <button
            onClick={endSession}
            className="text-sm border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition"
          >
            End session
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-10 grid grid-cols-2 gap-10">

        {/* Left — current slide */}
        <div>
          <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-4">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs bg-purple-50 text-purple-600 font-medium px-3 py-1 rounded-full uppercase">
                {currentSlide?.type} · Slide {currentIndex + 1} of {slides.length}
              </span>
              <span className="text-sm text-gray-400">{totalVotes} votes</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {currentSlide?.question}
            </h2>

            {currentSlide?.type === 'mcq' && (
              <div className="grid grid-cols-2 gap-3">
                {currentSlide.options.map((opt, i) => (
                  <div
                    key={i}
                    className="border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-600"
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={() => goToSlide(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:border-purple-300 transition disabled:opacity-30"
            >
              ← Previous
            </button>
            <button
              onClick={() => goToSlide(currentIndex + 1)}
              disabled={currentIndex === slides.length - 1}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Right — live results */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          <h3 className="text-sm font-medium text-gray-700 mb-6">Live results</h3>

          {Object.keys(results).length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-sm">Waiting for responses...</p>
            </div>
          ) : (
            <LiveChart results={results} totalVotes={totalVotes} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PresenterView;