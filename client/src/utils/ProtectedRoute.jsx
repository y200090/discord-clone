import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGetCurrentUserQuery } from '../redux/apis/userApi';
import { selectCurrentUser } from '../redux/auth/selectors';
import { setCredential } from '../redux/auth/slices';

const ProtectedRoute = () => {
  const location = useLocation();
  const { data: currentUser, isSuccess, isError, isLoading } = useGetCurrentUserQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCredential({...currentUser}));
  }, [dispatch, currentUser]);

  if (isLoading) {
    return (
      <p>Loading...</p>
    )

  } else if (isSuccess || currentUser) {
    return <Outlet />

  } else if (isError) {
    return <Navigate to='/login' state={{ from: location}} replace />
  }

};

export default ProtectedRoute
