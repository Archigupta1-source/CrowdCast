import { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const templates = {
  'Check-ins & Icebreakers': [
    {
      title: 'Fun Meeting Icebreakers',
      slides: 5,
      emoji: '🎉',
      bg: 'bg-purple-50',
      data: [
        { type: 'wordcloud', question: 'Describe your current mood in one word!', options: [], settings: { timer: 60, anonymous: true, showResults: true } },
        { type: 'mcq', question: 'If last month was a theme park ride, which one would it be?', options: ['Roller coaster 🎢', 'Ferris wheel 🎡', 'Haunted house 👻', 'Merry-go-round 🎠'], settings: { timer: 30, anonymous: true, showResults: true } },
        { type: 'opentext', question: 'Share one fun thing you did this weekend!', options: [], settings: { timer: 60, anonymous: true, showResults: true } },
        { type: 'mcq', question: 'What is your spirit animal today?', options: ['Lion 🦁', 'Sloth 🦥', 'Dolphin 🐬', 'Eagle 🦅'], settings: { timer: 30, anonymous: true, showResults: true } },
        { type: 'wordcloud', question: 'What word describes our team best?', options: [], settings: { timer: 45, anonymous: true, showResults: true } },
      ]
    },
    {
      title: 'Weekly Check-in',
      slides: 4,
      emoji: '📋',
      bg: 'bg-blue-50',
      data: [
        { type: 'mcq', question: 'How are you feeling today?', options: ['Energized ⚡', 'Good 😊', 'Tired 😴', 'Stressed 😰'], settings: { timer: 30, anonymous: true, showResults: true } },
        { type: 'opentext', question: 'What is your main focus this week?', options: [], settings: { timer: 60, anonymous: true, showResults: true } },
        { type: 'mcq', question: 'Rate your energy level today', options: ['Very High 🚀', 'High ⬆️', 'Medium ➡️', 'Low ⬇️'], settings: { timer: 30, anonymous: true, showResults: true } },
        { type: 'wordcloud', question: 'What do you need most from the team this week?', options: [], settings: { timer: 45, anonymous: true, showResults: true } },
      ]
    },
    {
      title: 'Team Pulse Check',
      slides: 3,
      emoji: '💓',
      bg: 'bg-pink-50',
      data: [
        { type: 'mcq', question: 'How satisfied are you with your work-life balance?', options: ['Very satisfied 😄', 'Satisfied 🙂', 'Neutral 😐', 'Unsatisfied 😕'], settings: { timer: 30, anonymous: true, showResults: true } },
        { type: 'wordcloud', question: 'What one word describes our team culture?', options: [], settings: { timer: 45, anonymous: true, showResults: true } },
        { type: 'opentext', question: 'What would make your work life better?', options: [], settings: { timer: 60, anonymous: true, showResults: true } },
      ]
    },
  ],
  'Training & Evaluation': [
    {
      title: 'Knowledge Check',
      slides: 5,
      emoji: '🧠',
      bg: 'bg-yellow-50',
      data: [
        { type: 'mcq', question: 'What does API stand for?', options: ['Application Programming Interface', 'Applied Program Integration', 'Automated Process Interface', 'None of the above'], settings: { timer: 30, anonymous: true, showResults: true } },
        { type: 'mcq', question: 'Which of these is a JavaScript framework?', options: ['React', 'Django', 'Laravel', 'Flask'], settings: { timer: 30, anonymous: true, showResults: true } },
        { type: 'opentext', question: 'What is the most important thing you learned today?', options: [], settings: { timer: 60, anonymous: true, showResults: true } },
        { type: 'mcq', question: 'How confident do you feel about the topic?', options: ['Very confident 💪', 'Confident 👍', 'Somewhat 🤔', 'Need more help 🙋'], settings: { timer: 30, anonymous: true, showResults: true } },
        { type: 'wordcloud', question: 'What topic would you like to explore more?', options: [], settings: { timer: 45, anonymous: true, showResults: true } },
      ]
    },
    {
      title: 'Training Feedback',
      slides: 4,
      emoji: '📝',
      bg: 'bg-green-50',
      data: [
        { type: 'mcq', question: 'How would you rate this training session?', options: ['Excellent ⭐⭐⭐⭐⭐', 'Good ⭐⭐⭐⭐', 'Average ⭐⭐⭐', 'Poor ⭐'], settings: { timer: 30, anonymous: true, showResults: true } },
        { type: 'opentext', question: 'What was the most valuable part of this training?', options: [], settings: { timer: 60, anonymous: true, showResults: true } },
        { type: 'mcq', question: 'Will you apply what you learned today?', options: ['Definitely! 🚀', 'Probably 👍', 'Maybe 🤔', 'Not sure 😕'], settings: { timer: 30, anonymous: true, showResults: true } },
        { type: 'wordcloud', question: 'Describe this training in one word', options: [], settings: { timer: 45, anonymous: true, showResults: true } },
      ]
    },
  ],
  'Workshop & Brainstorming': [
    {
      title: 'Brainstorming Session',
      slides: 4,
      emoji: '💡',
      bg: 'bg-orange-50',
      data: [
        { type: 'wordcloud', question: 'What ideas come to mind for our new project?', options: [], settings: { timer: 90, anonymous: true, showResults: true } },
        { type: 'opentext', question: 'Describe your ideal solution to our problem', options: [], settings: { timer: 90, anonymous: true, showResults: true } },
        { type: 'mcq', question: 'Which approach should we prioritize?', options: ['Speed to market 🚀', 'Quality first 💎', 'Cost efficiency 💰', 'User experience 🎯'], settings: { timer: 30, anonymous: true, showResults: true } },
        { type: 'wordcloud', question: 'What is the biggest challenge we face?', options: [], settings: { timer: 60, anonymous: true, showResults: true } },
      ]
    },
    {
      title: 'Product Planning',
      slides: 5,
      emoji: '🗺️',
      bg: 'bg-teal-50',
      data: [
        { type: 'mcq', question: 'What should be our top priority for Q3?', options: ['New features 🆕', 'Bug fixes 🐛', 'Performance ⚡', 'UX improvements 🎨'], settings: { timer: 30, anonymous: true, showResults: true } },
        { type: 'wordcloud', question: 'What features do users ask for most?', options: [], settings: { timer: 60, anonymous: true, showResults: true } },
        { type: 'opentext', question: 'What is the one thing that would make our product 10x better?', options: [], settings: { timer: 90, anonymous: true, showResults: true } },
        { type: 'mcq', question: 'How long should our next sprint be?', options: ['1 week', '2 weeks', '3 weeks', '1 month'], settings: { timer: 30, anonymous: true, showResults: true } },
        { type: 'wordcloud', question: 'What does success look like for our team?', options: [], settings: { timer: 60, anonymous: true, showResults: true } },
      ]
    },
  ],
  'Feedback & Reflection': [
    {
      title: 'Meeting Pulse-Check',
      slides: 4,
      emoji: '📊',
      bg: 'bg-indigo-50',
      data: [
        { type: 'mcq', question: 'How productive was this meeting?', options: ['Very productive 🚀', 'Productive 👍', 'Somewhat 🤔', 'Not productive 👎'], settings: { timer: 30, anonymous: true, showResults: true } },
        { type: 'opentext', question: 'What could we do differently next time?', options: [], settings: { timer: 60, anonymous: true, showResults: true } },
        { type: 'mcq', question: 'Did we achieve the meeting goals?', options: ['Completely ✅', 'Mostly 🙂', 'Partially 🤏', 'Not really ❌'], settings: { timer: 30, anonymous: true, showResults: true } },
        { type: 'wordcloud', question: 'Describe this meeting in one word', options: [], settings: { timer: 45, anonymous: true, showResults: true } },
      ]
    },
    {
      title: 'Project Retrospective',
      slides: 5,
      emoji: '🔄',
      bg: 'bg-red-50',
      data: [
        { type: 'wordcloud', question: 'What went well in this project?', options: [], settings: { timer: 60, anonymous: true, showResults: true } },
        { type: 'wordcloud', question: 'What could we have done better?', options: [], settings: { timer: 60, anonymous: true, showResults: true } },
        { type: 'opentext', question: 'What is your biggest takeaway from this project?', options: [], settings: { timer: 90, anonymous: true, showResults: true } },
        { type: 'mcq', question: 'How would you rate team collaboration?', options: ['Excellent 🌟', 'Good 👍', 'Average 😐', 'Needs work 🔧'], settings: { timer: 30, anonymous: true, showResults: true } },
        { type: 'opentext', question: 'What would you do differently next time?', options: [], settings: { timer: 60, anonymous: true, showResults: true } },
      ]
    },
  ],
  'Quiz Night': [
    {
      title: 'General Knowledge Quiz',
      slides: 5,
      emoji: '🎯',
      bg: 'bg-purple-50',
      data: [
        { type: 'mcq', question: 'Which planet is closest to the Sun?', options: ['Mercury', 'Venus', 'Earth', 'Mars'], settings: { timer: 20, anonymous: true, showResults: true } },
        { type: 'mcq', question: 'What is the capital of Japan?', options: ['Beijing', 'Seoul', 'Tokyo', 'Bangkok'], settings: { timer: 20, anonymous: true, showResults: true } },
        { type: 'mcq', question: 'Who painted the Mona Lisa?', options: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Picasso'], settings: { timer: 20, anonymous: true, showResults: true } },
        { type: 'mcq', question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], settings: { timer: 20, anonymous: true, showResults: true } },
        { type: 'mcq', question: 'How many continents are there on Earth?', options: ['5', '6', '7', '8'], settings: { timer: 20, anonymous: true, showResults: true } },
      ]
    },
    {
      title: 'Tech Quiz',
      slides: 5,
      emoji: '💻',
      bg: 'bg-cyan-50',
      data: [
        { type: 'mcq', question: 'What does HTML stand for?', options: ['HyperText Markup Language', 'High Tech Modern Language', 'HyperText Modern Links', 'None of these'], settings: { timer: 20, anonymous: true, showResults: true } },
        { type: 'mcq', question: 'Which company created React?', options: ['Google', 'Microsoft', 'Facebook', 'Apple'], settings: { timer: 20, anonymous: true, showResults: true } },
        { type: 'mcq', question: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Computer Style System', 'Creative Style Sheets', 'Colorful Style Syntax'], settings: { timer: 20, anonymous: true, showResults: true } },
        { type: 'mcq', question: 'Which language runs in the browser?', options: ['Python', 'Java', 'JavaScript', 'C++'], settings: { timer: 20, anonymous: true, showResults: true } },
        { type: 'mcq', question: 'What is MongoDB?', options: ['SQL Database', 'NoSQL Database', 'Programming Language', 'Web Framework'], settings: { timer: 20, anonymous: true, showResults: true } },
      ]
    },
  ],
};

const TemplatesModal = ({ onClose }) => {
  const [activeCategory, setActiveCategory] = useState('Check-ins & Icebreakers');
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();

  const useTemplate = async (template) => {
    setLoading(template.title);
    try {
      const presRes = await api.post('/presentations', { title: template.title });
      for (const slide of template.data) {
        await api.post(`/presentations/${presRes.data._id}/slides`, slide);
      }
      navigate(`/editor/${presRes.data._id}`);
      onClose();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">CrowdCast Templates</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 px-8 py-4 border-b border-gray-100 overflow-x-auto">
          {Object.keys(templates).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${
                activeCategory === cat
                  ? 'border-2 border-purple-600 text-purple-700'
                  : 'border border-gray-200 text-gray-500 hover:border-purple-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="overflow-y-auto p-8">
          <div className="grid grid-cols-3 gap-5">
            {templates[activeCategory].map((template) => (
              <div
                key={template.title}
                className="border border-gray-100 rounded-2xl overflow-hidden hover:border-purple-200 hover:shadow-md transition group cursor-pointer"
                onClick={() => useTemplate(template)}
              >
                {/* Preview */}
                <div className={`${template.bg} h-36 flex items-center justify-center`}>
                  <div className="text-center">
                    <div className="text-4xl mb-2">{template.emoji}</div>
                    <p className="text-xs text-gray-500 px-4 text-center line-clamp-2">
                      {template.data[0].question}
                    </p>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 text-sm mb-1">{template.title}</h3>
                  <p className="text-xs text-gray-400">{template.slides} slides</p>
                  <button
                    className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 rounded-lg transition"
                    disabled={loading === template.title}
                  >
                    {loading === template.title ? 'Creating...' : 'Use Template'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesModal;