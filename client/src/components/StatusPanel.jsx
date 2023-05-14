import { Avatar, Box, Flex, IconButton, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Tooltip, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import { MdKeyboardVoice } from 'react-icons/md';
import { BsHeadphones } from 'react-icons/bs';
import { css } from '@emotion/react';
import { FaDiscord } from 'react-icons/fa';
import { SettingsIcon } from '@chakra-ui/icons';
import Settings from '../layouts/Settings';
import { Logout, MyAccount, Profile } from '../features';

const StatusPanel = ({ currentUser }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ isCopyComplete, setIsCopyComplete ] = useState(false);
  const [ isMute, setIsMute ] = useState({
    microphone: true,
    speaker: true,
  });
  const rest = { 
    isOpen: isOpen, 
    onClose: onClose, 
    type: 'ユーザー設定',
    tabItems: {
      'ユーザー設定': {
        'マイアカウント': <MyAccount key='マイアカウント' currentUser={currentUser} />,
        'プロフィール': <Profile key='プロフィール' currentUser={currentUser} />,
      },
    },
    Logout: <Logout />,
  };

  const copyTextToClipboard = async () => {
    setIsCopyComplete((prevState) => !prevState);
    await navigator.clipboard.writeText(currentUser?.tag);
    setTimeout(() => {
      setIsCopyComplete((prevState) => !prevState);
    }, 1500);
  };
  
  return (
    <>
      <Box flex='0 0 auto' bg='#232428' zIndex={1}>
        <Flex align='center' h='52px' w='100%' p='0 8px' mb='1px'>
          <Popover placement='top'>
            <PopoverTrigger>
              <Flex align='center' flex='1 1 auto'
                minW='120px' pl='2px' m='0 8px 0 -2px'
                cursor='pointer'
                _hover={{ bg: '#3d3e45', borderRadius: '4px' }}
                onClick={copyTextToClipboard}
              >
                <Avatar boxSize='32px' flexShrink={0}
                  {...(currentUser?.photoURL 
                    ? {src: currentUser?.photoURL}
                    : {
                        icon: <FaDiscord />,
                        bg: currentUser?.color
                      }
                  )}
                />
                <Box flexGrow={1} p='4px 0 4px 8px' mr='4px'>
                  <Box fontSize='14px' lineHeight='18px' fontWeight='500' color='#f2f3f5'>
                    {currentUser?.displayName}
                  </Box>
                  <Box color='#acb0bc'
                    fontSize='12px' lineHeight='13px' fontWeight='400'
                    overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'
                  >
                    {currentUser?.tag?.replace(currentUser?.displayName, '')}
                  </Box>
                </Box>
              </Flex>
            </PopoverTrigger>
            <PopoverContent 
              w='inherit' bg='#23a559' borderRadius='4px' border='none'
              display={isCopyComplete ? 'block' : 'none'}
              css={css`
                &:focus-visible {
                  box-shadow: none;
                }
              `}
            >
              <PopoverArrow bg='#23a559' boxShadow='none' />
              <PopoverBody fontSize='14px' p='6px 10px' color='#fff' textAlign='center'>
                コピーされました！
              </PopoverBody>
            </PopoverContent>
          </Popover>

          <Flex flex='0 1 auto'>
            <Tooltip label={isMute.microphone ? 'マイクミュート解除' : 'マイクミュート'}
              hasArrow placement='top' closeOnClick={false}
              bg='#111214' color='#e0e1e5' p='5px 10px' borderRadius='4px'
            >
              <Box position='relative'>
                <IconButton aria-label='マイクミュート'
                  icon={<MdKeyboardVoice size='21px' />} size={'sm'}
                  color='#b5bac1' bg='transparent' borderRadius='4px'
                  _hover={{ 
                    bg: '#3d3e45',
                    '& + div': {
                      outlineColor: '#3d3e45'
                    }
                  }}
                  onClick={() => setIsMute(
                    (prevState) => ({...prevState, microphone: !prevState.microphone})
                  )}
                />
                <Box position='absolute' pointerEvents='none'
                  top='20%' left='50%' transform='rotate(45deg)'
                  h='70%' w='2px' bg='#f23f42'
                  borderRadius='12px' outline='2px solid #232428'
                  display={isMute.microphone ? 'block' : 'none'}
                />
              </Box>
            </Tooltip>
            <Tooltip label={isMute.speaker ? 'スピーカーミュート解除' : 'スピーカーミュート'}
              hasArrow placement='top' closeOnClick={false}
              bg='#111214' color='#e0e1e5' p='5px 10px' borderRadius='4px'
            >
              <Box position='relative'>
                <IconButton aria-label='スピーカーミュート'
                  icon={<BsHeadphones size='21px' />} size={'sm'}
                  color='#b5bac1' bg='transparent' borderRadius='4px'
                  _hover={{ 
                    bg: '#3d3e45',
                    '& + div': {
                      outlineColor: '#3d3e45'
                    }
                  }}
                  onClick={() => setIsMute(
                    (prevState) => ({...prevState, speaker: !prevState.speaker})
                  )}
                />
                <Box position='absolute' pointerEvents='none'
                  top='20%' left='50%' transform='rotate(45deg)'
                  h='70%' w='2px' bg='#f23f42'
                  borderRadius='12px' outline='2px solid #232428'
                  display={isMute.speaker ? 'block' : 'none'}
                />
              </Box>
            </Tooltip>
            <Tooltip label='ユーザー設定' hasArrow placement='top'
              bg='#111214' color='#e0e1e5' p='5px 10px' borderRadius='4px'
            >
              <IconButton aria-label='ユーザー設定'
                icon={<SettingsIcon boxSize='21px' p='2px' />} size={'sm'}
                color='#b5bac1' bg='transparent' borderRadius='4px'
                _hover={{ bg: '#3d3e45' }}
                onClick={onOpen}
              />
            </Tooltip>
          </Flex>
        </Flex>
      </Box>

      <Settings {...rest} />
    </>
  )
}

export default StatusPanel