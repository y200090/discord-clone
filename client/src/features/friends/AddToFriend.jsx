import { Avatar, Box, Button, Flex, Heading, Input, Text, Icon } from '@chakra-ui/react';
import { css } from '@emotion/react';
import React, { useState } from 'react'
import { IoMdCompass } from 'react-icons/io';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';
import { usePostFriendRequestMutation } from '../../redux/apis/friendApi';

const AddToFriend = ({ currentUser }) => {
  const [ PostFriendRequest, { 
    isLoading, 
    isSuccess, 
    data,
    isError,
    error
  } ] = usePostFriendRequestMutation();
  const [ targetUserTag, setTargetUserTag ] = useState('');

  const handleRequest = async (e) => {
    e.preventDefault();

    try {
      await PostFriendRequest({ 
        currentUserId: currentUser?._id, 
        targetUserTag,
      });

    } catch (err) {
      console.log(err);

    } finally {
      setTargetUserTag('');
    }
  };

  return (
    <>
      <Flex direction='column' flex='1 1 auto' 
        h='100%' w='100%' minW='0px'
      >
        <Box flexShrink='0' p='20px 30px' borderBottom='1px solid #3f4147'>
          <Heading color='#f3f4f5' mb='8px' fontSize='16px' lineHeight='20px'>
            フレンドに追加
          </Heading>

          <form onSubmit={handleRequest}>
            <Text color='#b8b9bf' maxW='800px'
              fontSize='14px' lineHeight='20px' fontWeight='400'
            >
              フレンドになりたいユーザーにフレンド申請を送ることができます。ユーザーIDを間違えないでくださいね！
            </Text>

            <Flex align='center'
              maxW='800px' mt='16px' p='0 12px'
              bg='#1e1f22' border='1px solid #151618'
              borderRadius='8px' z='5'
              css={css`
                &:focus-within {
                  border-color: #0a91d3;
                }
              `}
              borderColor={isSuccess ? '#23a559' : isError && '#f23f42'}
            >
              <Box flex='1 1 auto' mr='16px'>
                <Input type='text' id='userTag' value={targetUserTag}
                  size='lg' minW='0px' p='4px 0' color='#f3f4f5'
                  border='none' outline='none'
                  focusBorderColor='transparent'
                  fontSize='16px' lineHeight='20px' fontWeight='500'
                  autoComplete='off'
                  onChange={(e) => setTargetUserTag(e.target.value)}
                  placeholder='ユーザーIDを入力してください'
                  css={css`
                    &::placeholder {
                      color: #87898c
                    }
                  `}
                />
              </Box>
              <Button type='submit' isDisabled={targetUserTag == ''}
                isLoading={isLoading}
                h='32px' w='auto' minW='60px' p='2px 16px'
                color='#f6f7fe' bg='#5865f2' borderRadius='3px'
                fontSize='14px' lineHeight='16px' fontWeight='500'
                _hover={{ bg: '#5865f2', opacity: '0.7' }}
                _disabled={{ opacity: '0.5', cursor: 'not-allowed' }}
                onClick={handleRequest}
              >
                <Text m='0 auto' 
                  whiteSpace='nowrap'
                  textOverflow='ellipsis'
                  overflow='hidden'
                >
                  フレンド申請を送信
                </Text>
              </Button>
            </Flex>
          </form>

          {(isSuccess || isError) && (
            <Text 
              color={isSuccess ? '#23a559' : isError && '#f23f42'} 
              mt='8px' fontSize='14px' lineHeight='20px' fontWeight='400' 
            >
              {isSuccess ? data?.message : isError && error?.data}
            </Text>
          )}
        </Box>

        <Box flexShrink='0' p='20px 30px'>
          <Heading fontSize='16px' lineHeight='20px' color='#f3f4f5'>
            他の場所でフレンドを探す
          </Heading>
        </Box>

        <Flex pl='20px'>
          <Button as={RouterLink} to='/guild-discovery'
            h='auto' w='auto' minW='0px' p='1px 6px'
            bg='#2b2d31' color='#e0e1e5'
            borderRadius='8px' border='1px solid #3b3d44'
            display='flex'
            _hover={{
              bg: '#3b3d44',
              borderColor: '#43464c',
              opacity: '0.9'
            }}
          >
            <Avatar icon={<IoMdCompass size={20} />}
              h='36px' w='36px' m='8px'
              borderRadius='8px' bg='#23a55a'
            />

            <Text
              overflow='hidden'
              textOverflow='ellipsis'
              whiteSpace='nowrap'
              fontWeight='500'
            >
              公開サーバーを探す
            </Text>

            <Icon as={MdOutlineArrowForwardIos} 
              h='20px' w='20px' m='0 16px' color='#b8b9bf'
            />
          </Button>
        </Flex>
      </Flex>
    </>
  )
}

export default AddToFriend