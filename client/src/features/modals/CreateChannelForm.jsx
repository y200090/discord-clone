import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Switch, Text, Icon, Checkbox, ModalOverlay, Avatar } from '@chakra-ui/react'
import { css } from '@emotion/react'
import React, { useEffect, useState } from 'react'
import { BiHash } from 'react-icons/bi'
import { IoMdLock } from 'react-icons/io'
import { HiSpeakerWave } from 'react-icons/hi2'
import { useCreateChannelMutation } from '../../redux/apis/channelApi'
import { useNavigate } from 'react-router-dom'
import { FaDiscord, FaLock } from 'react-icons/fa'

const CreateChannelForm = (props) => {
  const { isOpen, onClose, arisingFrom, server, currentUserId } = props;
  const navigate = useNavigate();
  const [ CreateChannel ] = useCreateChannelMutation();
  const [ channelName, setChannelName ] = useState('');
  const [ category, setCategory ] = useState('テキストチャンネル');
  const [ privateChannel, setPrivateChannel ] = useState(false);
  const [ progress, setProgress ] = useState(0);
  const [ allowedUserIds, setAllowedUserIds] = useState([currentUserId]);

  useEffect(() => {
    return () => {
      setChannelName('');
      setCategory('テキストチャンネル');
      setPrivateChannel(false);
      setProgress(0);
      setAllowedUserIds([currentUserId]);
    };
  }, [isOpen]);

  const changeSelectUser = (e) => {
    if (!e.target.checked) {
      setAllowedUserIds(
        allowedUserIds.filter((userId) => (userId !== e.target.id))
      );

    } else {
      setAllowedUserIds([...allowedUserIds, e.target.id]);
    }
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();

    try {
      let memberIds;
      if (!privateChannel) {
        memberIds = server.members.map((member) => {
          return member._id
        });
      }

      const newChannel = await CreateChannel({ 
        channelName, 
        serverId: server._id, 
        category, 
        privateChannel, 
        allowedUsers: privateChannel ? allowedUserIds : memberIds
      }).unwrap();

      console.log(newChannel);
      onClose();
      navigate(`/channels/${server._id}/${newChannel._id}`);
      
    } catch (err) {
      console.log(err?.data);

    } finally {
      setChannelName('');
      setCategory('テキストチャンネル');
      setPrivateChannel(false);
      setProgress(0);
      setAllowedUserIds([currentUserId]);
    }
  };  

  const CheckFieldItems = [
    {
      value: 'テキストチャンネル',
      icon: BiHash,
      title: 'Text', 
      description: 'メッセージや画像、GIF、絵文字、意見、ダジャレを送れます',
    }, 
    {
      value: 'ボイスチャンネル',
      icon: HiSpeakerWave,
      title: 'Voice',
      description: 'ボイス、ビデオ、画面共有で楽しめます',
    }
  ];
  
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior='inside'>
        <ModalOverlay bg='rgba(7, 8, 8, 0.85)' />

        <ModalContent maxH='720px' w='460px' maxW='100%' m='0' bg='#313338' borderRadius='12px'>

          <Box display={progress !== 0 && 'none'}>
            <ModalHeader p='16px'>
              <Box m='4px 0'>
                <Heading fontWeight='500' fontSize='20px' lineHeight='24px' color='#f2f3f5'>
                  チャンネルを作成
                </Heading>
                <Text fontSize='12px' lineHeight='16px' fontWeight='400' color='#b5bac1'>
                  {arisingFrom}
                </Text>
              </Box>
            </ModalHeader>
            
            <ModalCloseButton size='24px' m='15px 5px 0 0' color='#73767d'
              _hover={{ bg: 'transparent', color: '#dbdee1' }}
              onClick={onClose}
            />

            <ModalBody maxH='680px' p='0 16px'>
              <form onSubmit={handleCreateChannel} id='createChannel'>
                <FormControl mb='20px'>
                  <FormLabel 
                    m='0 0 8px 0' color='#b5bac1'
                    fontSize='12px' lineHeight='16px' fontWeight='700'
                  >
                    チャンネルの種類
                  </FormLabel>

                  {CheckFieldItems.map((CheckFieldItem, index) => (
                    <Checkbox key={CheckFieldItem.title}
                      isChecked={category === CheckFieldItem.value}
                      value={CheckFieldItem.value}
                      w='100%' p='10px 12px' mb={index === 0 && '8px'}
                      bg={category === CheckFieldItem.value ? '#43444b' : '#2b2d31'}
                      borderRadius='3px'
                      flexDirection='row-reverse'
                      justifyContent='space-between' gridGap='8px'
                      _hover={{
                        bg: category !== CheckFieldItem.value && '#393c41',
                        'span:last-of-type': {
                          'div > div': {
                            svg: {
                              color: category !== CheckFieldItem.value && '#9a9da1',
                              outlineColor: category !== CheckFieldItem.value && '#393c41'
                            }
                          }
                        }
                      }}
                      css={css`
                        span:last-of-type {
                          margin: 0;
                        }
                        span:first-of-type {
                          border-color: #f2f3f5;
                          border-radius: 100%;
                          height: 20px;
                          width: 20px;
                        }
                        span:first-of-type[data-checked] {
                          background-color: transparent;
                          div {
                            height: 10px !important;
                            width: 10px !important;
                            border-radius: 100%;
                            background-color: #f2f3f5;
                            svg {
                              display: none !important;
                            }
                          }
                        }
                      `}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <Flex align='center' mr='8px'>
                        <Box position='relative'>
                          <Icon as={CheckFieldItem.icon} boxSize='22px' mr='12px' color='#acadb1' />
                          {privateChannel && (
                            <Icon as={FaLock} boxSize='8px' 
                              position='absolute' top='10%' left='14px' 
                              color='#acadb1' 
                              bg={category === CheckFieldItem.value 
                                ? '2px solid #43444b' 
                                : '2px solid #2b2d31'
                              }
                              outline={category === CheckFieldItem.value 
                                ? '2px solid #43444b' 
                                : '2px solid #2b2d31'
                              }
                            />
                          )}
                        </Box>
                        <Box>
                          <Text fontWeight='500' fontSize='16px' lineHeight='20px' color='#dbdee1'>
                            {CheckFieldItem.title}
                          </Text>
                          <Text mt='4px' fontWeight='400' fontSize='14px' lineHeight='18px' color='#b5bac1'>
                            {CheckFieldItem.description}
                          </Text>
                        </Box>
                      </Flex>
                    </Checkbox>
                  ))}
                </FormControl>
                
                <FormControl mb='20px'>
                  <FormLabel htmlFor='channelName'
                    color='#b5bac1' mb='8px'
                    fontSize='12px' lineHeight='16px' fontWeight='700'
                  >
                    チャンネル名
                  </FormLabel>
                  <InputGroup bg='#1e1f22' borderRadius='3px'>
                    <InputLeftElement flex='1 1 0%'
                      position='relative'
                      justifyContent='flex-start'
                      h='auto' p='0 6px' color='#dbdee1'
                      pointerEvents='none'
                    >
                      <Icon boxSize='18px'
                        as={category === 'テキストチャンネル' ? BiHash : HiSpeakerWave} 
                      />
                      {privateChannel && (
                        <Icon as={FaLock} boxSize='6px' 
                          position='absolute' top='12px' left='17px' 
                          color='#dbdee1' 
                          outline='1px solid #1e1f22' 
                        />
                      )}
                    </InputLeftElement>
                    <Input type='text' id='channelName' value={channelName}
                      h='40px' p='10px 10px 10px 0' color='#dbdee1'
                      border='none' focusBorderColor='transparent'
                      autoComplete='off'
                      placeholder='新チャンネル'
                      css={css`
                        &::placeholder {
                          color: #87898c;
                        }
                      `}
                      onChange={(e) => setChannelName(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl display='flex' flexDirection='column' mb='20px'>
                  <Flex align='center'>
                    <FormLabel flex='1 1 0%'
                      fontSize='16px' lineHeight='24px' fontWeight='500'
                      m='0' color='#e8eaeb' cursor='pointer'
                      display='flex' alignItems='center'
                    >
                      <Icon as={IoMdLock} color='#a5a6a9' mr='3px' />
                      プライベートチャンネル
                    </FormLabel>
                    <Switch
                      onChange={() => setPrivateChannel((prevState) => !prevState)}
                      css={css`
                        span {
                          height: 20px !important;
                          width: 34px !important;
                          background-color: #80848e;
                          display: flex;
                          align-items: center;
                          padding-left: 4px;
                          span {
                            height: 18px !important;
                            width: 18px !important;
                            background-color: #fff;
                          }
                        }
                        span[data-checked] {
                          background-color: #23a55a;
                          span {
                            background-color: #fff;
                          }
                        }
                        span[data-focus-visible] {
                          box-shadow: none;
                        }
                      `}
                  />
                  </Flex>
                  <Heading mt='8px' color='#b5bac1'
                    fontSize='14px' lineHeight='20px' fontWeight='400'
                  >
                    選択したメンバーおよびロールの人のみに、当該チャンネルの閲覧が許可されます。
                  </Heading>
                </FormControl>
              </form>
            </ModalBody>

            <ModalFooter display='flex' justifyContent='flex-end'
              p='16px' bg='#2b2d31' borderRadius='0 0 12px 12px'
            >
              <Button
                h='38px' w='auto' minW='96px' p='2px 16px' bg='transparent'
                _hover={{ bg: 'transparent' }}
                onClick={onClose}
              >
                <Text color='#f4f4f4'
                  fontSize='14px' fontWeight='500' lineHeight='16px'
                  _hover={{ textDecoration: 'underline' }}
                >
                  キャンセル
                </Text>
              </Button>
              <Button type={privateChannel ? 'button' : 'submit'} 
                form='createChannel' isDisabled={!channelName}
                h='38px' w='auto' minW='96px' p='2px 16px'
                bg='#5865f2' color='#f4f4f4' borderRadius='3px'
                fontSize='14px' fontWeight='500' lineHeight='16px'
                _hover={{ bg: '#4752c4' }}
                {...(privateChannel && {
                  onClick: () => setProgress((prevState) => prevState + 1)
                })}
              >
                {privateChannel ? '次へ' : 'チャンネルを作成'}
              </Button>
            </ModalFooter>
          </Box>

          <Box display={progress !== 1 && 'none'}>
            <ModalHeader p='16px'>
              <Box m='4px 0'>
                <Heading fontSize='20px' lineHeight='24px' fontWeight='500' color='#f2f3f5'>
                  メンバーを追加
                </Heading>
                <Flex color='#b5bac1' columnGap='4px'>
                  <Icon as={category === 'テキストチャンネル' ? BiHash : HiSpeakerWave} boxSize='16px' />
                  <Text fontSize='12px' lineHeight='16px' fontWeight='400'>
                    {channelName}
                  </Text>
                </Flex>
              </Box>
            </ModalHeader>

            <ModalCloseButton size='24px' 
              m='15px 5px 0 0' color='#73767d'
              _hover={{ bg: 'transparent', color: '#dbdee1' }}
            />

            <ModalBody h='380px' p='0' display='flex' flexDirection='column'>
              <Box p='0 16px 12px'>
                <Flex mb='8px' p='1px 8px 1px 1px' bg='#2b2d31' border='1px solid #1e1f22' borderRadius='4px'>
                  <Input type='text' id='member'
                    h='30px' maxH='48px' p='0 8px' flex='1 1 0%' m='1px'
                    bg='transparent' color='#dbdee1'
                    fontSize='16px' fontWeight='400' lineHeight='32px'
                    border='transparent'
                    focusBorderColor='transparent'
                    placeholder='例：@clone...'
                    css={css`
                      &::placeholder {
                        color: #949ba4;
                      }
                    `}
                  />
                </Flex>
                <Text fontSize='12px' lineHeight='16px' fontWeight='400' color='#dbdee1'>
                  @を頭につけたメンバー名を入力して個々人を招待してください
                </Text>
              </Box>
              <Box>
                <Text h='32px' p='8px 0 0 16px' color='#dbdee1'
                  fontSize='12px' lineHeight='16px' fontWeight='700'
                >
                  メンバー
                </Text>
                {server?.members?.map((member) => {
                  if (member?._id == currentUserId) return;
                  return (
                    <Flex key={member?._id}
                      align='center' cursor='pointer' m='0 12px'
                      bg='transparent' borderRadius='4px'
                      _hover={{ bg: '#43444b' }}
                    >
                      <FormLabel htmlFor={member?._id} cursor='pointer'
                        h='100%' w='100%' m='0' p='8px 6px'
                        display='flex' flex='1 1 auto' alignItems='center'
                      >
                        <Checkbox id={member?._id} h='18px' w='18px'
                          css={css`
                            span {
                              height: 18px;
                              width: 18px;
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
                          onChange={changeSelectUser}
                        />
                        <Flex align='center' flex='1 1 auto' pl='16px'>
                          <Avatar boxSize='24px' bg={member?.color}
                            {...(member?.photoURL
                              ? {src: member.photoURL}
                              : {icon: <FaDiscord size='16px' />}
                            )}
                          />
                          <Text color='#dbdee1' m='0 4px 0 8px'
                            fontSize='14px' lineHeight='18px' fontWeight='400'
                          >
                            {member?.displayName}
                          </Text>
                          <Text color='#949ba4' ml='4px' flex='1 1 0%'
                            fontSize='14px' lineHeight='18px' fontWeight='400'
                            overflow='hidden' textOverflow='ellipsis' whiteSpace='nowrap'
                          >
                            {member?.tag}
                          </Text>
                        </Flex>
                      </FormLabel>
                    </Flex>
                  )
                })}
              </Box>
            </ModalBody>

            <ModalFooter bg='#2b2d31' borderRadius='0 0 12px 12px'
              p='16px' display='flex' justifyContent='flex-end'
            >
              <Button 
                h='38px' w='auto' minW='96px' p='2px 16px'
                bg='transparent' color='#fff'
                fontSize='14px' lineHeight='16px' fontWeight='500'
                _hover={{ textDecoration: 'underline' }}
                onClick={() => setProgress((prevState) => prevState - 1)}
              >
                戻る
              </Button>
              <Button type='submit' form='createChannel'
                h='38px' w='auto' minW='96px' p='2px 16px'
                bg='#5865f2' color='#fff' borderRadius='3px'
                fontSize='14px' lineHeight='16px' fontWeight='500'
                _hover={{ bg: '#4752c4' }}
              >
                {allowedUserIds?.length > 0 ? 'チャンネルを作成' : 'スキップ'}
              </Button>
            </ModalFooter>
          </Box>

        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateChannelForm