// Create me a login page
// Use the Login component from the components folder

import React from 'react';
import { RegisterCard } from '../../components/Auth/RegisterCard';

const RegisterPage = () => {
  return (
    <div className="flex flex-col  items-center mt-24">
      <RegisterCard></RegisterCard>
    </div>
  );
};

export default RegisterPage;
