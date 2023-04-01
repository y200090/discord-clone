import { Box, Flex, IconButton, Icon, Text, Tooltip, HStack, useDisclosure } from '@chakra-ui/react'
import { css } from '@emotion/react'
import React, { useEffect, useState } from 'react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { MdAdd, MdKeyboardArrowDown } from 'react-icons/md'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import ChannelLink from '../ChannelLink'
import { useGetServerInfoQuery } from '../../redux/apis/serverApi'
import CreateChannel from '../../features/CreateChannel'
import StatusPanel from '../StatusPanel'

const Server = () => {
  const { serverId, channelId } = useParams();
  const { 
    data: serverInfo,
    isSuccess
  } = useGetServerInfoQuery(serverId);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ isOpenTextChannel, setIsOpenTextChannel ] = useState(true);
  const [ isOpenVoiceChannel, setIsOpenVoiceChannel ] = useState(true);

  const rest = {
    isOpen: isOpen,
    onClose: onClose,
    serverId: serverId,
  };

  useEffect(() => {
    if (!channelId) {
      if (serverInfo) {
        navigate(`${serverInfo?.ownedChannels[0]}`);
      }
    }
  }, [channelId, serverInfo]);

  return (
    <>
      <Flex direction='column' flex='0 0 auto' w='240px' bg='#2b2d31'>
        <Flex as={'nav'} direction='column' w='100%' flex='1 1 auto'>
          <Flex flex='0 0 auto'
            h='48px' w='100%' p='12px 14px 12px 16px'
            boxShadow='
              0 1px 0 #1f2023, 
              0 1.5px 0 #232528, 
              0 2px 0 #282a2e
            '
            zIndex='10' cursor='pointer'
            _hover={{ bg: '#35373c' }}
          >
            <HStack h='24px' w='100%' align='center'>
              <Text flex='1 1 0%' color='#f3f4f5'
                fontSize='16px'  lineHeight='20px'  fontWeight='600' 
                overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'
              >
                {serverInfo?.title}
              </Text>
              <Icon as={MdKeyboardArrowDown} boxSize='22px' color='#cdced0' />
            </HStack>
          </Flex>

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
              <Flex as={'li'} position='relative' w='100%' pl='12px' mb='2px'>
                <Flex align='center' justify='space-between'
                  w='100%' color='#989aa2'
                  _hover={{
                    '.menuIcon, .menuTitle': {
                      color: '#e0e1e5'
                    }
                  }}
                  cursor='pointer'
                  onClick={() => setIsOpenTextChannel((prevState) => !prevState)}
                >
                  <ChevronDownIcon className='menuIcon' boxSize={'14px'}
                    position='absolute' left='-5px' 
                    transition='transform 0.25s ease'
                    {...(!isOpenTextChannel && {transform: 'rotate(-90deg)'})}
                  />
                  <Text className='menuTitle' flex='1 1 auto' 
                    overflow='hidden' textOverflow='ellipsis' whiteSpace='nowrap'
                    fontSize='12px' lineHeight='16px' fontWeight='600'
                  >
                    テキストチャンネル
                  </Text>

                  <Tooltip label='チャンネルを作成'
                    hasArrow placement='top'
                    bg='#111214' color='#e0e1e5'
                  >
                    <IconButton aria-label='create-channel'
                      icon={<MdAdd size={22} />} size={'22'}
                      mr='6px' flex='0 0 auto' bg='transparent'
                      _hover={{ color: '#e0e1e5', bg: 'transparent' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpen();
                      }}
                    />
                  </Tooltip>
                </Flex>
              </Flex>

              {isSuccess && 
                serverInfo?.ownedChannels?.map((channel) => {
                  if (channel.category === 'テキストチャンネル') {
                    return (
                      <ChannelLink 
                        key={channel._id}
                        toURL={`/${serverId}/${channel._id}`}
                        channelName={channel.title}
                        category={channel.category}
                        isOpen={isOpenTextChannel}
                      />
                    )
                  }
                })
              }
            </Box>

            <Box as={'ul'} w='100%' pt='16px'>
              <Flex as={'li'} position='relative' w='100%' pl='12px' mb='2px'>
                <Flex align='center' justify='space-between'
                  w='100%' color='#989aa2'
                  _hover={{
                    '.menuIcon, .menuTitle': {
                      color: '#e0e1e5'
                    }
                  }}
                  cursor='pointer'
                  onClick={() => setIsOpenVoiceChannel((prevState) => !prevState)}
                >
                  <ChevronDownIcon className='menuIcon' boxSize={'14px'}
                    position='absolute' left='-5px'
                    transition='transform 0.25s ease'
                    {...(!isOpenVoiceChannel && {transform: 'rotate(-90deg)'})}
                  />
                  <Text className='menuTitle' flex='1 1 auto' 
                    overflow='hidden' textOverflow='ellipsis' whiteSpace='nowrap'
                    fontSize='12px' lineHeight='16px' fontWeight='600'
                  >
                    ボイスチャンネル
                  </Text>

                  <Tooltip label='チャンネルを作成' hasArrow
                    placement='top' bg='#111214' color='#e0e1e5'
                  >
                    <IconButton aria-label='チャンネル作成' className='createChannel'
                      icon={<MdAdd size={22} />} size={'22'}
                      flex='0 0 auto' mr='6px' bg='transparent'
                      _hover={{ color: '#e0e1e5', bg: 'transparent' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpen();
                      }}
                    />
                  </Tooltip>
                </Flex>
              </Flex>

              {isSuccess && serverInfo?.ownedChannels?.map((channel) => {
                if (channel.category === 'ボイスチャンネル') {
                  return (
                    <ChannelLink 
                      key={channel._id}
                      toURL={`/${serverId}/${channel._id}`}
                      channelName={channel.title}
                      category={channel.category}
                      isOpen={isOpenVoiceChannel}
                    />
                  )
                }
              })}
            </Box>
          </Box>
        </Flex>

        <StatusPanel />
      </Flex>

      <Flex as={'main'} direction='column' position='relative' overflow='hidden' h='100%' w='100%' bg='#313338'>
        <Outlet />
      </Flex>

      <CreateChannel {...rest} />
    </>
  )
}

export default Server