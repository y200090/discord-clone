import { CloseIcon, SearchIcon } from '@chakra-ui/icons'
import { Box, Flex, Heading, IconButton, Image, Input, Text } from '@chakra-ui/react'
import { css } from '@emotion/react'
import React, { useState } from 'react'
import { NoPending } from '../../assets'
import FriendRequestCard from '../../components/FriendRequestCard'

const Pending = ({ currentUser, friendRequests }) => {
  const [ username, setUsername ] = useState('');

  if (!friendRequests?.length) {
    return (
      <>
        <Flex m='auto' direction='column' cursor='default'>
          <Image src={NoPending}
            flex='0 1 auto' h='200px' w='415px' mb='40px'
          />
          <Text m='auto' color='#949ba4' fontSize='16px' lineHeight='20px'>
            フレンドの申請は届いていません。
          </Text>
        </Flex>
      </>
    )
  }
  
  return (
    <>
      <Flex flex='0 0 auto'
        m='16px 20px 8px 30px' p='1px'
        bg='#1e1f22' borderRadius='4px'
      >
        <Input type='text' id='username' value={username}
          h='30px' minW='48px' m='1px' p='0 8px' flex='1 1 0%'
          borderColor='transparent' focusBorderColor='transparent'
          color='#dbdee1' bg='transparent'
          fontSize='16px' lineHeight='32px'
          _hover={{ borderColor: 'transparent' }}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='検索'
          css={css`
            &::placeholder {
              color: #949ba4
            }
          `}
        />
        <IconButton aria-label='user-icon'
          icon={username
            ? <CloseIcon boxSize='14px' />
            : <SearchIcon boxSize='18px' />
          }
          boxSize='32px' minW='32px'
          color='#949ba4' bg='transparent'
          cursor={username ? 'pointer' : 'default'}
          _hover={{ bg: 'transparent' }}
          {...(username && { onClick: () => setUsername('') })}
        />
      </Flex>

      <Box>
        <Heading color='#b5bac1'
          m='16px 20px 8px 30px' cursor='default'
          fontSize='12px' lineHeight='16px' fontWeight='600'
          overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'
        >
          保留中 — {friendRequests?.length}
        </Heading>
      </Box>

      <Box flex='1 1 auto' mt='8px' pb='8px'
        overflow='hidden scroll'
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
        {friendRequests?.map((request) => (
          <FriendRequestCard key={request._id}
            request={request}
            {...(request.from._id === currentUser._id
              ? {
                user: request.to,
                status: 'from',
              }
              : {
                user: request.from,
                status: 'to'
              }
            )}
          />
        ))}
      </Box>
    </>
  )
}

export default Pending