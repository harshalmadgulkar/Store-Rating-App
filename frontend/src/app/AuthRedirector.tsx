import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppSelector } from './hooks'; // Adjust path

const AuthRedirector: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated && user) {
      // You could add role-specific initial dashboard redirects here if needed,
      // but for your current model (all go to /dashboard), this is fine.
      navigate('/dashboard', { replace: true });
    } else {
      // If not authenticated, ensure they stay on or go to the login page (which is at '/')
      // This is mostly for clarity; if '/' is Login, they're already there.
      // navigate('/', { replace: true }); // No need to navigate if already at '/'
    }
  }, [isAuthenticated, user, navigate]);

  // Render nothing or a small loading indicator while redirecting
  return null; // Or <div>Loading...</div>
};

export default AuthRedirector;