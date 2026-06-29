import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Spline from '@splinetool/react-spline';

const words = [
  { text: 'Interactive', size: 'text-3xl', color: 'text-purple-500', rotate: '-rotate-6', top: '10%', left: '20%' },
  { text: 'Fun', size: 'text-5xl', color: 'text-green-500', rotate: 'rotate-3', top: '25%', left: '45%' },
  { text: 'Engaging', size: 'text-2xl', color: 'text-yellow-500', rotate: '-rotate-3', top: '45%', left: '10%' },
  { text: 'Live', size: 'text-4xl', color: 'text-pink-500', rotate: 'rotate-6', top: '15%', left: '65%' },
  { text: 'Bold', size: 'text-3xl', color: 'text-blue-500', rotate: '-rotate-12', top: '60%', left: '55%' },
  { text: 'Innovative', size: 'text-2xl', color: 'text-orange-400', rotate: 'rotate-2', top: '70%', left: '20%' },
  { text: 'Real-time', size: 'text-xl', color: 'text-teal-500', rotate: '-rotate-3', top: '80%', left: '60%' },
  { text: 'Inspiring', size: 'text-2xl', color: 'text-indigo-500', rotate: '-rotate-6', top: '55%', left: '35%' },
  { text: 'Polls', size: 'text-xl', color: 'text-purple-400', rotate: 'rotate-3', top: '85%', left: '30%' },
  { text: 'Inclusive', size: 'text-lg', color: 'text-red-400', rotate: 'rotate-6', top: '35%', left: '75%' },
];

const Landing = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
          else {
          entry.target.classList.remove('animate-in'); // yeh add karo
        }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-block bg-purple-50 text-purple-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            ✨ Real-time audience engagement
          </div>
          <h1 className="text-5xl font-semibold text-gray-900 leading-tight mb-6">
            Give your audience
            <br />
            <span className="text-purple-600">an active role</span>
          </h1>
          <ul className="space-y-3 mb-10">
            {[
              'Live Polls, Word Clouds & Open Text slides',
              'Audience joins with a 6-digit code — no app needed',
              'See results update in real-time as votes come in',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-gray-500 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
          <div className="flex gap-4">
            <Link to="/signup" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-medium transition shadow-sm">
              Start for free
            </Link>
            <Link to="/join" className="border border-gray-200 hover:border-purple-300 text-gray-700 px-8 py-3 rounded-xl font-medium transition">
              Join a session →
            </Link>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden" style={{ height: '500px' }}>
          <Spline scene="https://prod.spline.design/aJTpvsq2BB5aJ3tG/scene.splinecode" />
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-purple-50 py-10 scroll-animate">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {[
            { num: '10M+', label: 'Responses collected' },
            { num: '500K+', label: 'Sessions created' },
            { num: '190+', label: 'Countries reached' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-semibold text-purple-700">{s.num}</div>
              <div className="text-purple-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-12 scroll-animate">
            Everything you need
          </h2>
          <div className="grid grid-cols-3 gap-8">
            {[
              { icon: '⚡', title: 'Real-time results', desc: 'See votes update live as your audience responds.', bg: 'bg-yellow-50', delay: 'delay-1' },
              { icon: '🎯', title: 'Multiple slide types', desc: 'MCQ, Word Cloud, and Open Text — all in one place.', bg: 'bg-purple-50', delay: 'delay-2' },
              { icon: '📱', title: 'No app needed', desc: 'Audience joins with a 6-digit code — works on any device.', bg: 'bg-green-50', delay: 'delay-3' },
            ].map((f) => (
              <div key={f.title} className={`bg-white p-6 rounded-2xl border border-gray-100 hover:border-purple-200 transition scroll-animate scroll-animate-${f.delay}`}>
                <div className={`${f.bg} w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4`}>
                  {f.icon}
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-12 scroll-animate">How it works</h2>
          <div className="grid grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create', desc: 'Build your presentation with slides, polls and questions.' },
              { step: '02', title: 'Share', desc: 'Share your 6-digit code with your audience.' },
              { step: '03', title: 'Engage', desc: 'Watch responses come in live on your screen.' },
            ].map((s, i) => (
              <div key={s.step} className={`text-center scroll-animate scroll-animate-delay-${i + 1}`}>
                <div className="text-4xl font-semibold text-purple-100 mb-3">{s.step}</div>
                <h3 className="font-medium text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-purple-50 py-20 scroll-animate">
        <div className="max-w-2xl mx-auto text-center px-6">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Ready to modernize your presentations?
          </h2>
          <p className="text-gray-500 mb-8 text-sm">
            Join thousands of presenters making their sessions more interactive.
          </p>
          <Link
            to="/signup"
            className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-3 rounded-xl font-medium transition"
          >
            Get started for free →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-4 gap-8 mb-10">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Crowd<span className="text-purple-600">Cast</span>
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Real-time interactive presentations for modern teams and educators.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Features</h4>
              <ul className="space-y-2">
                {['Live Polls', 'Word Cloud', 'Open Text', 'Real-time Results', 'AI Generator'].map(f => (
                  <li key={f} className="text-sm text-gray-400">{f}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Use Cases</h4>
              <ul className="space-y-2">
                {['Education', 'Team Meetings', 'Workshops', 'Conferences', 'Training'].map(u => (
                  <li key={u} className="text-sm text-gray-400">{u}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Get Started</h4>
              <ul className="space-y-2">
                <li><a href="/signup" className="text-sm text-gray-400 hover:text-purple-600 transition">Sign up free</a></li>
                <li><a href="/login" className="text-sm text-gray-400 hover:text-purple-600 transition">Log in</a></li>
                <li><a href="/join" className="text-sm text-gray-400 hover:text-purple-600 transition">Join a session</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-6 flex items-center justify-between">
            <p className="text-sm text-gray-400">© 2026 CrowdCast. Built with ❤️</p>
            <p className="text-sm text-gray-400">Made for placement project 🚀</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;