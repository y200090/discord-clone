import { Box, Button, Flex, Link as ChakraLink, Grid, Heading, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useGetInvitationInfoQuery } from '../redux/apis/invitationApi';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/slices/userSlice';
import { useJoinServerMutation } from '../redux/apis/serverApi';

const InvitationLink = ({ message }) => {
  const invitationLink = message?.body?.replace(import.meta.env.VITE_API_URL + '/server/join/', '');
  const { data } = useGetInvitationInfoQuery(invitationLink, {
    skip: !invitationLink,
  });
  const server = data?.targetServer;
  const onlines = server?.members?.filter((member) => {
    return member?.online;
  });
  const memberIds = server?.members?.map((member) => {
    return member?._id;
  });
  const [ JoinServer, { isLoading } ] = useJoinServerMutation();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);

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
  
  return (
    <>
      <Box w='auto'>
        <ChakraLink as={RouterLink} isExternal to={message.body} color='#00a8fc'>
          {message.body}
        </ChakraLink>

        <Grid p='0.125rem 0' w='auto' cursor='default'
          gridAutoFlow='row' gridRowGap='0.25rem' 
          gridTemplateColumns='repeat(auto-fill, minmax(100%, 1fr))' 
        >
          <Flex direction='column' alignSelf='start' justifySelf='start'
            minW='160px' maxW='432px' w='100%' p='16px' 
            borderRadius='4px' bg='#2b2d31'
          >
            <Text color='#b5bac1' mb='12px'
              fontSize='12px' lineHeight='16px' fontWeight='700'
              overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'
            >
              {message?.sender?._id == currentUser?._id
                ? 'サーバーへの招待を送信しました'
                : 'サーバーに参加するよう招待されました'
              }
            </Text>
            <Flex flexFlow='row wrap' gap='16px'>
              <Flex flex='1000 0 auto' align='center' maxW='100%' gap='16px'>
                <Image src={server?.photoURL} boxSize='50px' 
                  flex='0 0 auto' bg='#313338' borderRadius='16px'
                />

                <Flex direction='column' 
                  align='stretch' justify='center'
                  flex='1 1 auto' flexWrap='nowrap' minW='1px' 
                >
                  <Heading as={'h3'} mb='2px' color='#f2f3f5'
                    fontSize='16px' lineHeight='20px' fontWeight='600'
                    overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'
                  >
                    {server?.title}
                  </Heading>
                  <Flex columnGap='12px'>
                    <Flex align='center' display={!onlines?.length ? 'none' : 'flex'}>
                      <Box h='8px' w='8px' mr='4px' borderRadius='100%' bg='#23a559' />
                      <Text as={'span'} color='#b5bac1'
                        fontSize='14px' lineHeight='16px' fontWeight='400'
                      >
                        {onlines?.length}人がオンライン
                      </Text>
                    </Flex>
                    <Flex align='center'>
                      <Box h='8px' w='8px' mr='4px' borderRadius='100%' bg='#80848e' />
                        <Text color='#b5bac1'
                          fontSize='14px' lineHeight='16px' fontWeight='400'
                        >
                        {server?.members?.length}人
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
              <Button flex='1 0 auto'
                h='40px' w='auto' p='2px 16px'
                bg='#248046' borderRadius='3px' color='#fff'
                fontSize='14px' fontWeight='500' lineHeight='20px'
                _hover={{ bg: '#1a6334' }}
                onClick={handleReceiveInvitation}
                isLoading={isLoading}
                isDisabled={memberIds?.includes(currentUser?._id)}
              >
                {memberIds?.includes(currentUser?._id)
                  ? '参加しました'
                  : '参加'
                }
              </Button>
            </Flex>
          </Flex>
        </Grid>
      </Box>
    </>
  )
}

export default InvitationLink