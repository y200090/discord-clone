import { Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGetCurrentUserQuery } from '../redux/apis/userApi'
import { socket } from '../socket'
import { selectCredential } from '../redux/slices/authSlice'
import { NavBar } from '../layouts'

const User = () => {
  // const credential = useSelector(selectCredential);
  // const {
  //   data, 
  //   refetch,
  // } = useGetCurrentUserQuery(credential, {
  //   refetchOnFocus: true,
  //   refetchOnReconnect: true,
  // });

  // useEffect(() => {
  //   socket.connect();

  //   return () => {
  //     console.log('unmount!');
  //     socket.disconnect();
  //   }
  // }, []);

  // useEffect(() => {
  //   if (data) {
  //     socket.emit('online', data);
  //     console.log(data)
  //   }
  // }, [data]);

  // useEffect(() => {
  //   socket.on('new_notices', (message) => {
  //     console.log('==========\n', message, '\n==========');
  //     // refetch();
  //   });

  //   return () => {
  //     socket.off('new_notices');
  //   }
  // }, [socket]);

  return (
    <>
      <Flex position='relative' h='100vh' w='100vw' overflow='hidden'>
        <NavBar />

        <Flex flexGrow='1' h='100%' w='100%'>
          <Outlet />
        </Flex>
      </Flex>
    </>
  );
}

export default User