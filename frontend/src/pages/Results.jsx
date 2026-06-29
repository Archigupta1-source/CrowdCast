import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import LiveChart from '../components/LiveChart';

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPresentation();
  }, []);

  const fetchPresentation = async () => {
    try {
      const res = await api.get(`/presentations/${id}`);
      setPresentation(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-20 text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{presentation?.title}</h1>
            <p className="text-sm text-gray-400 mt-1">Session results</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm border border-gray-200 text-gray-600 hover:border-purple-300 px-4 py-2 rounded-lg transition"
          >
            ← Back to dashboard
          </button>
        </div>

        {presentation?.slides?.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-3">📊</div>
            <p>No slides found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {presentation?.slides?.map((slide, index) => (
              <div
                key={slide._id}
                className="bg-white border border-gray-100 rounded-2xl p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs bg-purple-50 text-purple-600 font-medium px-3 py-1 rounded-full uppercase">
                    {slide.type} · Slide {index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  {slide.question}
                </h3>

                {slide.type === 'mcq' && slide.options?.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {slide.options.map((opt, i) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;