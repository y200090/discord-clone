import { Avatar, Box, Flex, Heading, Text } from '@chakra-ui/react'
import { css } from '@emotion/react'
import React from 'react'
import SendMessage from './SendMessage'

const Chat = () => {
  return (
    <>
      <Flex 
        flex='1 1 auto'
        direction='column'
        w='100%'
      >
        <Flex 
          position='relative'
          flex='1 1 0' 
          direction='column'
          overflow='hidden scroll'
          z='0'
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
          <Box as={'ol'} listStyleType='none' m='auto 0 24px'>
            <DateDivision dateTime={'2023年3月3日'} />
            <MessageBox 
              username={'yuto'}
              sendingTime={'今日 11:56'}
              message={'test'}
            />
            <MessageBox 
              username={'yuto'}
              sendingTime={'今日 11:56'}
              message={'test'}
            />
            <MessageBox 
              username={'yuto'}
              sendingTime={'今日 11:56'}
              message={'test'}
            />
            <MessageBox 
              username={'yuto'}
              sendingTime={'今日 11:56'}
              message={'test'}
            />
            <MessageBox 
              username={'yuto'}
              sendingTime={'今日 11:56'}
              message={'test'}
            />
            <MessageBox 
              username={'yuto'}
              sendingTime={'今日 11:56'}
              message={'test'}
            />
            <MessageBox 
              username={'yuto'}
              sendingTime={'今日 11:56'}
              message={'test'}
            />
            <DateDivision dateTime={'2023年3月4日'} />
            <MessageBox 
              username={'yuto'}
              sendingTime={'今日 11:56'}
              message={'test'}
            />
            <MessageBox 
              username={'yuto'}
              sendingTime={'今日 11:56'}
              message={'test'}
            />
            <MessageBox 
              username={'yuto'}
              sendingTime={'今日 11:56'}
              message={'test'}
            />
          </Box>
        </Flex>

        <Box flexShrink='0' p='0 16px'>
          <SendMessage />
        </Box>
      </Flex>
    </>
  )
}

const MessageBox = ({ avatarIcon, avatarSrc, username, sendingTime, message }) => {
  return (
    <>
      <Flex
        as={'li'}
        listStyleType='none'
        align='center'
        mt='1.0625rem'
        minH='2.75rem'
        p='2px 0 2px 1rem'
        _hover={{
          backgroundColor: '#2e3035'
        }}
      >
        <Avatar 
          boxSize='40px'
          {...(avatarIcon && {Icon: avatarIcon})}
          {...(avatarSrc && {src: avatarSrc})}
        />

        <Box pl='15px'>
          <Box
            as={'h3'}
            maxH='1.375rem' 
            lineHeight='1.375rem'
            whiteSpace='break-spaces'
          >
            <Text 
              as={'span'}
              color='#f3f4f5'
              fontSize='1rem'
              fontWeight='500'
              lineHeight='1.375rem'
              cursor='pointer'
              _hover={{
                textDecoration: 'underline'
              }}
            >
              {username} 
            </Text>
            <Text
              as={'span'}
              ml='0.5rem'
              fontSize='0.75rem'
              lineHeight='1.375rem'
              fontWeight='400'
              color='#93959d'
            >
              {sendingTime}
            </Text>
          </Box>
          <Text
            fontSize='1rem'
            lineHeight='1.375rem'
            whiteSpace='break-spaces'
            color='#e0e1e5'
          >
            {message}
          </Text>
        </Box>
      </Flex>
    </>
  )
}

const DateDivision = ({ dateTime }) => {
  return (
    <>
      <Flex
        position='relative'
        align='center'
        justify='center'
        fontSize='12px'
        lineHeight='13px'
        m='1.0625rem 0 0 1rem'
        fontWeight='600'
        color='#989aa2'
        zIndex='1'
      >
        <Text p='2px 4px' bg='#313338'>
          {dateTime}
        </Text>
        <Box 
          position='absolute'
          h='1px'
          w='100%'
          bg='#3f4147'
          zIndex='-1'
        />
      </Flex>
    </>
  )
}

export default Chat