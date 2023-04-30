import { Avatar, AvatarBadge, Box, ButtonGroup, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, Tooltip } from '@chakra-ui/react'
import { css } from '@emotion/react'
import React from 'react'
import { FaDiscord } from 'react-icons/fa'
import { GoKebabVertical } from 'react-icons/go'
import { IoChatboxSharp } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useAddDirectMessageMutation } from '../redux/apis/channelApi'
import { useDeleteFriendMutation } from '../redux/apis/friendApi'

const FriendCard = ({ friend, currentUser }) => {
  const [ AddDirectMessage ] = useAddDirectMessageMutation();
  const [ DeleteFriend ] = useDeleteFriendMutation();
  const navigate = useNavigate();

  const handleAdd = async () => {
    try {
      const DM = await AddDirectMessage({
        currentUserId: currentUser?._id,
        friendId: friend?._id,
      }).unwrap();

      navigate(`/channels/@me/${DM._id}`)
      
    } catch (err) {
      console.log(err);
    }
  };

  const handleBlockFriend = () => {
    console.log('click');
  };

  const handleDelete = async (e) => {
    try {
      await DeleteFriend({ currentUser, friend }).unwrap();

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
          'div > div > div > span': {
            'span': {
              borderColor: '#393c41',
            },
            'div': {
              bg: '#393c41',
              'div': {
                bg: '#80848e',
                'div': {
                  bg: '#393c41',
                }
              }
            }
          },
          'div > div > div > div > span:last-of-type': {
            opacity: '1',
          },
          'div > div > button': {
            bg: '#1d1e21',
          },
          '.side-margin': { bg: '#393c41' }
        }}
      >
        <Flex flexGrow='1' align='center' justify='space-between'>
          <Flex align='center'>
            <Box position='relative' h='32px' w='32px' flexShrink='0' mr='12px'>
              <Avatar boxSize='32px' position='relative'
                {...(friend?.photoURL
                  ? {src: friend?.photoURL}
                  : {
                      icon: <FaDiscord />,
                      bg: friend?.color
                    }
                )}
              >
                <AvatarBadge as={'span'} boxSize='16px' display={!friend?.online && 'none'}
                  bg='#23a55a' borderColor='#313338'
                />
                <Box position='absolute' bottom='-4px' right='-4px'
                  h='16px' w='16px' borderRadius='50%' bg='#313338'
                  p='3.3px' cursor='default'
                  display={friend?.online && 'none'}
                >
                  <Box h='100%' w='100%' bg='#80848e' borderRadius='50%' p='2.5px'>
                    <Box h='100%' w='100%' bg='#313338' borderRadius='50%' />
                  </Box>
                </Box>
              </Avatar>
            </Box>
            <Flex direction='column' justify='center'>
              <Flex align='flex-end' lineHeight='1.1'>
                <Box as={'span'} color='#f2f3f5'
                  fontSize='16px' fontWeight='600'
                  overflow='hidden' 
                  whiteSpace='nowrap' 
                  textOverflow='ellipsis'
                >
                  {friend?.displayName}
                </Box>
                <Text as={'span'} color='#b5bac1' opacity={0}
                  fontSize='14px' lineHeight='16px' fontWeight='500'
                  overflow='hidden' 
                  whiteSpace='nowrap' 
                  textOverflow='ellipsis'
                >
                  {friend?.tag?.replace(friend?.displayName, '')}
                </Text>
              </Flex>
              <Text color='#b5bac1'
                fontSize='14px' lineHeight='20px'
                overflow='hidden' 
                whiteSpace='nowrap' 
                textOverflow='ellipsis'
              >
                {friend?.online ? 'オンライン' : 'オフライン'}
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
              <IconButton aria-label='メッセージ'
                icon={<IoChatboxSharp size='18px' />} boxSize='36px'
                minW='36px' bg='#2b2d31' color='#b5bac1'
                borderRadius='50%'
                _hover={{ bg: '#2b2d31', color: '#dadde0' }}
                onClick={handleAdd}
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
                  onClick={handleDelete}
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