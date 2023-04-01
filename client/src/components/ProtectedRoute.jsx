import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGetCurrentUserQuery } from '../redux/apis/userApi';
import { selectCurrentUser, setCredential } from '../redux/slices/authSlice';
import Loading from './Loading';

const ProtectedRoute = () => {
  const location = useLocation();
  const { 
    data,
    isSuccess, 
    isError, 
    isLoading, 
    isFetching, 
    error,
    refetch
  } = useGetCurrentUserQuery({
    refetchOnFocus: true, 
    refetchOnReconnect: true,
  });
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(setCredential({...data}));
    }
  }, [dispatch, data]);

  if (isSuccess || Object.keys(currentUser).length) {
    return <Outlet />

  } else if (isError) {
    console.log(error)
    return <Navigate to='/login' state={{ referrer: location.pathname}} replace />
  }
};

export default ProtectedRoute
