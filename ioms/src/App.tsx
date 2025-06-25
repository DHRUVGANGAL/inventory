import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SignupPage from './pages/Signup';
import SigninPage from './pages/Signin';
import Navbar from './Components/Navbar'



const App = () => {
  return (
    <AuthProvider>
      
      <Router>
       
        <div className="min-h-screen bg-gray-100  transition-colors duration-200">
        <Navbar/>
          <Routes>
            
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signin" element={<SigninPage />} />
            
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;