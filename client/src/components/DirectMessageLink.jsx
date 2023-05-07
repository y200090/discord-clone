import { Avatar, AvatarBadge, Box, IconButton, Link as ChakraLink, Text, useDisclosure, AlertDialogOverlay, AlertDialogContent, AlertDialog, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, FormLabel, Checkbox, Button } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { FaDiscord } from 'react-icons/fa'
import { MdClose, MdPeopleAlt } from 'react-icons/md'
import { NavLink, useNavigate } from 'react-router-dom'
import { useRemoveDirectMessageMutation, useWithdrawFromChannelMutation } from '../redux/apis/channelApi' 
import { css } from '@emotion/react'

const DirectMessageLink = ({ directMessage, currentUser }) => {
  const toURL = directMessage?._id;
  const category = directMessage?.category;
  const notifications = directMessage?.notifications.filter((notification) => {
    return notification.recipient === currentUser._id;
  });
  console.log(notifications);
  const allowedUserIds = directMessage?.allowedUsers?.map((user) => {
    return user._id;
  });
  const friends = currentUser?.friends?.filter((friend) => {
    return allowedUserIds.includes(friend._id);
  });
  let photoURL, title, color, status, groupFlag = false;
  if (category === 'ダイレクトメッセージ') {
    photoURL = friends[0].photoURL;
    title = friends[0].displayName;
    color = friends[0].color;
    status = friends[0].online ? 'オンライン' : 'オフライン';

  } else {
    groupFlag = !groupFlag;
    title = directMessage?.title;
    color = directMessage?.color;
    status = `${allowedUserIds?.length}人のメンバー`;
  }
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ RemoveDirectMessage ] = useRemoveDirectMessageMutation();
  const rest = {
    isOpen: isOpen,
    onClose: onClose,
    directMessage: directMessage,
    currentUser: currentUser,
  };
  
  const handleRemove = async (e) => {
    e.preventDefault();

    try {
      await RemoveDirectMessage({
        currentUserId: currentUser?._id,
        directMessageId: directMessage?._id,
      }).unwrap();

      navigate('/channels/@me');
      
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Box as={'li'} w='100%' maxW='224px' p='1px 0' position='relative'>
        <ChakraLink as={NavLink} to={toURL}
          h='42px' minW='0px' p='0 8px' tabIndex={-1}
          display='flex' alignItems='center' justifyContent='start'
          bg='transparent' borderRadius='4px'
          _hover={{ 
            bg: '#35373c', 
            'div > p': {
              color: '#dbdee1'
            },
            'div > span > div': {
              borderColor: '#35373c',
              'div': {
                bg: '#404249'
              }
            },
            button: {
              color: '#aaacb0',
              '&:hover': {
                color: '#dbdee1'
              }
            }
          }}
          _activeLink={{ 
            bg: '#404249', 
            '&:hover': { bg: '#35373c' },
            'div > span > div': {
              borderColor: '#404249',
              'div': {
                bg: '#404249'
              }
            },
            'div > p': {
              color: '#dbdee1'
            },
          }}
        >
          <Box flex='0 0 auto' h='32px' w='32px' mr='12px'>
            <Avatar boxSize='32px' bg={color} position='relative'
              {...(photoURL 
                ? {src: photoURL}
                : (groupFlag 
                  ? {icon: <MdPeopleAlt />}
                  : {icon: <FaDiscord />}
                )
              )}
            >
              {status === 'オンライン'
                ? <AvatarBadge boxSize='16px' bg='#23a55a' borderColor='#2b2d31' />
                : status === 'オフライン' &&
                  <AvatarBadge boxSize='16px' bg='#80848e' borderColor='#2b2d31'>
                    <Box h='4px' w='4px' bg='#2b2d31' borderRadius='100%' />
                  </AvatarBadge>
              }
            </Avatar>
          </Box>

          <Box flex='1 1 auto' minW='0px' color='#949ba4'>
            <Text color={notifications?.length && '#dbdee1'}
              fontSize='16px' lineHeight='20px' fontWeight='500'
              whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'
            >
              {title}
            </Text>
            <Text mt='-2px'
              fontSize='12px' lineHeight='16px' fontWeight='500'
              whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'
            >
              {status}
            </Text>
          </Box>

          {/* <Box display={!notifications.length && 'none'}>
            {notifications.length}
          </Box> */}

          <IconButton aria-label='delete-dm'
            icon={<MdClose size='20px' />} boxSize='20px'
            minW='20px' m='0 1px 0 auto'
            bg='transparent' color='transparent'
            _hover={{ bg: 'transparent' }}
            onClick={groupFlag 
              ? (e) => {
                e.preventDefault();
                onOpen();
              }
              : handleRemove
            }
          />
        </ChakraLink>

        {notifications?.length > 0 &&
          <Box position='absolute' top='50%' left='-8px'
            transform='translateY(-50%)' h='8px' w='4px'
            bg='#f3f4f5' borderRadius='0 4px 4px 0'
          />
        }
      </Box>

      <AlertWindow {...rest} />
    </>
  )
};

const AlertWindow = (props) => {
  const { isOpen, onClose, directMessage, currentUser } = props;
  const [ RemoveDirectMessage ] = useRemoveDirectMessageMutation();
  const [ WithdrawFromChannel ] = useWithdrawFromChannelMutation();
  const navigate = useNavigate();
  const cancelRef = useRef();
  const [ isChecked, setIsChecked ] = useState(false);
  
  const handleWithdrawal = async () => {
    try {
      // await RemoveDirectMessage({
      //   currentUserId: currentUser?._id,
      //   directMessageId: directMessage?._id,
      // }).unwrap();

      await WithdrawFromChannel({
        channelId: directMessage?._id,
        withDrawnUser: currentUser,
        isChecked,
      }).unwrap();

      // await Promise.all([
      //   RemoveDirectMessage({
      //     currentUserId: currentUser?._id,
      //     directMessageId: directMessage?._id,
      //   }).unwrap(),
      //   WithdrawFromChannel({
      //     channelId: directMessage?._id,
      //     currentUserId: currentUser?._id,
      //   }).unwrap(),
      // ]);

      navigate('/channels/@me');
      
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <>
      <AlertDialog isOpen={isOpen} onClose={onClose}
        leastDestructiveRef={cancelRef} isCentered
      >
        <AlertDialogOverlay bg='rgba(7, 8, 8, 0.85)' />

        <AlertDialogContent flexDirection='column'
          maxH='720px' minH='200px' w='440px' maxW='100%'
          bg='#313338' borderRadius='4px'
        >
          <AlertDialogHeader display='flex' alignItems='center'
            flex='0 0 auto' p='16px' 
            wordBreak='break-word' overflow='hidden'
            fontSize='20px' fontWeight='600' lineHeight='24px'
            color='#f2f3f5' cursor='default'
          >
            「{directMessage?.title}」から脱退
          </AlertDialogHeader>

          <AlertDialogBody display='flex' flexDirection='column'
            flex='0 0 auto' minH='0' p='0 16px 20px'
          >
            <Text color='#dbdee1' cursor='default'
              fontSize='16px' lineHeight='20px' fontWeight='400'
            >
              本当に<strong>{directMessage?.title}</strong>から脱退しますか？再度招待されるまで、このグループに参加することはできません。
            </Text>
            <FormLabel htmlFor='nonNotificationSetting' 
              maxW='100%' m='16px 0 0 0'
              display='flex' alignItems='center'
            >
              <Checkbox id='nonNotificationSetting'
                h='24px' w='24px'
                css={css`
                  span {
                    height: 24px;
                    width: 24px;
                    border-width: 1px;
                    border-color: #80848e;
                    border-radius: 6px;
                  }
                  span[data-checked] {
                    background-color: #5865f2;
                    border-color: #7983f5;
                  }
                  span[data-checked]:hover {
                    background-color: #5865f2;
                    border-color: #7983f5;
                  }
                  span[data-focus-visible] {
                    box-shadow: none;
                  }
                `}
                onChange={(e) => setIsChecked(e.target.checked)}
              />

              <Text flex='1 1 auto' cursor='pointer'
                color='#dbdee1' pl='8px'
                fontSize='16px' lineHeight='20px' fontWeight='400'
              >
                他のメンバーに通知せず抜ける
              </Text>
            </FormLabel>
          </AlertDialogBody>

          <AlertDialogFooter display='flex' flex='0 0 auto'
            p='16px' bg='#2b2d31' borderRadius='0 0 4px 4px'
          >
            <Button variant='link' ref={cancelRef}
              h='38px' minH='38px' w='auto' minW='96px' p='2px 16px'
              fontSize='14px' lineHeight='16px' fontWeight='500'
              color='#f4f4f4' bg='transparent'
              onClick={onClose}
            >
              キャンセル
            </Button>
            <Button
              h='38px' minH='38px' w='auto' minW='96px' p='2px 16px'
              fontSize='14px' fontWeight='500' lineHeight='16px'
              color='#f4f4f4' bg='#da373c' borderRadius='3px'
              _hover={{ bg: '#a12828' }}
              onClick={handleWithdrawal}
            >
              グループから脱退する
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
};

export default DirectMessageLink