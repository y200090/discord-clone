import { CloseIcon } from '@chakra-ui/icons';
import { Avatar, Box, ButtonGroup, Flex, IconButton, Text, Tooltip } from '@chakra-ui/react';
import React from 'react'
import { FaDiscord } from 'react-icons/fa';
import { FiCheck } from 'react-icons/fi';
import { useApprovalFriendRequestMutation, useDenialFriendRequestMutation } from '../redux/apis/friendApi'
import { socket } from '../socket';

const FriendRequestCard = ({ request, user, status }) => {
  const [ ApprovalFriendRequest ] = useApprovalFriendRequestMutation();
  const [ DenialFriendRequest ] = useDenialFriendRequestMutation();

  const handleApproval = async () => {
    try {
      await ApprovalFriendRequest({ request });

      socket.emit('approve_request', request);
      
    } catch (err) {
      console.log(err);
    }
  };

  const handleDenial = async () => {
    try {
      await DenialFriendRequest({ request });

      socket.emit('deny_request', user._id);
      
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
              <Box color='#f2f3f5'
                fontSize='16px' lineHeight='20px' fontWeight='600'
                overflow='hidden' 
                whiteSpace='nowrap' 
                textOverflow='ellipsis'
              >
                {user?.displayName}
              </Box>
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
                onClick={handleApproval}
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
                onClick={handleDenial}
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