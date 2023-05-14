import { Avatar, AvatarBadge, Box, Button, Checkbox, Flex, FormLabel, Heading, IconButton, Input, Modal, ModalContent, Text } from '@chakra-ui/react'
import { css } from '@emotion/react';
import React, { useState } from 'react'
import { FaDiscord } from 'react-icons/fa';
import { SlClose } from 'react-icons/sl';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAddDirectMessageMutation, useCreateGroupDirectMessageMutation } from '../../redux/apis/channelApi';
import { selectCurrentUser } from '../../redux/slices/userSlice';

const AddDirectMessageForm = ({ isOpen, onClose }) => {
  const currentUser = useSelector(selectCurrentUser);
  const friends = currentUser?.friends;
  const [ AddDirectMessage ] = useAddDirectMessageMutation();
  const [ CreateGroupDirectMessage ] = useCreateGroupDirectMessageMutation()
  const navigate = useNavigate();
  const [ targetUsers, setTargetUsers ] = useState([]);

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

  const handleDirectMessageAction = async (e) => {
    e.preventDefault();

    try {
      let channel;
      if (targetUsers.length >= 2) {
        channel = await CreateGroupDirectMessage({
          currentUser,
          targetUsers
        }).unwrap();

      } else {
        channel = await AddDirectMessage({
          currentUserId: currentUser._id,
          friendId: targetUsers[0]._id
        }).unwrap();
      }

      setTargetUsers([]);
      onClose();
      navigate(`/channels/@me/${channel?._id}`);
      
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior='inside' blockScrollOnMount={false} useInert={false}>
        <ModalContent css={responsiveModal}>
          <IconButton aria-label='close-button'
            icon={<SlClose size='28px' />} size='28px'
            position='absolute' top='16px' right='16px'
            bg='transparent' color='#b1b5bc' zIndex={100}
            _hover={{
              color: '#dbdee1',
              bg: 'transparent',
              '& + span': {
                color: '#dbdee1'
              }
            }}
            onClick={onClose}
            display='none'
            css={css`
              @media screen and (max-width: 440px) {
                display: block;
              }
            `}
          />
          
          <Flex direction='column' flex='0 0 auto' p='16px' zIndex={1}>
            <Heading color='#f2f3f5'
              fontSize='20px' lineHeight='24px' fontWeight='600'
            >
              フレンドを選択してください
            </Heading>
            <Text color='#c4c9ce' mt='4px'
              fontSize='12px' lineHeight='16px' fontWeight='400'
            >
              フレンドを追加できます。
            </Text>
            <Box flex='1 1 auto' mt='20px' p='1px'>
              <Input type='text' id='userTag'
                h='30px' w='100%' minW='48px' p='0 8px' m='1px'
                bg='#1e1f22' color='#dbdee1'
                border='none' focusBorderColor='transparent'
                fontSize='16px' lineHeight='32px'
                borderRadius='4px'
                placeholder='フレンドのユーザー名を入力'
                autoComplete='off'
                css={css`
                  &::placeholder {
                    color: #949ba4
                  }
                `}
              />
            </Box>
          </Flex>

          <Box flex='1 1 auto' overflow='scroll' 
            maxH='190px' w='100%' pb='16px'
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
              &:hover {
                &::-webkit-scrollbar-thumb {
                  background-color: #1a1b1e;
                }
              }
            `}
          >
            {friends?.map((friend, index) => (
              <Flex key={friend?._id}
                m='0 4px 0 12px' p='1px 0' borderRadius='3px'
                _hover={{ bg: '#393c41' }}
              >
                <FormLabel htmlFor={friend?._id}
                  h='40px' w='100%' p='6px 8px' m='0'
                  display='flex' alignItems='center'
                  cursor='pointer'
                >
                  <Avatar boxSize='32px' bg={friend.color}
                    flexShrink='0' m='0'
                    {...(friend.photoURL 
                      ? {src: friend.photoURL}
                      : {icon: <FaDiscord />}
                    )}
                  >
                    <AvatarBadge  boxSize='16px'
                      bg='#23a55a' borderColor='#2b2d31'
                    />
                  </Avatar>

                  <Flex align='center' flex='1 1 auto' m='0 10px'>
                    <Text mr='4px' color='#dbdee1' 
                      fontSize='16px' fontWeight='500' lineHeight='20px'
                    >
                      {friend?.displayName}
                    </Text>
                    <Text color='#8b929b'
                      fontSize='14px' fontWeight='400' lineHeight='1.1'
                    >
                      {friend?.tag}
                    </Text>
                  </Flex>

                  <Checkbox id={friend?._id} value={index} 
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
              </Flex>
            ))}
          </Box>

          <Box h='1px' w='auto' m='0 10px' bg='#36383d' boxShadow='0 -1px 0 #33353a' />

          <Flex flex='1 1 auto' direction='column' p='20px'>
            <Button isDisabled={targetUsers.length === 0}
              h='38px' w='100%' minW='96px' p='2px 16px'
              bg='#5865f2' color='#fff'
              border='none' borderRadius='3px'
              fontSize='14px' lineHeight='16px' fontWeight='500'
              _hover={{ bg: '#4752c4' }}
              onClick={handleDirectMessageAction}
            >
              DMの作成
            </Button>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  )
}

const responsiveModal = css`
  position: absolute;
  top: 142px;
  left: 278px;
  min-height: 200px;
  border-radius: 4px;
  margin: 0;
  background-color: #313338;
  flex-direction: column;
  @media screen and (max-width: 727px) {
    left: calc(100% - 440px); 
  }
  @media screen and (min-width: 440px) {
    height: auto;
    width: 440px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.23);
  }
  @media screen and (max-width: 440px) {
    position: relative;
    top: 0;
    left: 0;
    min-height: 100%;
    border-radius: 0px;
  }
`;

export default AddDirectMessageForm