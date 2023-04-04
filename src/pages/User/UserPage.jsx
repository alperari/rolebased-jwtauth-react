import React, { useState } from 'react';

import { UserCard } from '../../components/User/UserCard';
import { useUserContext } from '../../hooks/useUserContext';
import { useNavigate } from 'react-router-dom';

const UserPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <UserCard />
    </div>
  );
};

export default UserPage;
