import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const slideTypeColors = {
  mcq: 'bg-purple-50',
  wordcloud: 'bg-green-50',
  opentext: 'bg-blue-50',
};

const slideTypeIcons = {
  mcq: '📊',
  wordcloud: '☁️',
  opentext: '✏️',
};

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [presentation, setPresentation] = useState(null);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [adding, setAdding] = useState(false);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);

  const [type, setType] = useState('mcq');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    fetchPresentation();
  }, []);

  const fetchPresentation = async () => {
    try {
      const res = await api.get(`/presentations/${id}`);
      setPresentation(res.data);
      setSlides(res.data.slides || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const addSlide = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const payload = {
        type,
        question,
        options: type === 'mcq' ? options.filter(o => o.trim()) : [],
        settings: { timer, anonymous: true, showResults: true }
      };
      const res = await api.post(`/presentations/${id}/slides`, payload);
      setSlides([...slides, res.data]);
      setActiveSlide(slides.length);
      setQuestion('');
      setOptions(['', '', '', '']);
      setShowAddPanel(false);
    } catch (err) {
      console.log(err);
    } finally {
      setAdding(false);
    }
  };

  const updateSlide = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        type,
        question,
        options: type === 'mcq' ? options.filter(o => o.trim()) : [],
        settings: { timer, anonymous: true, showResults: true }
      };
      const res = await api.patch(`/presentations/${id}/slides/${editingSlide._id}`, payload);
      const updated = slides.map(s => s._id === editingSlide._id ? res.data : s);
      setSlides(updated);
      setEditingSlide(null);
      setShowAddPanel(false);
      setQuestion('');
      setOptions(['', '', '', '']);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteSlide = async (slideId, index) => {
    try {
      await api.delete(`/presentations/${id}/slides/${slideId}`);
      const updated = slides.filter(s => s._id !== slideId);
      setSlides(updated);
      setActiveSlide(Math.max(0, index - 1));
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  );

  const currentSlide = slides[activeSlide];

  return (
    <div className="h-screen bg-white flex flex-col">

      {/* Top navbar */}
      <div className="border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-gray-600 transition">
            ←
          </button>
          <span className="font-medium text-gray-800 text-sm">{presentation?.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{slides.length} slides</span>
          <button
            onClick={() => navigate(`/present/${id}`)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
          >
            Go live →
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Left — slide thumbnails */}
        <div className="w-52 border-r border-gray-100 overflow-y-auto py-4 px-3 bg-gray-50">
          {slides.map((slide, index) => (
            <div
              key={slide._id}
              onClick={() => setActiveSlide(index)}
              className={`relative rounded-xl mb-3 cursor-pointer transition group ${
                activeSlide === index
                  ? 'ring-2 ring-purple-500'
                  : 'hover:ring-1 hover:ring-purple-300'
              }`}
            >
              <div className={`${slideTypeColors[slide.type] || 'bg-gray-50'} rounded-xl p-3`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs">{slideTypeIcons[slide.type]}</span>
                  <span className="text-xs text-gray-400 uppercase font-medium">{slide.type}</span>
                </div>
                <p className="text-xs text-gray-700 font-medium line-clamp-3">{slide.question}</p>
              </div>
              <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs text-gray-500 font-medium shadow-sm">
                {index + 1}
              </div>
              {/* Edit button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingSlide(slide);
                  setType(slide.type);
                  setQuestion(slide.question);
                  setOptions(slide.options?.length ? slide.options : ['', '', '', '']);
                  setTimer(slide.settings?.timer || 60);
                  setShowAddPanel(true);
                }}
                className="absolute top-1 right-7 w-5 h-5 bg-blue-100 text-blue-400 rounded-full text-xs hidden group-hover:flex items-center justify-center"
              >
                ✎
              </button>
              {/* Delete button */}
              <button
                onClick={(e) => { e.stopPropagation(); deleteSlide(slide._id, index); }}
                className="absolute top-1 right-1 w-5 h-5 bg-red-100 text-red-400 rounded-full text-xs hidden group-hover:flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}

          <button
            onClick={() => {
              setEditingSlide(null);
              setQuestion('');
              setOptions(['', '', '', '']);
              setType('mcq');
              setShowAddPanel(true);
            }}
            className="w-full border-2 border-dashed border-gray-200 hover:border-purple-300 rounded-xl py-4 text-gray-400 hover:text-purple-500 text-sm transition"
          >
            + Add slide
          </button>
        </div>

        {/* Center — slide preview */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
          {slides.length === 0 ? (
            <div className="text-center">
              <div className="text-5xl mb-4">🎯</div>
              <p className="text-gray-400 text-sm mb-4">No slides yet</p>
              <button
                onClick={() => setShowAddPanel(true)}
                className="bg-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium"
              >
                + Add first slide
              </button>
            </div>
          ) : currentSlide ? (
            <div className={`${slideTypeColors[currentSlide.type]} rounded-2xl p-12 w-full max-w-2xl min-h-72 flex flex-col justify-center shadow-sm`}>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">{slideTypeIcons[currentSlide.type]}</span>
                <span className="text-xs uppercase font-medium text-gray-400">{currentSlide.type}</span>
                <span className="ml-auto text-xs text-gray-400">⏱ {currentSlide.settings?.timer}s</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">{currentSlide.question}</h2>
              {currentSlide.type === 'mcq' && currentSlide.options?.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {currentSlide.options.map((opt, i) => (
                    <div key={i} className="bg-white rounded-xl px-4 py-3 text-sm text-gray-600 border border-gray-100">
                      {opt}
                    </div>
                  ))}
                </div>
              )}
              {currentSlide.type === 'wordcloud' && (
                <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-400 border border-gray-100 text-center">
                  Audience will type their responses → word cloud appears
                </div>
              )}
              {currentSlide.type === 'opentext' && (
                <div className="bg-white rounded-xl px-4 py-3 text-sm text-gray-400 border border-gray-100 text-center">
                  Audience will type open-ended responses
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Right — Add/Edit slide panel */}
        {showAddPanel && (
          <div className="w-72 border-l border-gray-100 overflow-y-auto py-6 px-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-medium text-gray-800">
                {editingSlide ? 'Edit slide' : 'New slide'}
              </h3>
              <button
                onClick={() => { setShowAddPanel(false); setEditingSlide(null); }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={editingSlide ? updateSlide : addSlide} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Slide type</label>
                <div className="grid grid-cols-3 gap-2">
                  {['mcq', 'wordcloud', 'opentext'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`py-2 rounded-lg text-xs font-medium border transition ${
                        type === t
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 text-gray-500 hover:border-purple-300'
                      }`}
                    >
                      {slideTypeIcons[t]} {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Question</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400 resize-none"
                  rows={3}
                  placeholder="Type your question..."
                  required
                />
              </div>

              {type === 'mcq' && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Options</label>
                  {options.map((opt, i) => (
                    <input
                      key={i}
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const updated = [...options];
                        updated[i] = e.target.value;
                        setOptions(updated);
                      }}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400 mb-2"
                      placeholder={`Option ${i + 1}`}
                    />
                  ))}
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-500 mb-1">Timer (seconds)</label>
                <input
                  type="number"
                  value={timer}
                  onChange={(e) => setTimer(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
                  min={10}
                  max={300}
                />
              </div>

              <button
                type="submit"
                disabled={adding}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
              >
                {adding ? 'Saving...' : editingSlide ? 'Update slide' : '+ Add slide'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;