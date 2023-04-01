import { Avatar, Box, Flex, IconButton, Input, Icon, Text, Tooltip, Heading } from '@chakra-ui/react'
import { css } from '@emotion/react'
import React, { useEffect, useRef, useState } from 'react'
import { BiHash } from 'react-icons/bi'
import { MdPeopleAlt } from 'react-icons/md'
import { GiHamburgerMenu } from 'react-icons/gi'
import SendMessage from './SendMessage'
import { useParams } from 'react-router-dom'
import { useGetChannelInfoQuery } from '../redux/apis/channelApi'
import { AtSignIcon } from '@chakra-ui/icons'
import { useGetMessagesQuery } from '../redux/apis/messageApi'
import MessageBox from './MessageBox'

const Chat = () => {
  const { channelId } = useParams();
  const { data: channelInfo } = useGetChannelInfoQuery(channelId);
  const { data: messages } = useGetMessagesQuery(channelId);
  const messageRef = useRef();

  useEffect(() => {
    messageRef.current?.scrollIntoView(false);
  }, [messages]);
  
  return (
    <>
      <Flex as={'header'} align='center' position='relative' 
        flex='0 0 auto' h='48px' w='100%' p='0 8px'
        fontSize='16px' lineHeight='20px'
        boxShadow='
          0 1px 0 #2c2e33,
          0 1.5px 0 #2a2c31,
          0 2px 0 #2e3034
        '
        zIndex='1000'
      >
        <Flex flex='1 1 auto' align='center' overflow='hidden' cursor='default'>
          <IconButton aria-label='hamburger-menu'
            icon={<GiHamburgerMenu size={20} />} size={20}
            bg='transparent' color='#f3f4f5' m='0 12px'
            _hover={{ backgroundColor: 'transparent' }}
            display='none'
          />
          
          {channelInfo?.directMessage
            ? <AtSignIcon boxSize='21px' flex='0 0 auto' m='0 9px' color='#82858f' />
            : <Icon as={BiHash} boxSize={'28px'} flex='0 0 auto' m='0 8px' color='#82858f' />
          }
          <Heading minW='auto' color='#f3f4f5' 
            fontSize='16px' lineHeight='20px' fontWeight='600'
            overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'
          >
            {channelInfo?.channelName || 
              (channelInfo?.friends.length < 3
                ? channelInfo?.friends[1]?.displayName
                : channelInfo?.title
              )
            }
          </Heading>
        </Flex>
        
        <Flex flex='0 0 auto' align='center'>
          <Tooltip label='メンバーリストを表示'
            hasArrow placement='bottom'
            bg='#111214' color='#e0e1e5'
          >
            <IconButton aria-label='メンバーリストを表示'
              icon={<MdPeopleAlt size={24} />} size={24}
              bg='transparent' m='0 8px' color='#b8b9bf'
              _hover={{ bg: 'transparent', color: '#e0e1e5' }}
            />
          </Tooltip>

          <Box m='0 8px' z='100'>
            <Input type='text' id='message'
              h='24px' w='144px' p='2px 4px'
              border='none' outline='none'
              focusBorderColor='transparent'
              bg='#1e1f22' color='#f3f4f5'
              borderRadius='4px'
              fontSize='14px'
              placeholder='検索'
              transition='width 0.25s ease'
              css={css`
                &::placeholder {
                  padding-left: 4px;
                  color: #87898c;
                }
              `}
              _focus={{ width: '240px' }}
            />
          </Box>
        </Flex>
      </Flex>
    
      <Flex flex='1 1 auto' direction='column' w='100%'>
        <Flex direction='column' flex='1 1 0' 
          position='relative' overflow='hidden scroll' z='0'
          css={css`
            &::-webkit-scrollbar {
              width: 16px;
            }
            &::-webkit-scrollbar-thumb {
              background-color: #1a1b1e;
              border-radius: 100px;
              border: 4px solid transparent;
              background-clip: content-box;
            }
            &::-webkit-scrollbar-track {
              background-color: #2b2d31;
              border-radius: 100px;
              border: 4px solid transparent;
              background-clip: content-box;
            }
          `}
        >
          <Box as={'ol'} listStyleType='none' pt='1.0625rem' m='auto 0 0'>
            {messages?.map((message, i, array) => {        
              const prevState = new Date(array[i-1]?.createdAt);
              const createdAt = new Date(array[i]?.createdAt);
              const prevTime = prevState.getFullYear() + '年' + (prevState.getMonth() + 1) + '月' + prevState.getDate() + '日';
              const postTime = createdAt.getFullYear() + '年' + (createdAt.getMonth() + 1) + '月' + createdAt.getDate() + '日';
              const prevDate = prevState.getHours() + ':' + prevState.getMinutes();
              const postDate = createdAt.getHours() + ':' + createdAt.getMinutes();
              let timeFlag = true;
              if (prevTime === postTime) {
                timeFlag = !timeFlag;
              }
              let dateFlag = false;
              if (prevDate === postDate && array[i-1]?.sendedBy?._id === array[i]?.sendedBy?._id) {
                dateFlag = !dateFlag;
              }

              return (
                <Box as={'li'} ref={messageRef} key={message?._id} 
                  pb='1.0625rem' mt={dateFlag && '-1.0625rem'} listStyleType='none'
                >
                  {timeFlag && 
                    <Flex align='center' justify='center' color='#989aa2'
                      position='relative' m='0 0 1.0625rem 1rem' zIndex='1'
                      fontSize='12px' lineHeight='13px' fontWeight='600'
                      cursor='default'
                    >
                      <Text p='2px 4px' bg='#313338'>
                        {postTime}
                      </Text>
                      <Box position='absolute' h='1px' w='100%' bg='#3f4147' zIndex='-1' />
                    </Flex>
                  }

                  <MessageBox message={message} {...(dateFlag && {dateFlag: true})} />
                </Box>
              )
            })}
          </Box>
        </Flex>

        <Box flexShrink='0' p='0 16px'>
          <SendMessage />
        </Box>
      </Flex>
    </>
  )
}

export default Chat