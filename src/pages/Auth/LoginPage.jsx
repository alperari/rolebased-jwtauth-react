// Create me a login page
// Use the Login component from the components folder

import React from 'react';
import { LoginCard } from '../../components/Auth/LoginCard';

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoginCard></LoginCard>
    </div>
  );
};

export default LoginPage;
