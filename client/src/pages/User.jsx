import { Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Loading, NavBar } from '../components'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '../redux/slices/authSlice'
import { useGetCurrentUserQuery } from '../redux/apis/userApi'
import { socket } from '../socket'

const User = () => {
  const location = useLocation();
  // const dispatch = useDispatch();
  const {
    data,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetCurrentUserQuery({}, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true, 
    refetchOnReconnect: true,
    pollingInterval: 300000,
  });
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    socket.on('new_notices', (message) => {
      console.log(message);
      refetch();
    });

    return () => {
      socket.off('new_notices');
    }
  }, [socket]);

  // useEffect(() => {
  //   socket.on('update_user', (message) => {
  //     console.log(message);
  //     refetch();
  //   });

  //   socket.on('notify', (message) => {
  //     console.log(message);
  //     refetch();
  //   });
    
  //   return () => {
  //     socket.off('update_user');
  //     socket.off('notify');
  //   }
  // }, [socket]);

  if (isLoading) {
    return <Loading />
    
  } else if (isSuccess && currentUser) {
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
    
  } else if (isError) {
    return <Navigate to='/login' state={{ referrer: location.pathname }} replace />
  }
}

export default User