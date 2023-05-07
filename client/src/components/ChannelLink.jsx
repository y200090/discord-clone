import { Text, Icon, Box, Tooltip, IconButton, Link as ChakraLink, ButtonGroup, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { BiHash } from 'react-icons/bi'
import { NavLink } from 'react-router-dom'
import { HiSpeakerWave } from 'react-icons/hi2'
import { MdPersonAddAlt1 } from 'react-icons/md'
import { LockIcon, SettingsIcon } from '@chakra-ui/icons'
import { CreateInvitationForm } from '../features'
import styled from '@emotion/styled'

const ChannelLink = (props) => {
  const { toURL, server, channel, currentUser, privateChannel, isAccordionOpen } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const channelName = channel?.title;
  const category = channel?.category;
  const notifications = channel?.notifications?.filter((notification) => {
    return notification.recipient === currentUser?._id;
  });

  const rest = {
    isOpen: isOpen,
    onClose: onClose,
    channelName: channelName,
    category: category,
    privateChannel: privateChannel && true,
    server: server,
  };
  
  return (
    <>
      <Box as={'li'} w='100%' listStyleType='none' position='relative'>
        <ChakraLink 
          {...(category == 'テキストチャンネル' && {as: NavLink})}
          {...(category == 'テキストチャンネル' && {to: '/channels' + toURL})}
          w='100%' p='5px 8px' m='1px 0'
          display='flex' alignItems='center'
          borderRadius='4px' color='#82858f'
          tabIndex='-1' zIndex='5'
          {...(!isAccordionOpen && {display: 'none'})}
          _hover={{
            bg: '#35373c',
            span: {
              'svg:last-of-type': {
                backgroundColor: '#35373c',
                outlineColor: '#35373c'
              }
            },
            p: {
              color: '#f3f4f5'
            },
            div: {
              visibility: 'visible'
            }
          }}
          _activeLink={{
            display: 'flex !important',
            bg: '#404249',
            span: {
              'svg:last-of-type': {
                backgroundColor: '#404249',
                outlineColor: '#404249'
              }
            },
            p: {
              color: '#f3f4f5'
            },
            div: {
              visibility: 'visible'
            }
          }}
        >
          {category === 'テキストチャンネル'
            ? (
              <Box as={'span'} h='24px' position='relative'>
                <Icon as={BiHash} boxSize={'24px'} mr='6px' />
                {privateChannel &&
                  <LockIcon boxSize='6px'
                    position='absolute' top='3px' left='15px' 
                    bg='#2b2d31' outline='2px solid #2b2d31'
                  />
                }
              </Box>
            )
            : <Icon as={HiSpeakerWave} boxSize={'22px'} mr='8px' />
          }
          
          <Text color={notifications?.length > 0 && '#f3f4f5'}
            fontSize='16px' lineHeight='20px' fontWeight='500'
            overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'
          >
            {channelName}
          </Text>

          <ButtonGroup m='0 1px 0 auto' visibility='hidden'>
            <Tooltip label='招待を作成'
              hasArrow placement='top'
              p='6px 10px' borderRadius='4px'
              bg='#111214' color='#e0e1e5'
            >
              <IconButton aria-label='招待を作成'
                icon={<MdPersonAddAlt1 size={16} />} size={16}
                bg='transparent' color='#b8b9bf' zIndex={5}
                _hover={{ bg: 'transparent', color: '#dcdde1' }}
                onClick={(e) => {
                  e.preventDefault();
                  onOpen();
                }}
              />
            </Tooltip>
            {server?.owner?._id == currentUser?._id &&
              <Tooltip label='チャンネルの編集'
                hasArrow placement='top'
                p='6px 10px' borderRadius='4px'
                bg='#111214' color='#e0e1e5'
              >
                <IconButton aria-label='チャンネルの編集'
                  icon={<SettingsIcon size={16} p='1.5px' />} size={16}
                  bg='transparent' color='#b8b9bf' ml='-4px'
                  _hover={{ bg: 'transparent', color: '#dcdde1' }}
                />
              </Tooltip>
            }
          </ButtonGroup>
          {notifications?.length > 0 && 
            <NotificationCounter>{notifications?.length}</NotificationCounter>
          }
        </ChakraLink>

        {notifications?.length > 0 && 
          <Box position='absolute' top='50%' left='-8px'
            transform='translateY(-50%)' h='8px' w='4px'
            bg='#f3f4f5' borderRadius='0 4px 4px 0'
          />
        }
      </Box>

      <CreateInvitationForm {...rest} />
    </>
  )
};

const NotificationCounter = styled.span`
  min-height: 16px;
  height: 16px;
  min-width: 16px;
  margin-left: 0.5rem;
  padding: 0 1px 1px 0;
  display: flex !important;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 12px;
  line-height: 16px;
  font-weight: 700;
  color: #fffff3;
  background-color: #f23f42;
`;

export default ChannelLink