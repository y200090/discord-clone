import { Box, Flex, TabList, Tabs, Text, Icon, Tab, TabPanels, TabPanel } from '@chakra-ui/react'
import { css } from '@emotion/react'
import React from 'react'
import { BsPersonCheckFill } from 'react-icons/bs'
import { useSelector } from 'react-redux'
import { AddToFriend, Blocking, Online, Pending, ShowAll } from '../features'
import { selectCurrentUser } from '../redux/slices/userSlice'
import { selectFriendRequests } from '../redux/slices/requestSlice'
import styled from '@emotion/styled'

const Friends = () => {
  const currentUser = useSelector(selectCurrentUser);
  const friendRequests = useSelector(selectFriendRequests);
  const friendItems = ['オンライン', '全て表示', '保留中', 'ブロック中', 'フレンドに追加'];

  const postRequests = friendRequests?.filter((request) => {
    return request?.from?._id !== currentUser?._id;
  });

  return (
    <>
      <Tabs variant='unstyled' 
        h='100%' w='100%' minW='0px'
        display='flex' flexDirection='column'
      >
        <Flex as={'header'} align='center' position='relative'
          h='48px' w='100%' minW='0px' p='0 8px'
          flex='0 0 auto' zIndex='10'
          boxShadow='
            0 1px 0 #2c2e33,
            0 1.5px 0 #2a2c31,
            0 2px 0 #2e3034
          '
          overflow='auto' whiteSpace='nowrap'
          css={css`
            scrollbar-width: none;
            -ms-overflow-style: none;
            &::-webkit-scrollbar {
              display: none;
            }
          `}
        >
          <TabList w='100%' minW='100%'>
            <Box h='24px' m='0 8px'>
              <Icon as={BsPersonCheckFill} boxSize='24px' color='#82858f' />
            </Box>
            <Box h='24px' minW='0px' mr='8px' cursor='default'>
              <Text color='#f3f4f5' fontWeight='600' 
                textOverflow='ellipsis'
                overflow='hidden'
                whiteSpace='nowrap'
              >
                フレンド
              </Text>
            </Box>
            
            <Box h='24px' w='1px' bg='#3f4147' m='0 8px' />

            {friendItems.map((friendItem, i) => (
              <Tab key={friendItem} aria-label='online'
                h='26px' w='auto' minW='0px' p='0 8px' m='0 8px'
                borderRadius='4px'
                bg={i === 4 ? '#248045' : 'transparent' }
                color={i === 4 ? '#f3f4f5' : '#b8b9bf'}
                fontSize='16px' lineHeight='20px' fontWeight='500'
                _hover={{
                  color: '#f3f4f5',
                  bg: i === 4 ? '#248045' : '#393c41',
                }}
                _selected={{
                  color: i === 4 ? '#2dc771' : '#f3f4f5',
                  bg: i === 4 ? 'transparent' : '#43444b',
                  '&:hover': { bg: i !== 4 && '#393c41' },
                }}
              >
                <Text m='0 auto'
                  whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'
                  display='flex' alignItems='center'
                >
                  {friendItem}
                  
                  {friendItem == '保留中' && postRequests?.length > 0 && (
                    <NotificationCounter>{postRequests?.length}</NotificationCounter>
                  )}
                </Text>
              </Tab>
            ))}
          </TabList>
        </Flex>

        <TabPanels h='100%' w='100%'>
          <TabPanel h='100%' w='100%' p='0'
            display='flex' flexDirection='column'
          >
            <Online currentUser={currentUser} />
          </TabPanel>

          <TabPanel h='100%' w='100%' p='0'
            display='flex' flexDirection='column'
          >
            <ShowAll currentUser={currentUser} />
          </TabPanel>

          <TabPanel h='100%' w='100%' p='0' 
            display='flex' flexDirection='column'
          >
            <Pending 
              currentUser={currentUser}
              friendRequests={friendRequests} 
            />
          </TabPanel>

          <TabPanel h='100%' w='100%' p='0'
            display='flex' flexDirection='column'
          >
            <Blocking currentUser={currentUser} />
          </TabPanel>

          <TabPanel h='100%' w='100%' p='0'>
            <AddToFriend currentUser={currentUser} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  )
};

const NotificationCounter = styled.span`
  flex: 0 0 auto;
  min-height: 16px;
  height: 16px;
  min-width: 16px;
  margin-left: 8px;
  padding: 0 1px 1px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 12px;
  line-height: 16px;
  font-weight: 700;
  color: #fffff3;
  background-color: #f23f42;
`;

export default Friends