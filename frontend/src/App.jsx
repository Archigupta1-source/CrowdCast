import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import PresenterView from './pages/PresenterView';
import AudienceJoin from './pages/AudienceJoin';
import AudienceResponse from './pages/AudienceResponse';
import Results from './pages/Results';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/join" element={<AudienceJoin />} />
        <Route path="/session/:code" element={<AudienceResponse />} />

        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/editor/:id" element={
          <ProtectedRoute><Editor /></ProtectedRoute>
        } />
        <Route path="/present/:id" element={
          <ProtectedRoute><PresenterView /></ProtectedRoute>
        } />
        <Route path="/results/:id" element={
          <ProtectedRoute><Results /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;