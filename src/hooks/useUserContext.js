import { useContext } from 'react';
import { UserContext } from '../providers/UserProvider';

export const useUserContext = () => {
  return useContext(UserContext);
};
