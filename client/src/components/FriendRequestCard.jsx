import { CloseIcon } from '@chakra-ui/icons';
import { Avatar, Box, ButtonGroup, Flex, IconButton, Text, Tooltip } from '@chakra-ui/react';
import React from 'react'
import { FaDiscord } from 'react-icons/fa';
import { FiCheck } from 'react-icons/fi';
import { useApproveFriendRequestMutation, useDiscardFriendRequestMutation } from '../redux/apis/friendApi'
import { socket } from '../socket';

const FriendRequestCard = ({ request, user, status }) => {
  const [ ApproveFriendRequest ] = useApproveFriendRequestMutation();
  const [ DiscardFriendRequest ] = useDiscardFriendRequestMutation();

  const handleApprove = async () => {
    try {
      await ApproveFriendRequest({ request });

      // socket.emit('approve_request', request);
      
    } catch (err) {
      console.log(err);
    }
  };

  const handleDiscard = async () => {
    try {
      await DiscardFriendRequest({ request });

      // socket.emit('discard_request', request);
      
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <>
      <Flex position='relative' h='62px' m='0 20px 0 30px'
        borderTop='1px solid #3f4147'
        _hover={{
          bg: '#393c41', 
          borderColor: '#393c41',
          cursor: 'pointer',
          'div > div > div > div > span:last-of-type': {
            opacity: '1',
          },
          'div > div > button': {
            bg: '#1d1e21',
          },
          '.margin-bg': { bg: '#393c41' }
        }}
      >
        <Flex flexGrow='1' align='center' justify='space-between'>
          <Flex align='center'>
            <Box h='32px' w='32px' flexShrink='0' mr='12px'>
              <Avatar boxSize='32px'
                {...(user?.photoURL
                  ? {src: user?.photoURL}
                  : {
                    icon: <FaDiscord />,
                    bg: user?.color
                  }
                )}
              />
            </Box>
            <Flex direction='column' justify='center'>
              <Flex align='flex-end' lineHeight='1.1'>
                <Box as={'span'} color='#f2f3f5'
                  fontSize='16px' fontWeight='600'
                  overflow='hidden' 
                  whiteSpace='nowrap' 
                  textOverflow='ellipsis'
                >
                  {user?.displayName}
                </Box>
                <Text as={'span'} color='#b5bac1' opacity={0}
                  fontSize='14px' lineHeight='16px' fontWeight='500'
                  overflow='hidden' 
                  whiteSpace='nowrap' 
                  textOverflow='ellipsis'
                >
                  {user?.tag?.replace(user?.displayName, '')}
                </Text>
              </Flex>
              <Text color='#b5bac1'
                fontSize='14px' lineHeight='20px'
                overflow='hidden'
                whiteSpace='nowrap'
                textOverflow='ellipsis'
              >
                {status === 'to'
                  ? 'フレンド申請が届いています'
                  : 'フレンド申請を送信済み'
                }
              </Text>
            </Flex>
          </Flex>
          <ButtonGroup columnGap='2px'>
            <Tooltip label='追加する'
              hasArrow placement='top'
              bg='#111214' color='#e0e1e5'
              p='5px 10px' borderRadius='4px'
            >
              <IconButton aria-label='追加する'
                icon={<FiCheck size='20px' />} boxSize='36px'
                minW='36px' bg='#2b2d31' color='#b5bac1'
                borderRadius='50%'
                _hover={{ bg: '#2b2d31', color: '#23a559' }}
                onClick={handleApprove}
                {...(status === 'from' && {display: 'none'}
                )}
              />
            </Tooltip>
            <Tooltip
              label={status === 'to' ? '無視' : 'キャンセル'}
              hasArrow placement='top'
              bg='#111214' color='#e0e1e5'
              p='5px 10px' borderRadius='4px'
            >
              <IconButton 
                aria-label={status === 'to' ? '無視' : 'キャンセル'}
                icon={<CloseIcon boxSize='12px' />} boxSize='36px'
                minW='36px' bg='#2b2d31' color='#b5bac1'
                borderRadius='50%'
                _hover={{ bg: '#2b2d31', color: '#f23f42' }}
                onClick={handleDiscard}
              />
            </Tooltip>
          </ButtonGroup>
        </Flex>

        <Box className='margin-bg'
          position='absolute' top='-1px' left='-8px'
          h='calc(100% + 1px)' w='8px'
          borderRadius='8px 0 0 8px'
        />
        <Box className='margin-bg'
          position='absolute' top='-1px' right='-8px'
          h='calc(100% + 1px)' w='8px'
          borderRadius='0 8px 8px 0'
        />
      </Flex>
    </>
  )
}

export default FriendRequestCard