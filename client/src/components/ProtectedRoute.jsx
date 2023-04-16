import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loading from './Loading';
import { selectCredential } from '../redux/slices/authSlice';
import { useGetCredentialQuery } from '../redux/apis/authApi';
import { useCookies } from 'react-cookie';

const ProtectedRoute = () => {
  const location = useLocation();
  // const [ cookies ] = useCookies(['logged_in']);
  const {
    isLoading, 
    isFetching, 
    isSuccess, 
    isError,
    error
  } = useGetCredentialQuery({}, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    pollingInterval: 180000
  });
  const credential = useSelector(selectCredential);

  if (isLoading || isFetching) return <Loading />;
  else if (isSuccess && credential) return <Outlet />;
  else if (isError) {
    console.log('============\nトークン切れです。\n============');
    console.log(error);
    console.log(location);
    return (
      <Navigate to='/login' state={{ referrer: location.pathname}} replace />
    );
  }
};

export default ProtectedRoute
