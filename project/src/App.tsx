import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import Resources from './pages/Resources';
import Games from './pages/Games';
import Profile from './pages/Profile';
import Chatbot from './pages/Chatbot';
import Exercises from './pages/Exercises';
import WellnessAdvisor from './pages/wellness-advisor';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import { AuthProvider } from './context/AuthContext';
import { UserDataProvider } from './context/UserDataContext';
import GuessMyMood from './pages/GuessMyMood';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserDataProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="assessment" element={<PrivateRoute><Assessment /></PrivateRoute>} />
                <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="journal" element={<PrivateRoute><Journal /></PrivateRoute>} />
                <Route path="resources" element={<PrivateRoute><Resources /></PrivateRoute>} />
                <Route path="wellness-advisor" element={<PrivateRoute><WellnessAdvisor /></PrivateRoute>} />
                <Route path="games" element={<PrivateRoute><Games /></PrivateRoute>} />
                <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="chatbot" element={<PrivateRoute><Chatbot /></PrivateRoute>} />
                <Route path="exercises" element={<PrivateRoute><Exercises /></PrivateRoute>} />
                <Route path="guess-my-mood" element={<PrivateRoute><GuessMyMood /></PrivateRoute>} />
              </Route>
            </Routes>
          </Router>
        </UserDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;