import { Avatar, Box, Flex, IconButton, Input, Icon, Text, Tooltip, Heading, Button } from '@chakra-ui/react'
import { css } from '@emotion/react'
import React, { useEffect, useRef, useState } from 'react'
import { BiHash } from 'react-icons/bi'
import { MdPeopleAlt } from 'react-icons/md'
import { GiHamburgerMenu } from 'react-icons/gi'
import SendMessage from './SendMessage'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import { useGetChannelInfoQuery } from '../redux/apis/channelApi'
import { AtSignIcon } from '@chakra-ui/icons'
import { useGetMessagesQuery } from '../redux/apis/messageApi'
import MessageBox from './MessageBox'
import { FaCrown, FaDiscord } from 'react-icons/fa'
import { socket } from '../socket'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../redux/slices/authSlice'

const Chat = () => {
  const { serverId, channelId } = useParams();
  const currentUser = useSelector(selectCurrentUser);
  // const { data: channelInfo } = useGetChannelInfoQuery(channelId);

  let channel;
  if (serverId) {
    const server = currentUser?.joinedServers?.filter((joinedServer) => {
      return joinedServer._id == serverId;
    });

    channel = server.ownedChannels.filter((ownedChannel) => {
      return ownedChannel._id == channelId;
    });

  } else {
    channel = currentUser?.setDirectMessages?.filter((setDirectMessage) => {
      return setDirectMessage._id == channelId;
    });
  }
  console.log('チャンネル情報：', channel[0]);

  const { 
    data: messages,
    isError,
    error,
    refetch
  } = useGetMessagesQuery(channelId);
  const messageRef = useRef();
  const location = useLocation();
  const [ isOpen, setIsOpen ] = useState('');

  useEffect(() => {
    socket.emit('join_room', {channelId, currentUser});
    // refetch();
    
    return () => {
      socket.emit('leave_room', {channelId, currentUser});
    }
  }, [channelId]);

  useEffect(() => {
    socket.on('sended_message', (newMessage) => {
      console.log(newMessage);
      refetch();
    });

    return () => {
      socket.off('sended_message');
    }
  }, [socket]);

  useEffect(() => {
    if (messages) {
      const unreadMessages = messages.filter((message) => {
        let readUserIds = message.readUsers.map((user) => {
          return user._id
        });
        return !readUserIds.includes(currentUser._id)
      });
      if (unreadMessages.length) {
        socket.emit('read_messages', {channelId, currentUserId: currentUser._id});
      }
    }
  }, [messages]);

  useEffect(() => {
    messageRef.current?.scrollIntoView(false);
  }, [messages]);

  if (isError) {
    console.log(error);
    return (
      <Navigate to='/login' state={{ referrer: location.pathname }} replace />
    )
  }
  
  return (
    <>
      <Flex as={'header'} align='center' position='relative' 
        flex='0 0 auto' h='48px' w='100%' p='0 8px'
        fontSize='16px' lineHeight='20px'
        boxShadow='
          0 1px 0 #2c2e33,
          0 1.5px 0 #2a2c31,
          0 2px 0 #2e3034
        '
        zIndex='1000'
      >
        <Flex flex='1 1 auto' align='center' overflow='hidden' cursor='default'>
          <IconButton aria-label='hamburger-menu'
            icon={<GiHamburgerMenu size={20} />} size={20}
            bg='transparent' color='#f3f4f5' m='0 12px'
            _hover={{ backgroundColor: 'transparent' }}
            display='none'
          />
          
          {channel[0]?.directMessage
            ? <AtSignIcon boxSize='21px' flex='0 0 auto' m='0 9px' color='#82858f' />
            : <Icon as={BiHash} boxSize={'28px'} flex='0 0 auto' m='0 8px' color='#82858f' />
          }
          <Heading minW='auto' color='#f3f4f5' 
            fontSize='16px' lineHeight='20px' fontWeight='600'
            overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'
          >
            {channel[0]?.title || channel[0]?.allowedUsers[1].displayName}
          </Heading>
        </Flex>
        
        <Flex flex='0 0 auto' align='center'>
          <Tooltip label='メンバーリストを表示'
            hasArrow placement='bottom'
            p='6px 10px' borderRadius='4px'
            bg='#111214' color='#e0e1e5'
          >
            <IconButton aria-label='メンバーリストを表示'
              icon={<MdPeopleAlt size={24} />} size={24}
              bg='transparent' m='0 8px' 
              color={isOpen === 'メンバーリストを表示' ? '#fff'  : '#b8b9bf'}
              _hover={{ bg: 'transparent', color: isOpen ? '#b8b9bf' : '#e0e1e5' }}
              onClick={(e) => setIsOpen(isOpen ? '' : e.currentTarget.ariaLabel)}
            />
          </Tooltip>

          <Box m='0 8px' z='100'>
            <Input type='text' id='message'
              h='24px' w='144px' p='2px 4px'
              border='none' outline='none'
              focusBorderColor='transparent'
              bg='#1e1f22' color='#f3f4f5'
              borderRadius='4px'
              fontSize='14px'
              placeholder='検索'
              transition='width 0.25s ease'
              css={css`
                &::placeholder {
                  padding-left: 4px;
                  color: #87898c;
                }
              `}
              _focus={{ width: '240px' }}
            />
          </Box>
        </Flex>
      </Flex>

      <Flex flex='1 1 auto' align='stretch' justify='stretch'
        position='relative' minH='0' minW='0'
      >
        <Flex as={'main'} flex='1 1 auto' direction='column' w='100%'>
          <Flex direction='column' flex='1 1 0' 
            position='relative' overflow='hidden scroll' z='0'
            css={css`
              &::-webkit-scrollbar {
                width: 16px;
              }
              &::-webkit-scrollbar-thumb {
                background-color: #1a1b1e;
                border-radius: 100px;
                border: 4px solid transparent;
                background-clip: content-box;
              }
              &::-webkit-scrollbar-track {
                background-color: #2b2d31;
                border-radius: 100px;
                border: 4px solid transparent;
                background-clip: content-box;
              }
            `}
          >
            <Box as={'ol'} listStyleType='none' pt='1.0625rem' m='auto 0 0'>
              {messages?.map((message, i, array) => {        
                const prevState = new Date(array[i-1]?.createdAt);
                const createdAt = new Date(array[i]?.createdAt);
                const prevTime = prevState.getFullYear() + '年' + (prevState.getMonth() + 1) + '月' + prevState.getDate() + '日';
                const postTime = createdAt.getFullYear() + '年' + (createdAt.getMonth() + 1) + '月' + createdAt.getDate() + '日';
                const prevDate = prevState.getHours() + ':' + prevState.getMinutes();
                const postDate = createdAt.getHours() + ':' + createdAt.getMinutes();
                let timeFlag = true;
                if (prevTime === postTime) {
                  timeFlag = !timeFlag;
                }
                let dateFlag = false;
                if (prevDate === postDate && array[i-1]?.sender?._id === array[i]?.sender?._id) {
                  dateFlag = !dateFlag;
                }

                return (
                  <Box as={'li'} ref={messageRef} key={message?._id} 
                    pb='1.0625rem' mt={dateFlag && '-1.0625rem'} listStyleType='none'
                  >
                    {timeFlag && 
                      <Flex align='center' justify='center' color='#989aa2'
                        position='relative' m='0 0 1.0625rem 1rem' zIndex='1'
                        fontSize='12px' lineHeight='13px' fontWeight='600'
                        cursor='default'
                      >
                        <Text p='2px 4px' bg='#313338'>
                          {postTime}
                        </Text>
                        <Box position='absolute' h='1px' w='100%' bg='#3f4147' zIndex='-1' />
                      </Flex>
                    }

                    <MessageBox message={message} {...(dateFlag && {dateFlag: true})} />
                  </Box>
                )
              })}
            </Box>
          </Flex>

          <Box flexShrink='0' p='0 16px'>
            <SendMessage />
          </Box>
        </Flex>

        <Flex h='100%' minW={isOpen ? '240px' : '0'} bg='#2b2d31'>
          <Box flex='0 0 auto' h='auto' w='100%' p='0 0 20px'
            display={isOpen ? 'block' : 'none'}
            css={css`
              scrollbar-width: none;
              -ms-overflow-style: none;
              &::-webkit-scrollbar {
                display: none;
              }
            `}
          >
            <Heading color='#949ba4'
              p='24px 8px 0 16px' h='40px' 
              fontSize='12px' fontWeight='600' lineHeight='16px'
              overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'
            >
              メンバー—{channel[0]?.parentServer?.members?.length}
            </Heading>
            <Box maxW='224px' m='0 8px' p='1px 0' borderRadius='4px'>
              {channel[0]?.parentServer?.members?.map((member) => (
                <Button key={member?._id} alignItems='center' justifyContent='start'
                  h='42px' w='100%' p='0 8px' 
                  bg='transparent' borderRadius='4px'
                  _hover={{ bg: '#35373c' }}
                >
                  <Avatar 
                    flex='0 0 auto' mr='12px'
                    boxSize='32px' bg={member?.color}
                    {...(member?.photoURL
                      ? {src: member?.photoURL}
                      : {icon: <FaDiscord />}
                    )}
                  />
                  <Flex flex='1 1 auto' align='center' justify='flex-start'>
                    <Text color='#949ba4' flex='0 1 auto'
                      fontSize='16px' fontWeight='400' lineHeight='20px'
                      overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'
                      >
                      {member?.displayName}
                    </Text>
                    {channel[0]?.parentServer?.owner._id == member?._id && 
                      <Icon as={FaCrown} boxSize='14px' 
                        flex='0 0 auto' ml='4px' color='#f0b132' 
                      />
                    }
                  </Flex>
                </Button>
              ))}
            </Box>
          </Box>
        </Flex>
      </Flex>
    </>
  )
}

export default Chat