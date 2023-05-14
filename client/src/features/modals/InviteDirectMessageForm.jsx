import { Avatar, AvatarBadge, Box, Button, Checkbox, Flex, FormLabel, Heading, Icon, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalContent, ModalHeader, Text } from '@chakra-ui/react'
import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/slices/userSlice';
import { FaDiscord } from 'react-icons/fa';
import { MdOutlineClose } from 'react-icons/md';
import { useRecieveInvitationFromDirectMessageMutation } from '../../redux/apis/channelApi';

const InviteDirectMessageForm = ({ isOpen, onClose, currentChannel }) => {
  const currentUser = useSelector(selectCurrentUser);
  const allowedUserIds = currentChannel?.allowedUsers?.map((user) => {
    return user?._id;
  });
  const friends = currentUser?.friends?.filter((friend) => {
    return !allowedUserIds?.includes(friend?._id);
  });
  const [ username, setUsername ] = useState('');
  const [ targetUsers, setTargetUsers ] = useState([]);
  const targetUserIds = targetUsers?.map((user) => {
    return user?._id;
  });
  const [ RecieveInvitationFromDirectMessage ] = useRecieveInvitationFromDirectMessageMutation();

  useEffect(() => {
    return () => {
      setUsername('');
      setTargetUsers([]);
    };
  }, [isOpen]);
  
  const handleSearch = (e) => {
    setUsername(e.target.value);
  };

  const changeSelectUser = (e) => {
    const targetUser = friends[e.target.value];
    if (!e.target.checked) {
      setTargetUsers(
        targetUsers.filter((user) => (user._id !== targetUser?._id))
      );

    } else {
      setTargetUsers([...targetUsers, targetUser]);
    }
  };

  const handleInviteDirectMessage = async () => {
    try {
      await RecieveInvitationFromDirectMessage({
        channelId: currentChannel?._id,
        currentUser,
        targetUsers,
      }).unwrap();
      
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior='inside' blockScrollOnMount={false} useInert={false}>
        <ModalContent css={responsiveModal}>
          <ModalHeader flex='0 0 auto' p='16px'>
            <Heading as={'h1'} color='#f2f3f5' cursor='default'
              fontSize='20px' lineHeight='24px' fontWeight='600'
            >
              フレンドを選択してください
            </Heading>
            <Text mt='4px' color='#c4c9ce' cursor='default'
              fontSize='12px' lineHeight='16px' fontWeight='400'
            >
              あと{10 - (currentChannel?.allowedUsers?.length + targetUsers?.length)}人フレンドを追加できます。
            </Text>

            <Flex flex='1 1 auto' mt='20px'>
              <Flex flex='1 1 0%' p='1px' borderRadius='4px' bg='#1e1f22'>
                <InputGroup flex='1 1 auto' alignItems='center'>
                  <InputLeftElement position='relative' h='30px' w='auto'>
                    {targetUsers?.map((selectUser) => (
                      <Button key={selectUser?._id}
                        h='30px' w='auto' p='0 8px' m='1px'
                        bg='#313338' color='#dbdee1'
                        borderRadius='2px'
                        fontSize='16px' lineHeight='32px' fontWeight='400'
                        _hover={{ bg: '#2f3135' }}
                        onClick={() => setTargetUsers(
                          targetUsers.filter((user) => user?._id !== selectUser?._id)
                        )}
                      >
                        {selectUser?.displayName}
                        <Icon as={MdOutlineClose} boxSize='14px' ml='4px' />
                      </Button>
                    ))}
                  </InputLeftElement>
                  <Input type='text' value={username}
                    h='30px' p='0 8px' m='1px'
                    bg='transparent' color='#dbdee1'
                    border='transparent' outline='transparent'
                    focusBorderColor='transparent'
                    fontSize='16px' lineHeight='32px'
                    autoComplete='off'
                    placeholder='フレンドのユーザー名を入力'
                    css={css`
                      &::placeholder {
                        color: #949ba4
                      }
                    `}
                    onChange={handleSearch}
                  />
                </InputGroup>
              </Flex>
              <Button isDisabled={!targetUsers?.length && !username}
                ml='8px' h='32px' minH='32px' w='auto' minW='60px' p='2px 16px'
                borderRadius='3px' bg='#5865f2' color='#fff'
                fontWeight='500' fontSize='14px' lineHeight='16px'
                _hover={{ bg: '#4752c4' }}
                onClick={handleInviteDirectMessage}
              >
                追加
              </Button>
            </Flex>
          </ModalHeader>

          <ModalBody flex='1 1 auto' minH='0px' maxH='190px' p='0 0 14px 0'
            overflow='hidden scroll'
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
              &::-webkit-scrollbar-thumb {
                background-color: #1a1b1e;
              }
            `}
          >
            {friends?.map((friend, index) => {
              return (
                <Box key={friend?._id} p='1px 0' m='0 4px 0 12px'>
                  <FormLabel htmlFor={friend?._id}
                    h='40px' w='100%' p='6px 8px' m='0' cursor='pointer'
                    bg='transparent' borderRadius='3px'
                    display='flex' alignItems='center' flexWrap='nowrap'
                    overflow='hidden' textOverflow='ellipsis' whiteSpace='nowrap'
                    _hover={{ bg: '#393c41' }}
                  >
                    <Avatar boxSize='32px' bg={friend?.color}
                      m='0' flexShrink={0}
                      {...(friend?.photoURL
                        ? {src: friend.photoURL}
                        : {icon: <FaDiscord />}
                      )}
                    >
                      {friend?.online
                        ? <AvatarBadge boxSize='16px' bg='#23a55a' borderColor='#2b2d31' />
                        : (
                          <AvatarBadge boxSize='16px' bg='#80848e' borderColor='#2b2d31'>
                            <Box h='4px' w='4px' bg='#2b2d31' borderRadius='100%' />
                          </AvatarBadge>
                        )
                      }
                    </Avatar>
                    <Flex flex='1 1 auto' align='center' m='0 10px'
                      overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'
                    >
                      <Text mr='4px' color='#dbdee1'
                        fontSize='16px' lineHeight='20px' fontWeight='500'
                      >
                        {friend?.displayName}
                      </Text>
                      <Text as={'span'} color='#949ba4'
                        fontSize='14px' lineHeight='16px' fontWeight='400'
                      >
                        {friend?.tag}
                      </Text>
                    </Flex>
                    <Checkbox id={friend?._id} value={index}
                      isChecked={targetUserIds?.includes(friend?._id)}
                      h='22px' w='22px'
                      css={css`
                        span {
                          height: 22px;
                          width: 22px;
                          border-width: 1px;
                          border-color: #696b74;
                          border-radius: 6px;
                        }
                        span[data-checked] {
                          background-color: transparent;
                          border-color: #949cf7;
                          div > svg {
                            color: #5865f2;
                          }
                        }
                        span[data-checked]:hover {
                          background-color: transparent;
                          border-color: #949cf7;
                        }
                        span[data-focus-visible] {
                          box-shadow: none;
                        }
                      `}
                      onChange={changeSelectUser}
                    />
                  </FormLabel>
                </Box>
              )
            })}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
};

const responsiveModal = css`
  position: absolute;
  top: 44px;
  right: 216px;
  min-height: 200px;
  max-height: 720px;
  max-width: 100%;
  margin: 0;
  flex-direction: column;
  background-color: #313338;
  border-radius: 4px;
  @media screen and (min-width: 440px) {
    height: auto;
    width: 440px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.23);
  }
`;

export default InviteDirectMessageForm