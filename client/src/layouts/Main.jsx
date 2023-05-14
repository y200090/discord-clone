import { Box, Button, Flex, Heading, IconButton, Text, Tooltip, useDisclosure } from '@chakra-ui/react'
import { css } from '@emotion/react'
import React from 'react'
import { BsPersonCheckFill } from 'react-icons/bs'
import { MdAdd } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { NavLink, Outlet } from 'react-router-dom'
import { selectCurrentUser } from '../redux/slices/userSlice'
import AddDirectMessageForm from '../features/modals/AddDirectMessageForm'
import { DirectMessageLink, SkeletonBox, StatusPanel } from '../components'
import { selectParticipatingChannels } from '../redux/slices/channelSlice'
import styled from '@emotion/styled'
import { selectFriendRequests } from '../redux/slices/requestSlice'

const Main = () => {
  const currentUser = useSelector(selectCurrentUser);
  console.log(currentUser)
  const friendRequests = useSelector(selectFriendRequests);
  const postRequests = friendRequests?.filter((request) => {
    return request?.from?._id !== currentUser?._id;
  });
  const participatingChannels = useSelector(selectParticipatingChannels);
  const directMessageIds = currentUser?.setDirectMessages?.map((dm) => {
    return dm._id;
  });
  const directMessages = participatingChannels.filter((channel) => {
    return directMessageIds?.includes(channel._id);
  });
  console.log(directMessages);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const rest = { 
    isOpen: isOpen, 
    onClose: onClose 
  };

  return (
    <>
      <Flex w='240px' direction='column' flex='0 0 auto' bg='#2b2d31'>
        <Flex as={'nav'} w='100%' direction='column' flex='1 1 auto'>
          <Flex align='center'
            h='48px' w='100%' p='0 10px' flex='0 0 auto' zIndex='10'
            boxShadow='
              0 1px 0 #1f2023, 
              0 1.5px 0 #232528, 
              0 2px 0 #282a2e
            '
          >
            <Button h='28px' w='100%' p='1px 6px'
              outline='none' border='none' textAlign='left'
              bg='#1e1f22' color='#989aa2' borderRadius='4px'
              fontSize='14px' lineHeight='22px' fontWeight='500'
              whiteSpace='nowrap'
              _hover={{ opacity: '1', bg: '#1e1f22' }}
            >
              トークに参加または作成する
            </Button>
          </Flex>

          <Box w='100%' p='0 0 0 8px' flex='1 1 auto' overflow='scroll'
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
            <Box h='42px' w='100%' mt='9px'>
              <Button as={NavLink} to='/channels/@me' end
                leftIcon={<BsPersonCheckFill size={24} />}
                justifyContent='flex-start' columnGap='4px'
                h='100%' w='100%' pr='8px'
                color='#f3f4f5' bg='transparent'
                borderRadius='4px'
                lineHeight='20px' fontWeight='500'
                _hover={{ bg: '#35373c' }}
                _activeLink={{ 
                  bg: '#404249', 
                  '&:hover': { bg: '#35373c' }
                }}
              >
                フレンド
                {postRequests?.length > 0 && 
                  <NotificationCounter>{postRequests?.length}</NotificationCounter>
                }
              </Button>
            </Box>

            <Heading display='flex' color='#949ba4'
              h='40px' padding='18px 8px 4px 10px'
              fontSize='12px' lineHeight='16px' fontWeight='600'
              _hover={{ p: { color: '#e0e1e5' } }}
            >
              <Text flex='1 1 0%' cursor='default'>
                ダイレクトメッセージ
              </Text>

              <Tooltip label='DMの作成'
                hasArrow placement='top'
                bg='#111214' color='#e0e1e5'
                p='6px 10px' borderRadius='4px'
              >
                <IconButton aria-label='add-to-dm'
                  size={'22'} icon={<MdAdd size={22} />}
                  flex='0 1 0%' bg='transparent'
                  _hover={{ color: '#e0e1e5', bg: 'transparent' }}
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onOpen(); 
                  }}
                />
              </Tooltip>
            </Heading>

            <Flex as={'ul'} flexDirection='column'>
              {directMessages?.length
                ? directMessages?.map((directMessage) => {
                    return (
                      <DirectMessageLink key={directMessage._id} 
                        directMessage={directMessage}
                        currentUser={currentUser}
                      />
                    )
                  })
                : <SkeletonBox />
              }
            </Flex>
          </Box>
        </Flex>

        <StatusPanel currentUser={currentUser} />
      </Flex>

      <Flex as={'main'} direction='column' position='relative' h='100%' w='100%' minW='0px' bg='#313338'>
        <Outlet />
      </Flex>

      <AddDirectMessageForm {...rest} />
    </>
  )
};

const NotificationCounter = styled.span`
  flex: 0 0 auto;
  min-height: 16px;
  min-width: 16px;
  padding-right: 1px;
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 12px;
  line-height: 16px;
  font-weight: 700;
  color: #fffff3;
  background-color: #f23f42;
`

export default Main