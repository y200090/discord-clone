import { Avatar, AvatarBadge, Box, ButtonGroup, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, Tooltip } from '@chakra-ui/react'
import { css } from '@emotion/react'
import React from 'react'
import { FaDiscord } from 'react-icons/fa'
import { GoKebabVertical } from 'react-icons/go'
import { IoChatboxSharp } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useAppendDirectMessageMutation } from '../redux/apis/channelApi'
import { useDeleteFriendMutation } from '../redux/apis/friendApi'
import { socket } from '../socket'

const FriendCard = ({ friend, currentUser }) => {
  const [ AppendDirectMessage ] = useAppendDirectMessageMutation();
  const [ DeleteFriend ] = useDeleteFriendMutation();
  const navigate = useNavigate();
  
  const handleAppendDM = async (e) => {
    try {
      console.log(e.currentTarget.id)
      const channel = await AppendDirectMessage({
        currentUserId: currentUser?._id,
        targetUserId: e.currentTarget.id,
      }).unwrap();

      navigate(`/channels/@me/${channel._id}`)
      
    } catch (err) {
      console.log(err);
    }
  };

  const handleBlockFriend = () => {
    console.log('click');
  };

  const handleDeleteFriend = async (e) => {
    try {
      await DeleteFriend({
        currentUser,
        targetUser: friend
      }).unwrap();

      // socket.emit('delete_friend', friend);
      
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
          '.side-margin': { bg: '#393c41' }
        }}
      >
        <Flex flexGrow='1' align='center' justify='space-between'>
          <Flex align='center'>
            <Box h='32px' w='32px' flexShrink='0' mr='12px'>
              <Avatar boxSize='32px'
                {...(friend?.photoURL
                  ? {src: friend?.photoURL}
                  : {
                      icon: <FaDiscord />,
                      bg: friend?.color
                    }
                )}
              >
                <AvatarBadge  boxSize='16px'
                  bg='#23a55a' borderColor='#2b2d31'
                />
              </Avatar>
            </Box>
            <Flex direction='column' justify='center'>
              <Box color='#f2f3f5'
                fontSize='16px' lineHeight='20px' fontWeight='600'
                overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'
              >
                {friend?.displayName}
              </Box>
              <Text color='#b5bac1'
                fontSize='14px' lineHeight='20px'
                overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'
              >
                オンライン
              </Text>
            </Flex>
          </Flex>
          <ButtonGroup columnGap='10px'
            css={css`
              div {
                margin-inline-start: 0 !important;
              }
            `}
          >
            <Tooltip label='メッセージ'
              hasArrow placement='top'
              bg='#111214' color='#e0e1e5'
              p='5px 10px' borderRadius='4px'
            >
              <IconButton aria-label='メッセージ' id={friend?._id}
                icon={<IoChatboxSharp size='18px' />} boxSize='36px'
                minW='36px' bg='#2b2d31' color='#b5bac1'
                borderRadius='50%'
                _hover={{ bg: '#2b2d31', color: '#dadde0' }}
                onClick={handleAppendDM}
              />
            </Tooltip>
            <Menu>
              <Tooltip label='その他'
                hasArrow placement='top'
                bg='#111214' color='#e0e1e5'
                p='5px 10px' borderRadius='4px'
              >
                <MenuButton id={friend?._id}
                  as={IconButton} aria-label='その他'
                  icon={<GoKebabVertical size='16px' />} boxSize='36px'
                  minW='36px' bg='#2b2d31' color='#b5bac1'
                  borderRadius='50%'
                  _hover={{ bg: '#2b2d31', color: '#dadde0' }}
                  _expanded={{ bg: '#2b2d31' }}
                  css={css`
                    margin-inline-start: 0 !important;
                  `}
                />
              </Tooltip>
              <MenuList h='auto' minW='188px' maxW='320px' p='6px 8px' 
                bg='#111214' border='none' borderRadius='4px'
                boxShadow='0 8px 16px rgba(17, 18, 20, 0.25)'
              >
                <MenuItem 
                  minH='32px' p='6px 8px' m='2px 0'
                  bg='#111214' color='#b5bac1' borderRadius='2px'
                  fontSize='14px' lineHeight='18px' fontWeight='500'
                  _hover={{ bg: '#4752c4', color: '#fff' }}
                  onClick={handleBlockFriend}
                >
                  フレンドをブロック
                </MenuItem>
                <MenuItem 
                  minH='32px' p='6px 8px' m='2px 0'
                  bg='#111214' color='#f23f42' borderRadius='2px'
                  fontSize='14px' lineHeight='18px' fontWeight='500'
                  _hover={{ bg: '#da373c', color: '#fff' }}
                  onClick={handleDeleteFriend}
                >
                  フレンドを削除
                </MenuItem>
              </MenuList>
            </Menu>
          </ButtonGroup>
        </Flex>

        <Box className='side-margin'
          position='absolute' top='-1px' left='-8px'
          h='calc(100% + 1px)' w='8px'
          borderRadius='8px 0 0 8px'
        />
        <Box className='side-margin'
          position='absolute' top='-1px' right='-8px'
          h='calc(100% + 1px)' w='8px'
          borderRadius='0 8px 8px 0'
        />
      </Flex>
    </>
  )
}

export default FriendCard