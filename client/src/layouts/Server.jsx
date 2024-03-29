import { Box, Flex, IconButton, Icon, Text, Tooltip, HStack, Popover, PopoverTrigger, PopoverContent, Button } from '@chakra-ui/react'
import { css } from '@emotion/react'
import React, { useEffect, useState } from 'react'
import { ChevronDownIcon, SettingsIcon } from '@chakra-ui/icons'
import { MdAdd, MdKeyboardArrowDown, MdPersonAddAlt1 } from 'react-icons/md'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { AiFillPlusCircle } from 'react-icons/ai'
import { IoClose } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../redux/slices/userSlice'
import { ChannelLink, StatusPanel } from '../components'
import { CreateChannelForm, CreateInvitationForm, DeleteServer, Member, ServerOverview } from '../features'
import { selectJoinedServers } from '../redux/slices/serverSlice'
import { selectParticipatingChannels } from '../redux/slices/channelSlice'
import Settings from './Settings'

const Server = () => {
  const { serverId, channelId } = useParams();
  const currentUser = useSelector(selectCurrentUser);
  const joinedServers = useSelector(selectJoinedServers);
  const currentServer = joinedServers?.filter((server) => {
    return server?._id == serverId;
  });
  console.log('カレントサーバー: ', currentServer[0]);
  // const ownedChannelIds = currentServer[0]?.ownedChannels?.map((channel) => {
  //   return channel?._id;
  // });
  const participatingChannels = useSelector(selectParticipatingChannels);
  const ownedChannels = participatingChannels?.filter((channel) => {
    // return ownedChannelIds?.includes(channel?._id);
    let flag = currentServer[0]?.ownedChannels?.findIndex((item) => {
      return item?._id === channel?._id;
    });
    if (flag > -1) return true;
    else return false;
  });
  const navigate = useNavigate();
  const [ isModalOpen, setIsModalOpen ] = useState('');
  const [ arisingFrom, setArisingFrom ] = useState('');
  const [ isTextChannelOpen, setIsTextChannelOpen ] = useState(true);
  const [ isVoiceChannelOpen, setIsVoiceChannelOpen ] = useState(true);

  const createChannelFormRest = {
    isOpen: isModalOpen === 'createChannel',
    onClose: () => setIsModalOpen(''),
    arisingFrom: arisingFrom,
    server: currentServer[0],
    currentUserId: currentUser?._id,
  };
  const createInvitationFormRest = {
    isOpen: isModalOpen === 'createInvitationForm',
    onClose: () => setIsModalOpen(''),
    channelName: currentServer[0]?.length ? currentServer[0]?.ownedChannels[0]?.title : '一般',
    category: 'テキストチャンネル',
    server: currentServer[0],
  };
  const serverSettingsRest = {
    isOpen: isModalOpen === 'serverSettings',
    onClose: () => setIsModalOpen(''),
    type: 'サーバー設定',
    tabItems: {
      [`${currentServer[0]?.title}`]: {
        '概要': <ServerOverview key='概要' server={currentServer[0]} />,
      },
      'ユーザー管理': {
        'メンバー': <Member key='メンバー' server={currentServer[0]} />,
      }
    },
    DeleteServer: <DeleteServer server={currentServer[0]} />,
  };

  useEffect(() => {
    if (!channelId) {
      if (currentServer[0]?.length) {
        if (currentServer[0].ownedChannels[0]?.category == 'テキストチャンネル') {
          navigate(`${currentServer[0]?.ownedChannels[0]}`);
        }
      }
    }
  }, [channelId, currentServer]);

  return (
    <>
      <Flex direction='column' flex='0 0 auto' w='240px' bg='#2b2d31'>
        <Flex as={'nav'} direction='column' w='100%' flex='1 1 auto'>
          <Popover>
            <PopoverTrigger>
              <Button flex='0 0 auto' tabIndex={-1}
                h='48px' w='100%' p='12px 14px 12px 16px' 
                bg='transparent' borderRadius='0'
                boxShadow='
                  0 1px 0 #1f2023, 
                  0 1.5px 0 #232528, 
                  0 2px 0 #282a2e
                '
                zIndex='100' cursor='pointer'
                _hover={{ bg: '#35373c' }}
                css={css`
                  &[aria-expanded=true] {
                    background-color: #35373c;
                    div {
                      svg:first-of-type {
                        display: none;
                      }
                      svg:last-of-type {
                        display: block;
                      }
                    }
                  }
                  &[aria-expanded=false] {
                    div {
                      svg:last-of-type {
                        display: none;
                      }
                    }
                  }
                `}
              >
                <HStack h='24px' w='100%' align='center'>
                  <Text flex='1 1 0%' color='#f3f4f5'
                    fontSize='16px'  lineHeight='20px'  fontWeight='600' 
                    overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis' textAlign='start'
                  >
                    {currentServer[0]?.title}
                  </Text>
                  <Icon as={MdKeyboardArrowDown} boxSize='22px' color='#cdced0' />
                  <Icon as={IoClose} boxSize='20px' color='#cdced0' transform='translateX(-1px)' />
                </HStack>
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              h='auto' maxH='calc(100vh - 32px)' w='220px' p='6px 8px'
              bg='#111214' border='none' borderRadius='4px'
              zIndex={1000}
              css={css`
                &:focus-visible {
                  outline: none;
                  box-shadow: none;
                }
              `}
            >
              <Button justifyContent='space-between'
                h='auto' minH='32px' p='6px 8px' m='2px 0' 
                bg='transparent' color='#949cf7' borderRadius='2px'
                _hover={{ bg: '#4752c4', color: '#f6f6fc' }}
                onClick={() => setIsModalOpen('createInvitationForm')}
              >
                <Text fontSize='14px' fontWeight='500' lineHeight='18px'>
                  友達を招待
                </Text>
                <Icon as={MdPersonAddAlt1} boxSize='18px' ml='8px' />
              </Button>
              {currentServer[0]?.owner?._id == currentUser?._id &&
                <Button justifyContent='space-between'
                  h='auto' minH='32px' p='6px 8px' m='2px 0' 
                  bg='transparent' color='#b5bac1' borderRadius='2px'
                  _hover={{ bg: '#4752c4', color: '#f6f6fc' }}
                  onClick={() => setIsModalOpen('serverSettings')}
                >
                  <Text fontSize='14px' fontWeight='500' lineHeight='18px'>
                    サーバー設定
                  </Text>
                  <SettingsIcon boxSize='18px' p='1px' />
                </Button>
              }
              <Button justifyContent='space-between'
                h='auto' minH='32px' p='6px 8px' m='2px 0' 
                bg='transparent' color='#b5bac1' borderRadius='2px'
                _hover={{ bg: '#4752c4', color: '#f6f6fc' }}
                onClick={() => {
                  setIsModalOpen('createChannel');
                  setArisingFrom('');
                }}
              >
                <Text fontSize='14px' fontWeight='500' lineHeight='18px'>
                  チャンネルを作成
                </Text>
                <Icon as={AiFillPlusCircle} boxSize='18px' ml='8px' />
              </Button>
            </PopoverContent>
          </Popover>

          <Box flex='1 1 auto' w='100%' p='0 0 0 8px' overflow='scroll'
            css={css`
              &::-webkit-scrollbar {
                  height: 100%;
                  width: 8px;
                }
                &::-webkit-scrollbar-thumb {
                  background-color: transparent;
                  border-radius: 100px;
                  border: 2px solid transparent;
                  background-clip: content-box;
                }
              &:hover {
                &::-webkit-scrollbar-thumb {
                  background-color: #1a1b1e;
                }
              }
            `}
          >
            <Box as={'ul'} w='100%' pt='16px'>
              <Flex as={'li'} position='relative' minH='22px' w='100%' pl='12px' mb='2px'>
                <Flex align='center' justify='space-between'
                  w='100%' color='#989aa2'
                  _hover={{
                    '.menuIcon, .menuTitle': {
                      color: '#e0e1e5'
                    }
                  }}
                  cursor='pointer'
                  onClick={() => setIsTextChannelOpen((prevState) => !prevState)}
                >
                  <ChevronDownIcon className='menuIcon' boxSize={'14px'}
                    position='absolute' left='-5px' 
                    transition='transform 0.25s ease'
                    {...(!isTextChannelOpen && {transform: 'rotate(-90deg)'})}
                  />
                  <Text className='menuTitle' flex='1 1 auto' 
                    overflow='hidden' textOverflow='ellipsis' whiteSpace='nowrap'
                    fontSize='12px' lineHeight='16px' fontWeight='600'
                  >
                    テキストチャンネル
                  </Text>

                  {currentServer[0]?.owner?._id === currentUser?._id &&
                    <Tooltip label='チャンネルを作成'
                      hasArrow placement='top'
                      p='6px 10px' borderRadius='4px'
                      bg='#111214' color='#e0e1e5'
                    >
                      <IconButton aria-label='create-channel'
                        icon={<MdAdd size={22} />} size={'22'}
                        mr='6px' flex='0 0 auto' bg='transparent'
                        _hover={{ color: '#e0e1e5', bg: 'transparent' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsModalOpen('createChannel');
                          setArisingFrom('テキストチャンネル内');
                        }}
                      />
                    </Tooltip>
                  }
                </Flex>
              </Flex>

              {ownedChannels?.map((channel) => {
                if (channel?.category === 'テキストチャンネル') {
                  const allowedUserIds = channel?.allowedUsers?.map((user) => {
                    return user._id;
                  });

                  if (allowedUserIds.includes(currentUser?._id)) {
                    return (
                      <ChannelLink key={channel?._id}
                        toURL={`/${serverId}/${channel?._id}`}
                        {...(channel?.privateChannel &&
                          {privateChannel: true}
                        )}
                        isAccordionOpen={isTextChannelOpen}
                        server={currentServer[0]}
                        channel={channel}
                        currentUser={currentUser}
                      />
                    )
                  }
                }
              })}
            </Box>

            <Box as={'ul'} w='100%' pt='16px'>
              <Flex as={'li'} position='relative' minH='22px' w='100%' pl='12px' mb='2px'>
                <Flex align='center' justify='space-between'
                  w='100%' color='#989aa2'
                  _hover={{
                    '.menuIcon, .menuTitle': {
                      color: '#e0e1e5'
                    }
                  }}
                  cursor='pointer'
                  onClick={() => setIsVoiceChannelOpen((prevState) => !prevState)}
                >
                  <ChevronDownIcon className='menuIcon' boxSize={'14px'}
                    position='absolute' left='-5px'
                    transition='transform 0.25s ease'
                    {...(!isVoiceChannelOpen && {transform: 'rotate(-90deg)'})}
                  />
                  <Text className='menuTitle' flex='1 1 auto' 
                    overflow='hidden' textOverflow='ellipsis' whiteSpace='nowrap'
                    fontSize='12px' lineHeight='16px' fontWeight='600'
                  >
                    ボイスチャンネル
                  </Text>

                  {currentServer[0]?.owner?._id === currentUser?._id &&
                    <Tooltip label='チャンネルを作成' 
                      hasArrow placement='top' 
                      p='6px 10px' borderRadius='4px'
                      bg='#111214' color='#e0e1e5'
                    >
                      <IconButton aria-label='チャンネル作成'
                        icon={<MdAdd size={22} />} size={'22'}
                        flex='0 0 auto' mr='6px' bg='transparent'
                        _hover={{ color: '#e0e1e5', bg: 'transparent' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsModalOpen('createChannel');
                          setArisingFrom('ボイスチャンネル内');
                        }}
                      />
                    </Tooltip>
                  }
                </Flex>
              </Flex>

              {ownedChannels?.map((channel) => {
                if (channel?.category === 'ボイスチャンネル') {
                  return (
                    <ChannelLink key={channel?._id}
                      toURL={`/${serverId}/${channel?._id}`}
                      isAccordionOpen={isVoiceChannelOpen}
                      server={currentServer[0]}
                      channel={channel}
                      currentUser={currentUser}
                    />
                  )
                }
              })}
            </Box>
          </Box>
        </Flex>

        <StatusPanel currentUser={currentUser} />
      </Flex>

      <Flex direction='column' position='relative' overflow='hidden' h='100%' w='100%' bg='#313338'>
        <Outlet />
      </Flex>

      <CreateChannelForm {...createChannelFormRest} />
      <CreateInvitationForm {...createInvitationFormRest} />
      <Settings {...serverSettingsRest} />
    </>
  )
}

export default Server