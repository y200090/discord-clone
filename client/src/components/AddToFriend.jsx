import { Avatar, Box, Button, Flex, Heading, Input, Text, Icon } from '@chakra-ui/react';
import { css } from '@emotion/react';
import React, { useState } from 'react'
import { IoMdCompass } from 'react-icons/io';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';

const AddToFriend = ({ active }) => {
  const [userId, setUserId] = useState('');

  const handleRequest = (e) => {
    e.preventDefault();

    console.log(userId)
    setUserId('')
  };
  
  if (active) {
    return (
      <>
        <Flex
          h='100%' 
          flex='1 1 auto'
          flexDirection='column'
        >
          <Box 
            flexShrink='0' 
            p='20px 30px' 
            borderBottom='1px solid #3f4147'
          >
            <Heading 
              fontSize='16px' 
              lineHeight='20px'
              color='#f3f4f5'
              mb='8px'
            >
              フレンドに追加
            </Heading>
  
            <form onSubmit={handleRequest}>
              <Text
                maxW='800px'
                fontSize='14px'
                lineHeight='20px'
                fontWeight='400'
                color='#b8b9bf'
              >
                フレンドになりたいユーザーにフレンド申請を送ることができます。ユーザーIDを間違えないでくださいね！
              </Text>
  
              <Flex 
                maxW='800px'
                mt='16px'
                bg='#1e1f22'
                border='1px solid #151618'
                borderRadius='8px'
                align='center'
                p='0 12px'
                z='5'
                css={css`
                  &:focus-within {
                    border-color: #0a91d3;
                  }
                `}
              >
                <Box flex='1 1 auto' mr='16px'>
                  <Input
                    type='text'
                    id='userId'
                    value={userId}
                    placeholder='ユーザーIDを入力してください'
                    onChange={(e) => setUserId(e.target.value)}
                    size='lg'
                    border='none'
                    outline='none'
                    focusBorderColor='transparent'
                    fontSize='16px'
                    lineHeight='20px'
                    fontWeight='500'
                    color='#f3f4f5'
                    p='4px 0'
                    css={css`
                      &::placeholder {
                        color: #87898c
                      }
                    `}
                  />
                </Box>
                <Button
                  isDisabled={userId == ''}
                  type='submit'
                  h='32px'
                  w='auto'
                  minW='60px'
                  display='inline-block'
                  color='#f6f7fe'
                  bg='#5865f2'
                  borderRadius='3px'
                  fontSize='14px'
                  lineHeight='16px'
                  fontWeight='500'
                  p='2px 16px'
                  _hover={{
                    backgroundColor: '#5865f2',
                    opacity: '0.7'
                  }}
                  _disabled={{
                    opacity: '0.5',
                    cursor: 'not-allowed',
                  }}
                >
                  <Text 
                    m='0 auto' 
                    whiteSpace='nowrap'
                    textOverflow='ellipsis'
                    overflow='hidden'
                  >
                    フレンド申請を送信
                  </Text>
                </Button>
              </Flex>
            </form>
          </Box>
  
          <Box flexShrink='0' p='20px 30px'>
            <Heading
              fontSize='16px' 
              lineHeight='20px'
              color='#f3f4f5'
            >
              他の場所でフレンドを探す
            </Heading>
          </Box>
  
          <Flex pl='20px'>
            <Button
              as={RouterLink}
              to='/search'
              h='auto'
              bg='#2b2d31'
              display='flex'
              color='#e0e1e5'
              borderRadius='8px'
              p='1px 6px'
              border='1px solid #3b3d44'
              _hover={{
                backgroundColor: '#3b3d44',
                borderColor: '#43464c',
                opacity: '0.9'
              }}
            >
              <Avatar
                h='36px'
                w='36px'
                icon={<IoMdCompass size={20} />}
                m='8px'
                borderRadius='8px'
                bg='#23a55a'
              />
  
              <Text
                overflow='hidden'
                textOverflow='ellipsis'
                fontWeight='500'
                whiteSpace='normal'
              >
                公開サーバーを探す
              </Text>
  
              <Icon
                as={MdOutlineArrowForwardIos} 
                m='0 16px'
                h='20px'
                w='20px'
                color='#b8b9bf'
              />
            </Button>
          </Flex>
        </Flex>
      </>
    )
  }
}

export default AddToFriend