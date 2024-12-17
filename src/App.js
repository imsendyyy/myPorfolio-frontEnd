import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import ProfileAdmin from './components/Admin/pages/ProfileAdmin';
import SkillsAdmin from './components/Admin/pages/SkillsAdmin';
import ExperianceAdmin from './components/Admin/pages/ExperianceAdmin';
import ProjectAdmin from './components/Admin/pages/ProjectAdmin';
import TestimonialsAdmin from './components/Admin/pages/TestimonialsAdmin';
import PrivateRoute from './components/auth/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import BlogAdmin from './components/Admin/pages/BlogAdmin';
import WebLayout from './components/WebContent/WebLayout';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<WebLayout />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route index element={<Navigate to="admin-myprofile" replace />} />
            <Route path="admin-skills" element={<SkillsAdmin />} />
            <Route path="admin-myprofile" element={<ProfileAdmin />} />
            <Route path="admin-experiance" element={<ExperianceAdmin />} />
            <Route path="admin-project" element={<ProjectAdmin />} />
            <Route path="admin-testimonials" element={<TestimonialsAdmin />} />
            <Route path="admin-blogs" element={<BlogAdmin />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;



