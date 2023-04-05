// Create me a login page
// Use the Login component from the components folder

import React from 'react';
import { LoginCard } from '../../components/Auth/LoginCard';

const LoginPage = () => {
  return (
    <div className="flex flex-col  items-center mt-24">
      <LoginCard></LoginCard>
    </div>
  );
};

export default LoginPage;
