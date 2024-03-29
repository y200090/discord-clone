import { Avatar, Box, Button, Flex, Heading, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { MotionForm } from '../layouts'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useGetInvitationInfoQuery } from '../redux/apis/invitationApi'
import { FaDiscord } from 'react-icons/fa'
import { useCookies } from 'react-cookie'
import { useJoinServerMutation } from '../redux/apis/serverApi'
import { useSelector } from 'react-redux'
import { selectCredential } from '../redux/slices/authSlice'
import { useGetCredentialQuery } from '../redux/apis/authApi'
import { useGetCurrentUserQuery } from '../redux/apis/userApi'

const Invite = () => {
  const { invitationLink } = useParams();
  const { data: invitation } = useGetInvitationInfoQuery(invitationLink);
  const sender = invitation?.sender;
  const server = invitation?.targetServer;
  const onlines = server?.members?.filter((member) => {
    return member.online;
  });
  const [ cookies ] = useCookies(['logged_in']);
  
  const { isSuccess, isError } = useGetCredentialQuery({}, {
    // skip: !cookies.logged_in,
  });
  const credential = useSelector(selectCredential);
  const { data: currentUser } = useGetCurrentUserQuery(credential, {
    skip: !credential,
  });
  const [ JoinServer, {isLoading} ] = useJoinServerMutation();
  const location = useLocation();
  const navigate = useNavigate();

  const handleReceiveInvitation = async (e) => {
    e.preventDefault();

    try {
      await JoinServer({
        serverId: server?._id,
        currentUserId: currentUser?._id,
      }).unwrap();

      navigate(`/channels/${server?._id}/${server?.ownedChannels[0]?._id}`);
      
    } catch (err) {
      console.log(err);
    }
  };

  if (isError) {
    return (
      <Navigate to='/login' state={{ referrer: location.pathname }} />
    );

  } else if (isSuccess) {
    return (
      <>
        <MotionForm>
          <form onSubmit={handleReceiveInvitation}>
            <Box w='100%' textAlign='center' cursor='default'>
              <Avatar boxSize='80px' mb='24px'
                {...(sender?.photoURL
                  ? {src: sender?.photoURL}
                  : {
                    icon: <FaDiscord size='54px' />,
                    bg: sender?.color
                  }
                )}
              />

              <Text color='#b5bac1'
                fontSize='16px' fontWeight='400' lineHeight='20px'
              >
                {sender?.displayName}に招待されています
              </Text>

              <Heading as={'h1'} 
                display='flex' alignItems='center' justifyContent='center'
                mt='8px' color='#f2f3f5'
                fontSize='24px' fontWeight='600' lineHeight='30px'
              >
                <Avatar boxSize='30px' src={server?.photoURL} />
                <strong>{server?.title}</strong>
              </Heading>

              <Flex columnGap='16px' align='center' justify='center' mt='8px'>
                <Flex align='center'>
                  <Box h='10px' w='10px' mr='4px' borderRadius='100%' bg='#23a559' />
                  <Text as={'span'} color='#b5bac1'
                    fontSize='16px' lineHeight='18px' fontWeight='400'
                  >
                    {onlines?.length}人がオンライン
                  </Text>
                </Flex>
                <Flex align='center'>
                  <Box h='10px' w='10px' mr='4px' borderRadius='100%' bg='#b5bac1' />
                    <Text color='#b5bac1'
                      fontSize='16px' lineHeight='18px' fontWeight='400'
                    >
                    {server?.members?.length}人
                  </Text>
                </Flex>
              </Flex>
            </Box>

            <Box w='100%' mt='40px'>
              <Button type='submit' isLoading={isLoading}
                h='44px' minH='44px' w='100%' minW='130px'
                p='2px 16px' borderRadius='3px'
                bg='#5865f2' color='#fff'
                fontSize='16px' lineHeight='20px' fontWeight='500'
                _hover={{ bg: '#4752c4' }}
              >
                招待を受ける
              </Button>
            </Box>
          </form>
        </MotionForm>
      </>
    )
  }
}

export default Invite