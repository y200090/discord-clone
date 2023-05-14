import { Box, Flex, IconButton, Input, Icon, Text, Tooltip, Heading, Image } from '@chakra-ui/react'
import { css } from '@emotion/react'
import React, { useEffect, useRef, useState } from 'react'
import { BiHash } from 'react-icons/bi'
import { MdPeopleAlt, MdPersonAddAlt1 } from 'react-icons/md'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useParams } from 'react-router-dom'
import { AtSignIcon } from '@chakra-ui/icons'
import { useGetMessagesQuery } from '../redux/apis/messageApi'
import { socket } from '../socket'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../redux/slices/userSlice'
import { MessageBox } from '../components'
import { ActiveSideBar, InviteDirectMessageForm, SendMessage } from '../features'
import { selectParticipatingChannels } from '../redux/slices/channelSlice'
import { FaLock } from 'react-icons/fa'
import { NoChannel } from '../assets'

const Chat = () => {
  const { serverId, channelId } = useParams();
  const currentUser = useSelector(selectCurrentUser);
  const participatingChannels = useSelector(selectParticipatingChannels);
  console.log('参加チャンネル：', participatingChannels);
  console.log('カレントユーザー：', currentUser)

  const currentChannel = participatingChannels?.filter((channel) => {
    return channel?._id == channelId;
  });

  let friend = [];
  if (currentChannel[0]?.directMessage) {
    friend = currentChannel[0]?.allowedUsers?.filter((user) => {
      return user?._id != currentUser?._id;
    });
    console.log(friend)
  }
  console.log('チャンネル情報：', currentChannel[0]);

  const { data } = useGetMessagesQuery(channelId, {
    skip: !channelId
  });
  const messages = data?.messages;
  console.log(messages);
  const messageRef = useRef();
  const [ unreadMessageIds, setUnreadMessageIds ] = useState([]);
  const [ isSideBarOpen, setIsSideBarOpen ] = useState('');
  const [ isModalOpen, setIsModalOpen ] = useState('');

  useEffect(() => {
    if (currentUser) {
      socket.emit('join_room', {channelId, currentUser});
    }
    
    return () => {
      if (currentUser) {
        socket.emit('leave_room', {channelId, currentUser});
      }
    }
  }, [channelId, currentUser]);

  useEffect(() => {
    let unreadMessages = [];
    if (messages?.length) {
      unreadMessages = messages?.filter((message) => {
        let readUserIds = message?.readUsers?.map((user) => {
          return user._id;
        });
        return !readUserIds.includes(currentUser?._id);
      });
      setUnreadMessageIds(
        unreadMessages?.map((message) => (message?._id))
      );
      if (unreadMessages?.length) {
        console.log('未読メッセージ：', unreadMessages);
        socket.emit('read_messages', {
          currentChannel: currentChannel[0],
          currentUser,
          unreadMessages
        });
      }
    }

    return () => {
      if (unreadMessages?.length) {
        console.log('=====================\n新規メッセージ', unreadMessages);
        socket.emit('clear_unreadMessages', {
          currentUser, 
          unreadMessages
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
    if (prevDate === postDate && array[index - 1]?.sender?._id === array[index]?.sender?._id && array[index]?.type !== 'アナウンス') {
      dateFlag = !dateFlag;
    }

    return [ timeFlag, dateFlag, postTime ];
  };

  if (!channelId && serverId) {
    const parentServerIds = participatingChannels?.map((channel) => {
      return channel?.parentServer?._id;
    });
    if (parentServerIds?.includes(serverId)) {
      return (
        <>
          <Flex align='center' justify='center' direction='column' h='100%' w='100%' bg='#1e1f22'>
            <Image src={NoChannel} h='222px' w='272px' flex='0 1 auto' mb='40px' />
            <Text flex='0 1 auto' fontSize='17px' lineHeight='22px' fontWeight='600' color='#949ba4'>
              テキストチャンネルがありません
            </Text>
          </Flex>
        </>
      );
    }
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
          {/* <IconButton aria-label='hamburger-menu'
            icon={<GiHamburgerMenu size={20} />} size={20}
            bg='transparent' color='#f3f4f5' m='0 12px'
            _hover={{ bg: 'transparent' }}
            display='none'
          /> */}

          <Flex align='center' position='relative'>
            {currentChannel[0]?.directMessage
              ? currentChannel[0]?.category === 'ダイレクトメッセージ'
                ? <AtSignIcon boxSize='21px' flex='0 0 auto' m='0 9px' color='#80848e' />
                : <Icon as={MdPeopleAlt} boxSize='24px' flex='0 0 auto' m='0 8px' color='#80848e' />
              : (
                <>
                  <Icon as={BiHash} boxSize={'28px'} flex='0 0 auto' m='0 8px' color='#80848e' />
                  {currentChannel[0]?.privateChannel && (
                    <Icon as={FaLock} boxSize='8px'
                      position='absolute' top='3px' left='24px' 
                      color='#80848e' bg='#313338' outline='2px solid #313338'
                    />
                  )}
                </>
              )
            }
          </Flex>
          <Heading minW='auto' color='#f3f4f5' mr='8px'
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
          {currentChannel[0]?.directMessage && 
            currentChannel[0]?.category === 'ダイレクトメッセージ' && 
              (friend[0]?.online
                ? (
                  <Tooltip label='オンライン'
                    hasArrow placement='bottom'
                    p='6px 10px' borderRadius='4px'
                    bg='#111214' color='#e0e1e5'
                  >
                    <Box h='10px' w='10px' borderRadius='100%' bg='#23a55a' />
                  </Tooltip>
                )
                : (
                  <Tooltip label='オフライン'
                    hasArrow placement='bottom'
                    p='6px 10px' borderRadius='4px'
                    bg='#111214' color='#e0e1e5'
                  >
                    <Box position='relative' h='10px' w='10px' borderRadius='100%' bg='#80848e'>
                      <Box position='absolute' top='50%' left='50%' transform='translate(-50%, -50%)' h='5px' w='5px' borderRadius='100%' bg='#313338' />
                    </Box>
                  </Tooltip>
                )
              )
          }
        </Flex>
        
        <Flex flex='0 0 auto' align='center'>
          {currentChannel[0]?.category === 'グループダイレクトメッセージ' &&
            <>
              <Tooltip label='DMにフレンドを追加'
                hasArrow placement='bottom'
                p='6px 10px' borderRadius='4px'
                bg='#111214' color='#e0e1e5'
              >
                <IconButton aria-label='DMにフレンドを追加'
                  icon={<MdPersonAddAlt1 size={24} />} size={24}
                  bg='transparent' m='0 8px' 
                  color={
                    isModalOpen === 'DMにフレンドを追加' ? '#fff' : '#b8b9bf'
                  }
                  _hover={{ 
                    bg: 'transparent', 
                    color: isModalOpen ? '#b8b9bf' : '#e0e1e5' 
                  }}
                  onClick={(e) => setIsModalOpen(
                    isModalOpen ? '' : e.currentTarget.ariaLabel
                  )}
                />
              </Tooltip>
            </>
          }
          {currentChannel[0]?.category !== 'ダイレクトメッセージ' &&
            <>
              <Tooltip label='メンバーリストを表示'
                hasArrow placement='bottom'
                p='6px 10px' borderRadius='4px'
                bg='#111214' color='#e0e1e5'
              >
                <IconButton aria-label='メンバーリストを表示'
                  icon={<MdPeopleAlt size={24} />} size={24}
                  bg='transparent' m='0 8px' 
                  color={
                    isSideBarOpen === 'メンバーリストを表示' ? '#fff' : '#b8b9bf'
                  }
                  _hover={{ 
                    bg: 'transparent', 
                    color: isSideBarOpen ? '#b8b9bf' : '#e0e1e5' 
                  }}
                  onClick={(e) => setIsSideBarOpen(
                    isSideBarOpen ? '' : e.currentTarget.ariaLabel
                  )}
                />
              </Tooltip>
            </>
          }

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
                // let unreadFlag = unreadMessageIds?.includes(message?._id);
                let unreadFlag = unreadMessageIds[0] == message?._id;

                return (
                  <Box as={'li'} ref={messageRef} key={message?._id} 
                    pb='1.0625rem' mt={dateFlag && '-1.0625rem'} 
                    position='relative' listStyleType='none'
                  >
                    {timeFlag
                      ? (
                        <Flex align='center' justify='center' 
                          position='relative' zIndex='1' cursor='default'
                          color='#989aa2' m='0 0.875rem 1.0625rem 1rem' 
                          fontSize='12px' lineHeight='13px' fontWeight='600'
                        >
                          <Text p='2px 4px' bg='#313338'
                            {...(unreadFlag && {color: '#f23f42'})}
                          >
                            {postTime}
                          </Text>
                          {unreadFlag && 
                            <Box position='absolute' h='1px' w='100%' bg={unreadFlag ? '#f23f42' : '#3f4147'} zIndex='-1'>
                              <Flex align='center'
                                position='absolute' top='-6px' right='0'
                                h='13px' pr='4px' borderRadius='0 4px 4px 0' borderLeft='none' bg='#f23f42'
                              >
                                <Box position='absolute' top='0' right='100%' h='0px' w='0px' borderStyle='solid' borderWidth='0 0 6px 8px' borderColor='transparent transparent #f23f42 transparent' />
                                <Box position='absolute' bottom='0' right='100%' h='0px' w='0px' borderStyle='solid' borderWidth='0 8px 6px 0' borderColor='transparent #f23f42 transparent transparent' />
                                <Text pl='1px' color='#fff'
                                  fontSize='10px' lineHeight='9px' fontWeight='700'
                                >
                                  新規
                                </Text>
                              </Flex>
                            </Box>
                          }
                        </Flex>
                      )
                      : unreadFlag && !dateFlag && (
                        <Box position='absolute' top='-9px' h='1px' w='100%' p='0 0.875rem 0 1rem'>
                          <Box h='100%' w='100%' bg='#f23f42' />
                          <Flex align='center'
                            position='absolute' top='-6px' right='0.875rem'
                            h='13px' pr='4px' borderRadius='0 4px 4px 0' borderLeft='none' bg='#f23f42' 
                          >
                            <Box position='absolute' top='0' right='100%' h='0px' w='0px' borderStyle='solid' borderWidth='0 0 6px 8px' borderColor='transparent transparent #f23f42 transparent' />
                            <Box position='absolute' bottom='0' right='100%' h='0px' w='0px' borderStyle='solid' borderWidth='0 8px 6px 0' borderColor='transparent #f23f42 transparent transparent' />
                            <Text pl='1px' color='#fff'
                              fontSize='10px' lineHeight='9px' fontWeight='700'
                            >
                              新規
                            </Text>
                          </Flex>
                        </Box>
                      )
                    }

                    {dateFlag && unreadFlag &&
                      <Box position='relative' h='1px' w='100%' m='4px 0' p='0 0.875rem 0 1rem'>
                        <Box h='100%' w='100%' bg='#f23f42' />
                        <Flex align='center'
                          position='absolute' top='-6px' right='0.875rem'
                          h='13px' pr='4px' borderRadius='0 4px 4px 0' borderLeft='none' bg='#f23f42' 
                        >
                          <Box position='absolute' top='0' right='100%' h='0px' w='0px' borderStyle='solid' borderWidth='0 0 6px 8px' borderColor='transparent transparent #f23f42 transparent' />
                          <Box position='absolute' bottom='0' right='100%' h='0px' w='0px' borderStyle='solid' borderWidth='0 8px 6px 0' borderColor='transparent #f23f42 transparent transparent' />
                          <Text pl='1px' color='#fff'
                            fontSize='10px' lineHeight='9px' fontWeight='700'
                          >
                            新規
                          </Text>
                        </Flex>
                      </Box>
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
            <SendMessage 
              currentChannel={currentChannel[0]} 
              friend={friend[0]}
            />
          </Box>
        </Flex>

        <InviteDirectMessageForm 
          isOpen={isModalOpen === 'DMにフレンドを追加'}
          onClose={() => setIsModalOpen('')}
          currentChannel={currentChannel[0]}
        />

        <ActiveSideBar 
          isOpen={isSideBarOpen === 'メンバーリストを表示'}
          header={`メンバー—${currentChannel[0]?.allowedUsers?.length}`}
          members={currentChannel[0]?.allowedUsers}
          owner={currentChannel[0]?.parentServer?.owner}
        />
      </Flex>
    </>
  )
}

export default Chat