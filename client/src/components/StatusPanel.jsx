import { Avatar, Box, Flex, IconButton, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Tooltip, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { MdKeyboardVoice } from 'react-icons/md';
import { BsHeadphones } from 'react-icons/bs';
import { RiSettings5Fill } from 'react-icons/ri';
import { css } from '@emotion/react';
import Settings from './Settings';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/slices/authSlice';
import { FaDiscord } from 'react-icons/fa';

const StatusPanel = () => {
  const currentUser = useSelector(selectCurrentUser);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const rest = { isOpen: isOpen, onClose: onClose };

  const copyTextToClipboard = async (e) => {
    await navigator.clipboard.writeText(currentUser?.tag);
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
            <Tooltip label='ミュート解除'
              hasArrow placement='top'
              bg='#111214' color='#e0e1e5'
            >
              <Flex position='relative' align='center' justify='center'>
                <IconButton aria-label='マイクミュート'
                  icon={<MdKeyboardVoice size='21px' />} size={'sm'}
                  color='#b5bac1' bg='transparent' borderRadius='4px'
                  _hover={{ bg: '#3d3e45' }}
                />
                <Box position='absolute'
                  h='60%' w='2px' bg='#f23f42'
                  borderRadius='12px'
                  css={css` 
                    transform: rotate(45deg); 
                  `}
                />
              </Flex>
            </Tooltip>
            <Tooltip label='スピーカーミュート'
              hasArrow placement='top'
              bg='#111214' color='#e0e1e5'
            >
              <IconButton aria-label='スピーカーミュート'
                icon={<BsHeadphones size='21px' />} size={'sm'}
                color='#b5bac1' bg='transparent'
                borderRadius='4px'
                _hover={{ bg: '#3d3e45' }}
              />
            </Tooltip>
            <Tooltip label='ユーザー設定'
              hasArrow placement='top'
              bg='#111214' color='#e0e1e5'
            >
              <IconButton aria-label='ユーザー設定'
                icon={<RiSettings5Fill size='21px' />} size={'sm'}
                color='#b5bac1' bg='transparent'
                borderRadius='4px'
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