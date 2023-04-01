import { CloseIcon, SearchIcon } from '@chakra-ui/icons'
import { Avatar, Box, ButtonGroup, Flex, Heading, IconButton, Image, Input, Text, Tooltip } from '@chakra-ui/react'
import { css } from '@emotion/react'
import React, { useState } from 'react'
import { FaDiscord } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { useApprovalPendingMutation, useCancelPendingMutation, useDenialPendingMutation } from '../../redux/apis/friendApi'
import { selectCurrentUser } from '../../redux/slices/authSlice'
import { FiCheck } from 'react-icons/fi'
import { NoPending } from '../../assets'

const Pending = () => {
  const currentUser = useSelector(selectCurrentUser);
  const pendingUsersLength = Object.keys(currentUser).length === 0 
    ? 0 
    : currentUser?.friends?.pending?.length + currentUser?.friends?.waiting?.length;
  const [ ApprovalPending ] = useApprovalPendingMutation();
  const [ DenialPending ] = useDenialPendingMutation();
  const [ CancelPending ] = useCancelPendingMutation();
  const [ username, setUsername ] = useState('');

  const handleApproval = async (e) => {
    e.preventDefault();

    try {
      await ApprovalPending({
        currentUserId: currentUser._id,
        targetUserId: e.currentTarget.name,
      });
      
    } catch (err) {
      console.log(err);
    }
  };

  const handleDenial = async (e) => {
    e.preventDefault();

    try {
      await DenialPending({
        currentUserId: currentUser._id,
        targetUserId: e.currentTarget.name,
      });
      
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = async (e) => {
    e.preventDefault();

    try {
      await CancelPending({
        currentUserId: currentUser._id,
        targetUserId: e.currentTarget.name,
      });
      
    } catch (err) {
      console.log(err);
    }
  };

  if (!pendingUsersLength) {
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
        <Input type='text' id='username'
          value={username}
          h='30px' minW='48px' m='1px' p='0 8px'
          flex='1 1 0%'
          borderColor='transparent'
          focusBorderColor='transparent'
          color='#dbdee1'
          bg='transparent'
          fontSize='16px'
          lineHeight='32px'
          _hover={{
            borderColor: 'transparent'
          }}
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
        <Heading
          m='16px 20px 8px 30px'
          color='#b5bac1'
          fontSize='12px' lineHeight='16px' fontWeight='600'
          overflow='hidden'
          whiteSpace='nowrap'
          textOverflow='ellipsis'
          cursor='default'
        >
          保留中 — {pendingUsersLength}
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
        {[...currentUser?.friends?.pending, ...currentUser?.friends?.waiting]?.map((user, index) => (
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
                  />
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
                    {currentUser?.friends?.pending?.length > index
                      ? 'フレンド申請が届いています'
                      : 'フレンド申請を送信済み'
                    }
                  </Text>
                </Flex>
              </Flex>
              <ButtonGroup columnGap='2px'>
                <Tooltip
                  label='追加する'
                  hasArrow
                  placement='top'
                  bg='#111214'
                  color='#e0e1e5'
                  p='5px 10px'
                  borderRadius='4px'
                >
                  <IconButton aria-label='approval-icon' name={user?._id}
                    icon={<FiCheck size='20px' />} boxSize='36px'
                    minW='36px' bg='#2b2d31' color='#b5bac1'
                    borderRadius='50%'
                    _hover={{ bg: '#2b2d31', color: '#23a559' }}
                    onClick={handleApproval}
                    {...(currentUser?.friends?.pending?.length <= index
                      && {display: 'none'}
                    )}
                  />
                </Tooltip>
                <Tooltip
                  label={currentUser?.friends?.pending?.length > index 
                    ? '無視' 
                    : 'キャンセル'
                  }
                  hasArrow placement='top'
                  bg='#111214' color='#e0e1e5'
                  p='5px 10px' borderRadius='4px'
                >
                  <IconButton  aria-label='denial-icon' name={user?._id}
                    icon={<CloseIcon boxSize='12px' />} boxSize='36px'
                    minW='36px' bg='#2b2d31' color='#b5bac1'
                    borderRadius='50%'
                    _hover={{
                      bg: '#2b2d31',
                      color: '#f23f42'
                    }}
                    onClick={currentUser?.friends?.pending?.length > index 
                      ? handleDenial 
                      : handleCancel
                    }
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

export default Pending