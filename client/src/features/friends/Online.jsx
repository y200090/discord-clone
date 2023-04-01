import { CloseIcon, SearchIcon } from '@chakra-ui/icons';
import { Avatar, AvatarBadge, Box, ButtonGroup, Flex, Heading, IconButton, Image, Input, Text, Tooltip } from '@chakra-ui/react';
import { css } from '@emotion/react';
import React, { useState } from 'react'
import { IoChatboxSharp } from 'react-icons/io5';
import { FaDiscord } from 'react-icons/fa';
import { GoKebabVertical } from 'react-icons/go';
import { useSelector } from 'react-redux'
import { NoOnline } from '../../assets';
import { selectCurrentUser } from '../../redux/slices/authSlice'
import { useAddToDMMutation } from '../../redux/apis/friendApi';
import { useNavigate } from 'react-router-dom';

const Online = () => {
  const currentUser = useSelector(selectCurrentUser);
  const onlineUsersLength = Object.keys(currentUser).length === 0
    ? 0
    : currentUser?.friends?.friend?.length;
  const [ AddToDM ] = useAddToDMMutation();
  const navigate = useNavigate();
  const [ userTag, setUserTag ] = useState('');

  const handleCreateDM = async (e) => {
    e.preventDefault();

    console.log(e.currentTarget.name)

    try {
      const channelId = await AddToDM({
        currentUserId: currentUser?._id,
        targetUserIds: [e.currentTarget.name],
      }).unwrap();

      navigate(`/channels/@me/${channelId}`)
      
    } catch (err) {
      console.log(err);
    }
  };

  if (!onlineUsersLength) {
    return (
      <>
        <Flex m='auto' direction='column' cursor='default'>
          <Image src={NoOnline}
            flex='0 1 auto' h='200px' w='415px' mb='40px'
          />
          <Text m='auto' color='#949ba4' fontSize='16px' lineHeight='20px'>
            今はまだ静かな状態です。
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
        <Input type='text' id='username'
          value={userTag}
          h='30px' minW='48px' m='1px' p='0 8px'
          flex='1 1 0%'
          borderColor='transparent'
          focusBorderColor='transparent'
          color='#dbdee1'
          bg='transparent'
          fontSize='16px'
          lineHeight='32px'
          _hover={{ borderColor: 'transparent' }}
          onChange={(e) => setUserTag(e.target.value)}
          placeholder='検索'
          css={css`
            &::placeholder {
              color: #949ba4
            }
          `}
        />
        <IconButton aria-label='user-icon'
          icon={userTag
            ? <CloseIcon boxSize='14px' />
            : <SearchIcon boxSize='18px' />
          }
          boxSize='32px' minW='32px'
          color='#949ba4' bg='transparent'
          cursor={userTag ? 'pointer' : 'default'}
          _hover={{ bg: 'transparent' }}
          {...(userTag && { onClick: () => setUserTag('') })}
        />
      </Flex>

      <Box>
        <Heading
          m='16px 20px 8px 30px'
          color='#b5bac1'
          fontSize='12px' lineHeight='16px' fontWeight='600'
          overflow='hidden'
          whiteSpace='nowrap'
          textOverflow='ellipsis'
          cursor='default'
        >
          オンライン — {onlineUsersLength}
        </Heading>
      </Box>

      <Box
        flex='1 1 auto'
        mt='8px' pb='8px'
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
        {currentUser?.friends?.friend?.map((user) => (
          <Flex key={user?._id}
            position='relative' h='62px' m='0 20px 0 30px'
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
                  >
                    <AvatarBadge  boxSize='16px'
                      bg='#23a55a' borderColor='#2b2d31'
                    />
                  </Avatar>
                </Box>
                <Flex direction='column' justify='center'>
                  <Box
                    fontSize='16px'
                    lineHeight='20px'
                    fontWeight='600'
                    color='#f2f3f5'
                    overflow='hidden'
                    whiteSpace='nowrap'
                    textOverflow='ellipsis'
                  >
                    {user?.displayName}
                  </Box>
                  <Text
                    fontSize='14px'
                    lineHeight='20px'
                    color='#b5bac1'
                    overflow='hidden'
                    whiteSpace='nowrap'
                    textOverflow='ellipsis'
                  >
                    {currentUser?.description || 'オンライン'}
                  </Text>
                </Flex>
              </Flex>
              <ButtonGroup columnGap='2px'>
                <Tooltip
                  label='メッセージ'
                  hasArrow
                  placement='top'
                  bg='#111214'
                  color='#e0e1e5'
                  p='5px 10px'
                  borderRadius='4px'
                >
                  <IconButton aria-label='approval-icon' name={user?._id}
                    icon={<IoChatboxSharp size='20px' />} boxSize='36px'
                    minW='36px' bg='#2b2d31' color='#b5bac1'
                    borderRadius='50%'
                    _hover={{ bg: '#2b2d31', color: '#dadde0' }}
                    onClick={handleCreateDM}
                  />
                </Tooltip>
                <Tooltip
                  label='その他'
                  hasArrow placement='top'
                  bg='#111214' color='#e0e1e5'
                  p='5px 10px' borderRadius='4px'
                >
                  <IconButton  aria-label='denial-icon' name={user?._id}
                    icon={<GoKebabVertical size='16px' />} boxSize='36px'
                    minW='36px' bg='#2b2d31' color='#b5bac1'
                    borderRadius='50%'
                    _hover={{ bg: '#2b2d31', color: '#dadde0' }}
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
        ))}
      </Box>
    </>
  )
}

export default Online