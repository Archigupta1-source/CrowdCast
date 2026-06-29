import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket from '../hooks/useWebSocket';

const AudienceResponse = () => {
  const { code } = useParams();
  const [currentSlide, setCurrentSlide] = useState(null);
  const [selected, setSelected] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [text, setText] = useState('');

  const participantId = `user_${Math.random().toString(36).slice(2, 9)}`;

  const { sendMessage } = useWebSocket((message) => {
    if (message.type === 'slide:change') {
      setCurrentSlide(message.slide);
      setSelected('');
      setSubmitted(false);
      setResults(null);
      setText('');
    }
    if (message.type === 'results:update') {
      setResults(message);
    }
  });

  useEffect(() => {
  setTimeout(() => {
    console.log("SENDING JOIN");

    sendMessage({
      type: 'session:join',
      code,
      role: 'audience'
    });
  }, 2000);
}, []);

  const submitAnswer = () => {
    const answer = currentSlide.type === 'mcq' ? selected : text;
    if (!answer) return;

    sendMessage({
      type: 'answer:submit',
      code,
      slideId: currentSlide._id,
      answer,
      participantId
    });
    setSubmitted(true);
  };

  if (!currentSlide) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Waiting for presenter...</h2>
          <p className="text-gray-400 text-sm">Room code: <span className="font-mono font-semibold text-purple-600">{code}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-xs bg-purple-50 text-purple-600 font-medium px-3 py-1 rounded-full uppercase">
            {currentSlide.type}
          </span>
          <span className="text-xs text-gray-400 font-mono">#{code}</span>
        </div>

        {/* Question */}
        <h2 className="text-xl font-semibold text-gray-900 mb-8">
          {currentSlide.question}
        </h2>

        {!submitted ? (
          <>
            {/* MCQ Options */}
            {currentSlide.type === 'mcq' && (
              <div className="space-y-3 mb-8">
                {currentSlide.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(opt)}
                    className={`w-full text-left px-5 py-4 rounded-xl border transition font-medium text-sm ${
                      selected === opt
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 text-gray-700 hover:border-purple-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Open Text / Word Cloud */}
            {(currentSlide.type === 'opentext' || currentSlide.type === 'wordcloud') && (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 resize-none mb-8"
                rows={4}
                placeholder="Type your answer..."
              />
            )}

            <button
              onClick={submitAnswer}
              disabled={currentSlide.type === 'mcq' ? !selected : !text}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium transition disabled:opacity-50"
            >
              Submit answer
            </button>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Answer submitted!</h3>
            <p className="text-gray-400 text-sm">Waiting for results...</p>

            {results && (
              <div className="mt-8 text-left">
                <p className="text-xs text-gray-400 mb-4 text-center">{results.totalVotes} total votes</p>
                {Object.entries(results.results).map(([answer, count]) => (
                  <div key={answer} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{answer}</span>
                      <span className="text-gray-400">{Math.round((count / results.totalVotes) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.round((count / results.totalVotes) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudienceResponse;