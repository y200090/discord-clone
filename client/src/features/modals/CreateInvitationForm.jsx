import { SearchIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Flex, Heading, Icon, Input, InputGroup, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react'
import { BiHash } from 'react-icons/bi'
import { HiSpeakerWave } from 'react-icons/hi2';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/slices/userSlice';
import { FaDiscord } from 'react-icons/fa';
import { useCreateInvitationMutation } from '../../redux/apis/serverApi';
import { useGetInvitationInfoQuery } from '../../redux/apis/invitationApi';

const CreateInvitationForm = (props) => {
  const { isOpen, onClose, channelName, category, server } = props;
  const currentUser = useSelector(selectCurrentUser);
  const [ CreateInvitation, { 
    data, isLoading, isSuccess, reset 
  } ] = useCreateInvitationMutation();
  // const { data: invitation } = useGetInvitationInfoQuery({
  //   serverId: server?._id,
  //   userId: currentUser?._id,
  // }, {
  //   skip: !isOpen,
  // });
  const [ targetUserIds, setTargetUserIds ] = useState([]);

  const param = `http://localhost:8000/server/join/${server?.invitationLink}`;

  const copyTextToClipboard = async () => {
    await navigator.clipboard.writeText(param);
  };

  const handleInvitation = async (e) => {
    const friendId = e.currentTarget.id;
    try {
      await CreateInvitation({
        link: param,
        currentUserId: currentUser?._id,
        friendId: friendId,
      });

      setTargetUserIds([...targetUserIds, friendId]);
      
    } catch (err) {
      console.log(err);
    }
  };
  
  useEffect(() => {
    return () => {
      setTargetUserIds([]);
      reset();
    };
  }, [isOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior='inside'>
        <ModalOverlay bg='rgba(7, 8, 8, 0.85)' />

        <ModalContent
          minH='144px' maxH='645px' w='440px' maxW='100%'
          borderRadius='4px' bg='#313338'
          display='flex' flexDirection='column'
        >
          <ModalHeader flex='0 0 auto' p='16px'
            boxShadow='0 1px 0 0 #222328'
          >
            <Box>
              <Heading color='#f2f3f5' mb='4px'
                fontSize='16px' lineHeight='20px' fontWeight='500'
                cursor='default'
              >
                フレンドを<strong>{server?.title}</strong>に招待する
              </Heading>
              <Flex align='center' justify='flex-start'
                mb='4px' color='#b5bac1'
              >
                <Icon 
                  as={category === 'テキストチャンネル' ? BiHash : HiSpeakerWave} boxSize='23px' m='3.5px 8px 0.5px 0'
                />
                <Text display='inline-block'
                  fontSize='16px' lineHeight='20px' fontWeight='400'
                >
                  {channelName}
                </Text>
              </Flex>
              <Flex m='12px 0 8px 0' p='4px' borderRadius='4px' bg='#1e1f22'>
                <InputGroup 
                  display='flex' alignItems='center'
                  flex='1 1 auto' p='1px'
                >
                  <Input type='text' id='user-search'
                    flex='1 1 0%' h='20px' m='1px' p='0 4px'
                    fontSize='14px' lineHeight='20px' fontWeight='500'
                    border='transparent' bg='transparent'
                    focusBorderColor='transparent'
                    placeholder='友達を検索' color='#dbdee1'
                    css={css`
                      &::placeholder {
                        color: #949ba4;
                      }
                    `}
                  />
                  <SearchIcon color='#b5bac1' boxSize='14px' m='4px' />
                </InputGroup>
              </Flex>
            </Box>
          </ModalHeader>

          <ModalCloseButton size='24px' 
            top='14px' right='14px'
            m='0' color='#73767d'
            _hover={{ bg: 'transparent', color: '#dbdee1' }}
            onClick={onClose}
          />

          <ModalBody maxH='200px' p='8px 0 16px 12px' 
            display='1 1 auto'
            overflow='hidden scroll'
            css={css`
              &::-webkit-scrollbar {
                width: 8px;
              }
              &::-webkit-scrollbar-thumb {
                background-color: #1a1b1e;
                border-radius: 100px;
                border: 2px solid transparent;
                background-clip: content-box;
              }
            `}
          >
            {currentUser?.friends?.map((friend) => (
              <Flex key={friend?._id}
                align='center' justify='space-between'
                h='44px' w='100%' p='7px 6px 7px 8px'
                borderRadius='3px' bg='transparent'
                _hover={{ 
                  bg: '#393c41', 
                  button: {
                    bg: targetUserIds.includes(friend?._id)
                      ? 'transparent'
                      : '#248046',
                    borderColor: targetUserIds.includes(friend?._id) 
                      ? 'transparent'
                      : '#248046',
                  }
                }}
              >
                <Flex align='center' mr='4px' cursor='default'>
                  <Avatar boxSize='32px' 
                    flex='0 0 auto' mr='10px'
                    {...(friend?.photoURL
                      ? {src: friend?.photoURL}
                      : {
                        icon: <FaDiscord />,
                        bg: friend?.color,
                      }
                    )}
                  />
                  <Box color='#f9f9f9'
                    overflow='hidden' 
                    whiteSpace='nowrap' 
                    textOverflow='ellipsis'
                    fontSize='16px' fontWeight='400' lineHeight='20px'
                  >
                    {friend?.displayName}
                  </Box>
                </Flex>
                <Button flex='0 0 auto' id={friend?._id}
                  h='32px' minH='32px' w='auto' minW='60px'
                  bg='transparent' color='#fff'
                  border={targetUserIds.includes(friend?._id) ? 'transparent' : '1px solid #23a559'} 
                  borderRadius='3px'
                  fontSize='14px' lineHeight='16px' fontWeight='500'
                  _hover={{
                    bg: targetUserIds.includes(friend?._id) 
                      ? 'transparent !important' 
                      : '#1a6334 !important', 
                    borderColor: targetUserIds.includes(friend?._id) 
                      ? 'transparent !important' 
                      : '#1a6334 !important', 
                  }}
                  onClick={handleInvitation}
                  isLoading={!targetUserIds.includes(friend?._id) && data?.targetUserId == friend?._id && isLoading}
                  isDisabled={targetUserIds.includes(friend?._id) || data?.targetUserId == friend?._id}
                >
                  {isSuccess
                    ? (targetUserIds.includes(friend?._id)
                      ? '送信済み' : '招待'
                    )
                    : (targetUserIds.includes(friend?._id)
                      ? '送信済み'
                      : '招待'
                    )
                  }
                </Button>
              </Flex>
            ))}
          </ModalBody>
          <ModalFooter
            flex='0 0 auto' p='16px' zIndex={1}
            boxShadow='inset 0 1px 0 #2e2f33'
          >
            <Flex direction='column' w='100%'>
              <Text color='#b5bac1' mb='8px'
                fontSize='12px' lineHeight='16px' fontWeight='700'
              >
                または、フレンドにサーバー招待リンクを送る。
              </Text>
              <Flex align='center' justify='center'
                w='100%' borderRadius='3px' bg='#1e1f22'
              >
                <Input type='text' id='invitationURL' 
                  isReadOnly value={param}
                  flexGrow={1} h='40px' w='100%' p='10px' 
                  border='transparent' bg='transparent' color='#dbdee1'
                  fontSize='16px' fontWeight='400'
                />
                <Button
                  h='32px' minH='32px' w='75px' minW='60px' mr='4px'
                  bg='#5865f2' color='#fff' borderRadius='3px'
                  fontSize='14px' lineHeight='16px' fontWeight='500'
                  _hover={{ bg: '#4752c4' }}
                  onClick={copyTextToClipboard}
                >
                  コピー
                </Button>
              </Flex>
              {/* <Text color='#b5bac1' mt='8px'
                fontSize='12px' lineHeight='16px' fontWeight='400'
              >
                招待リンクは7日後に期限切れになります。
              </Text> */}
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateInvitationForm