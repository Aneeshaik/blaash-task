import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Home from './components/Home';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false); // Add loading state for auth check

  if(localStorage.getItem('token')){
    setIsAuthenticated(true);
  }

  // const checkAuthStatus = async () => {
  //   try {
  //     const response = await fetch('http://localhost:3000/check-auth', {
  //       method: 'GET',
  //       credentials: 'include',
  //     });
  //     const data = await response.json();
  //     setIsAuthenticated(data.isAuthenticated || false);
  //   } catch (error) {
  //     console.error('Error checking authentication:', error);
  //   } finally {
  //     setIsAuthChecked(true); // Set auth check to complete
  //   }
  // };

  // useEffect(() => {
  //   checkAuthStatus();
  // }, []);

  // if (!isAuthChecked) {
  //   // Show a loading state or placeholder while auth is being checked
  //   return <div>Loading...</div>;
  // }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />
         <Route
          path="/login"
          element={
              <Login />
          }
        />
         <Route
          path="/home"
          element={
              <Home />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
