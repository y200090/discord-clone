import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loading from './Loading';
import { selectCredential } from '../redux/slices/authSlice';
import { useGetCredentialQuery } from '../redux/apis/authApi';
import { useCookies } from 'react-cookie';
import { useGetCurrentUserQuery, useGetJoinedServersQuery } from '../redux/apis/userApi';
import { socket } from '../socket';
import { useGetFriendRequestsQuery } from '../redux/apis/friendApi';
import { setJoinedServers } from '../redux/slices/serverSlice';
import { setFriendRequests } from '../redux/slices/requestSlice';
import { setCurrentUser } from '../redux/slices/userSlice';
import { useGetParticipatingChannelsQuery } from '../redux/apis/channelApi';
import { setParticipatingChannels } from '../redux/slices/channelSlice';

const ProtectedRoute = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  // const [ cookies ] = useCookies(['logged_in']);
  const {
    isLoading: isLoadingByCredential, 
    isFetching: isFetchingByCredential, 
    isSuccess: isSuccessByCrednetial, 
    isError: isErrorByCredential,
    error: errorByCredential,
  } = useGetCredentialQuery({}, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    pollingInterval: 3600000
  });
  const credential = useSelector(selectCredential);

  const {
    data: currentUser, 
    isLoading: isLoadingByCurrentUser,
    isFetching: isFetchingByCurrentUser, 
    isSuccess: isSuccessByCurrentUser, 
    isError: isErrorByCurrentUser, 
    error: errorByCurrentUser,
  } = useGetCurrentUserQuery(credential, {
    skip: !credential,
  });

  useEffect(() => {
    if (currentUser) {
      dispatch(setCurrentUser(currentUser));
    }
  }, [currentUser]);

  const {
    data: joinedServers,
    isLoading: isLoadingByJoinedServers,
    isFetching: isFetchingByJoinedServers,
    isSuccess: isSuccessByJoinedServers,
    isError: isErrorByJoinedServers,
    error: errorByJoinedServers,
  } = useGetJoinedServersQuery(credential, {
    skip: !credential,
  });

  useEffect(() => {
    if (joinedServers) {
      dispatch(setJoinedServers(joinedServers));
    }
  }, [joinedServers]);

  const {
    data: participatingChannels,
    isLoading: isLoadingByParticipatingChannels,
    isFetching: isFetchingByParticipatingChannels,
    isSuccess: isSuccessByParticipatingChannels,
    isError: isErrorByParticipatingChannels,
    error: errorByParticipatingChannels,
  } = useGetParticipatingChannelsQuery(credential, {
    skip: !credential,
  });

  useEffect(() => {
    if (participatingChannels) {
      dispatch(setParticipatingChannels(participatingChannels));
    }
  }, [participatingChannels]);

  const {
    data: friendRequests,
    isLoading: isLoadingByFriendRequests,
    isFetching: isFetchingByFriendRequests,
    isSuccess: isSuccessByFriendRequests,
    isError: isErrorByFriendRequests,
    error: errorByFriendRequests,
  } = useGetFriendRequestsQuery(credential, {
    skip: !credential,
  });

  useEffect(() => {
    if (friendRequests) {
      dispatch(setFriendRequests(friendRequests));
    }
  }, [friendRequests]);

  let isLoadings = isLoadingByCredential || isLoadingByCurrentUser || isLoadingByJoinedServers || isLoadingByParticipatingChannels || isLoadingByFriendRequests;
  // let isFetchings = isFetchingByCredential || isFetchingByCurrentUser || isFetchingByJoinedServers || isFetchingByFriendRequests;
  let isSuccesses = isSuccessByCrednetial && isSuccessByCurrentUser && isSuccessByJoinedServers || isSuccessByParticipatingChannels || isSuccessByFriendRequests;
  let isErrors = isErrorByCredential || isErrorByCurrentUser || isErrorByJoinedServers || isErrorByParticipatingChannels || isErrorByFriendRequests;
  let errors = errorByCredential || errorByCurrentUser || errorByJoinedServers || errorByParticipatingChannels || errorByFriendRequests;
  
  if (isLoadings) return <Loading />;
  else if (isSuccesses) return <Outlet />;
  else if (isErrors) {
    console.log('============\nトークン切れです。\n============');
    console.log(errors);
    console.log(location);
    return (
      <Navigate to='/login' state={{ referrer: location.pathname}} replace />
    );
  }
};

export default ProtectedRoute
