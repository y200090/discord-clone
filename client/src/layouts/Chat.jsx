import { Box, Flex, IconButton, Input, Icon, Text, Tooltip, Heading } from '@chakra-ui/react'
import { css } from '@emotion/react'
import React, { useEffect, useRef, useState } from 'react'
import { BiHash } from 'react-icons/bi'
import { MdPeopleAlt } from 'react-icons/md'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useParams } from 'react-router-dom'
import { AtSignIcon } from '@chakra-ui/icons'
import { useGetMessagesQuery } from '../redux/apis/messageApi'
import { socket } from '../socket'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../redux/slices/userSlice'
import { MessageBox } from '../components'
import { ActiveSideBar, SendMessage } from '../features'
import { selectParticipatingChannels } from '../redux/slices/channelSlice'

const Chat = () => {
  const { channelId } = useParams();
  const currentUser = useSelector(selectCurrentUser);
  const participatingChannels = useSelector(selectParticipatingChannels);
  console.log('参加チャンネル：', participatingChannels);
  console.log('カレントユーザー：', currentUser)

  const currentChannel = participatingChannels?.filter((channel) => {
    return channel?._id == channelId;
  });

  let friend;
  if (currentChannel[0]?.directMessage) {
    friend = currentChannel[0]?.allowedUsers?.filter((user) => {
      return user?._id != currentUser?._id;
    });
    console.log(friend)
  }

  // let channel;
  // if (serverId) {
  //   const server = currentUser?.joinedServers?.filter((joinedServer) => {
  //     return joinedServer._id == serverId;
  //   });
  //   console.log('サーバー情報：', server);
  //   if (!server) channel = [];
  //   else if (server?.length) { 
  //     channel = server[0]?.ownedChannels?.filter((ownedChannel) => {
  //       return ownedChannel._id == channelId;
  //     });
  //     if (channel?.length) channel = channel[0];
  //   }

  // } else {
  //   channel = currentUser?.setDirectMessages?.filter((directMessage) => {
  //     return directMessage._id == channelId;
  //   });
  //   if (channel?.length) channel = channel[0];
  // }
  console.log('チャンネル情報：', currentChannel[0]);

  const { data } = useGetMessagesQuery(channelId);
  const messages = data?.messages;
  console.log(messages);
  const messageRef = useRef();
  const [ isOpen, setIsOpen ] = useState('');

  useEffect(() => {
    if (currentUser) {
      socket.emit('join_room', {
        channelId, 
        currentUser,
      });
    }
    
    return () => {
      if (currentUser) {
        socket.emit('leave_room', {
          channelId,
          currentUser,
        });
      }
    }
  }, [channelId, currentUser]);

  useEffect(() => {
    if (messages?.length) {
      const unreadMessages = messages?.filter((message) => {
        let readUserIds = message?.readUsers?.map((user) => {
          return user._id;
        });
        return !readUserIds.includes(currentUser?._id);
      });
      if (unreadMessages?.length) {
        console.log('未読メッセージ：', unreadMessages);
        socket.emit('read_messages', {
          currentChannel: currentChannel[0],
          currentUser,
        });
      }
    }
  }, [messages]);

  useEffect(() => {
    messageRef.current?.scrollIntoView(false);
  }, [messages]);

  const calculateTime = (index, array) => {
    const prevState = new Date(array[index - 1]?.createdAt);
    const createdAt = new Date(array[index]?.createdAt);
    const prevTime = prevState.getFullYear() + '年' 
      + (prevState.getMonth() + 1) + '月'
      + prevState.getDate() + '日';
    const postTime = createdAt.getFullYear() + '年'
      + (createdAt.getMonth() + 1) + '月'
      + createdAt.getDate() + '日';
    const prevDate = prevState.getHours() + ':' + prevState.getMinutes();
    const postDate = createdAt.getHours() + ':' + createdAt.getMinutes();
    let timeFlag = true;
    if (prevTime === postTime) timeFlag = !timeFlag;
    let dateFlag = false;
    if (prevDate === postDate && array[index - 1]?.sender?._id === array[index]?.sender?._id) {
      dateFlag = !dateFlag;
    }

    return [ timeFlag, dateFlag, postTime ];
  };
  
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
            _hover={{ bg: 'transparent' }}
            display='none'
          />
          
          {currentChannel[0]?.directMessage
            ? currentChannel[0]?.category === 'ダイレクトメッセージ'
              ? <AtSignIcon boxSize='21px' flex='0 0 auto' m='0 9px' color='#82858f' />
              : <Icon as={MdPeopleAlt} boxSize='24px' flex='0 0 auto' m='0 8px' color='#82858f' />
            : <Icon as={BiHash} boxSize={'28px'} flex='0 0 auto' m='0 8px' color='#82858f' />
          }
          <Heading minW='auto' color='#f3f4f5' 
            fontSize='16px' lineHeight='20px' fontWeight='600'
            overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'
          >
            {currentChannel[0]?.directMessage
              ? currentChannel[0]?.category === 'ダイレクトメッセージ'
                ? friend[0]?.displayName
                : currentChannel[0]?.title
              : currentChannel[0]?.title
            }
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
              color={
                isOpen === 'メンバーリストを表示' ? '#fff' : '#b8b9bf'
              }
              _hover={{ 
                bg: 'transparent', 
                color: isOpen ? '#b8b9bf' : '#e0e1e5' 
              }}
              onClick={(e) => setIsOpen(
                isOpen ? '' : e.currentTarget.ariaLabel
              )}
            />
          </Tooltip>

          <Box m='0 8px' z='100'>
            <Input type='text' id='message'
              h='24px' w='144px' p='2px 4px'
              border='none' outline='none'
              focusBorderColor='transparent'
              bg='#1e1f22' color='#f3f4f5' borderRadius='4px'
              fontSize='14px'
              transition='width 0.25s ease'
              placeholder='検索'
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
                let [ timeFlag, dateFlag, postTime ] = calculateTime(i, array);

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

                    <MessageBox 
                      message={message} 
                      {...(dateFlag && {dateFlag: true})} 
                    />
                  </Box>
                )
              })}
            </Box>
          </Flex>

          <Box flexShrink='0' p='0 16px'>
            <SendMessage />
          </Box>
        </Flex>

        <ActiveSideBar 
          isOpen={isOpen}
          header={`メンバー—${currentChannel[0]?.allowedUsers?.length}`}
          members={currentChannel[0]?.allowedUsers}
          owner={currentChannel[0]?.parentServer?.owner}
        />
      </Flex>
    </>
  )
}

export default Chat