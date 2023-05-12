import React, { useState, useEffect } from 'react';

import { UserCard } from '../../components/User/UserCard';
import { UserService } from '../../services/UserService';

import { useUserContext } from '../../hooks/useUserContext';
import { useNavigate } from 'react-router-dom';

const userLocal = JSON.parse(localStorage.getItem('user'));

const UserPage = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    const fetchedUser = await UserService.getUserById({
      id: userLocal._id,
    });

    setUser(fetchedUser);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div class="flex flex-col mx-32 my-24 items-center justify-center">
      {loading ? (
        <div class="flex flex-row justify-center items-center">Loading...</div>
      ) : (
        <UserCard user={user} />
      )}
    </div>
  );
};

export default UserPage;
