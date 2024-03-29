import { SearchIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Flex, Heading, Icon, Input, InputGroup, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react'
import { BiHash } from 'react-icons/bi'
import { HiSpeakerWave } from 'react-icons/hi2';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/slices/userSlice';
import { FaDiscord, FaLock } from 'react-icons/fa';
import { useCreateInvitationMutation } from '../../redux/apis/serverApi';
import { BsFillExclamationCircleFill } from 'react-icons/bs';

const CreateInvitationForm = (props) => {
  const { isOpen, onClose, channelName, category, privateChannel, server } = props;
  const currentUser = useSelector(selectCurrentUser);
  const memberIds = server?.members?.map((member) => {
    return member?._id;
  });
  const unparticipatingFriends = currentUser?.friends?.filter((friend) => {
    return !memberIds?.includes(friend?._id);
  });
  const [ CreateInvitation, { 
    data, isLoading, isSuccess, reset 
  } ] = useCreateInvitationMutation();
  const [ targetUserIds, setTargetUserIds ] = useState([]);
  const [ isCopyComplete, setIsCopyComplete ] = useState(false);
  const param = `${import.meta.env.VITE_API_URL}/server/join/${server?.invitationLink}`;

  const copyTextToClipboard = async () => {
    setIsCopyComplete((prevState) => !prevState);
    await navigator.clipboard.writeText(param);
    setTimeout(() => {
      setIsCopyComplete((prevState) => !prevState);
    }, 800);
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
            boxShadow={!privateChannel && unparticipatingFriends?.length && '0 1px 0 0 #222328'}
          >
            <Box>
              <Heading color='#f2f3f5' mb='4px'
                fontSize='16px' lineHeight='20px' fontWeight='500'
                cursor='default'
              >
                フレンドを<strong>{server?.title}</strong>に招待する
              </Heading>
              <Flex align='center' justify='flex-start'
                mb='6px' color='#b5bac1'
              >
                <Box h='23px' position='relative'>
                  <Icon 
                    as={category === 'テキストチャンネル' ? BiHash : HiSpeakerWave} boxSize='23px' m='3.5px 8px 0.5px 0'
                  />
                  {privateChannel &&
                    <Icon as={FaLock} boxSize='7px'
                      position='absolute' top='6px' left='14px' 
                      bg='#313338' outline='2px solid #313338'
                    />
                  }
                </Box>
                <Text display='inline-block'
                  fontSize='16px' lineHeight='20px' fontWeight='400'
                >
                  {channelName}
                </Text>
              </Flex>
              {privateChannel
                ? <>
                  <Flex align='center'>
                    <Icon as={BsFillExclamationCircleFill}
                      boxSize='12px' mr='8px' color='#f0b132'
                    />
                    <Text color='#b5bac1'
                      fontSize='12px' fontWeight='400' lineHeight='16px'
                    >
                      このチャンネルはプライベートです。選ばれたメンバーだけがこのチャンネルを見ることができます。
                    </Text>
                  </Flex>
                </>
                : (
                  <Flex m='12px 0 8px 0' p='4px' borderRadius='4px' bg='#1e1f22'>
                    <InputGroup display='flex' alignItems='center' flex='1 1 auto' p='1px'>
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
                )
              }
            </Box>
          </ModalHeader>

          <ModalCloseButton size='24px' 
            top='14px' right='14px' m='0' color='#73767d'
            _hover={{ bg: 'transparent', color: '#dbdee1' }}
            onClick={onClose}
          />

          <ModalBody maxH='200px' p='8px 0 16px 12px' flex='1 1 auto'
            display={(privateChannel || !unparticipatingFriends?.length) && 'none'}
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
            {unparticipatingFriends?.map((friend) => (
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
                    overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'
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
                      ? '送信済み' : '招待'
                    )
                  }
                </Button>
              </Flex>
            ))}
          </ModalBody>

          <ModalFooter flex='0 0 auto' zIndex={1}
            p={privateChannel ? '0 16px 20px' : '16px'} 
            boxShadow={!privateChannel && unparticipatingFriends?.length && 'inset 0 1px 0 #2e2f33'}
          >
            <Flex direction='column' w='100%'>
              {privateChannel
                ? <>
                  <Text color='#c4c9ce' mb='12px'
                    fontSize='14px' lineHeight='18px' fontWeight='400'
                  >
                    フレンドがあなたのサーバーにアクセスできるように、このリンクをフレンドと共有しましょう。
                  </Text>
                </>
                : <>
                  <Text color='#b5bac1' mb='8px'
                    fontSize='12px' lineHeight='16px' fontWeight='700'
                  >
                    または、フレンドにサーバー招待リンクを送る。
                  </Text>
                </>
              }
              <Flex align='center' justify='center'
                w='100%' borderRadius='3px' bg='#1e1f22'
              >
                <Input type='text' id='invitationURL' 
                  isReadOnly value={param}
                  flexGrow={1} h='40px' w='auto' p='10px' 
                  border='transparent' bg='transparent' color='#dbdee1'
                  fontSize='16px' fontWeight='400'
                />
                <Button
                  h='32px' minH='32px' w='75px' minW='60px' 
                  display='block' p='2px 16px' mr='4px'
                  bg={isCopyComplete ? '#248046' : '#5865f2'} 
                  color='#fff' borderRadius='3px'
                  fontSize='14px' lineHeight='16px' fontWeight='500'
                  overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'
                  _hover={{ bg: isCopyComplete ? '#1a6334' : '#4752c4' }}
                  onClick={copyTextToClipboard}
                >
                  {isCopyComplete ? 'コピーしました' : 'コピー'}
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