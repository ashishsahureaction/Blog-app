import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ? <Outlet /> : <Navigate to='/sign-in' />;
}



//const { currentUser } = useSelector((state) => state.user);:  useSelector hook to extract the currentUser object from the Redux store. 
//Redux store has a slice named user, and currentUser is a property of that slice.