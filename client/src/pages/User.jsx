import { Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Loading, NavBar } from '../components'
import { useDispatch } from 'react-redux'
import { setCredential } from '../redux/slices/authSlice'
import { useGetCurrentUserQuery } from '../redux/apis/userApi'

const User = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    data: currentUser,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetCurrentUserQuery({
    refetchOnFocus: true, 
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (currentUser) {
      dispatch(setCredential({...currentUser}));
    }
  }, [dispatch, currentUser]);
  
  if (isLoading) {
    return <Loading />
    
  } else if (isError) {
    return <Navigate to='/login' state={{ referrer: location.pathname }} replace />
  }

  return (
    <>
      <Flex position='relative' h='100vh' w='100vw' overflow='hidden'>
        <NavBar />

        <Flex flexGrow='1' h='100%' w='100%'>
          <Outlet />
        </Flex>
      </Flex>
    </>
  )
}

export default User