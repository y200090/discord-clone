import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Switch, Text, Icon, Checkbox, ModalOverlay } from '@chakra-ui/react'
import { css } from '@emotion/react'
import React, { useState } from 'react'
import { BiHash } from 'react-icons/bi'
import { IoMdLock } from 'react-icons/io'
import { HiSpeakerWave } from 'react-icons/hi2'
import { useChannelCreationMutation } from '../redux/apis/channelApi'
import { useNavigate } from 'react-router-dom'

const CreateChannel = (props) => {
  const { isOpen, onClose, serverId } = props;
  const [ channelName, setChannelName ] = useState('');
  const [ category, setCategory ] = useState('テキストチャンネル');
  const [ privateChannel, setPrivateChannel ] = useState(false);
  const [ ChannelCreation ] = useChannelCreationMutation();
  const navigate = useNavigate();

  const handoleCreateChannel = async (e) => {
    e.preventDefault();

    try {
      const newChannel = await ChannelCreation({ channelName, serverId, category, privateChannel }).unwrap();

      console.log(newChannel);

      navigate(`/channels/${serverId}/${newChannel._id}`);
      
    } catch (err) {
      console.log(err?.data);
    }
  };
  
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior='inside'>
        <ModalOverlay bg='rgba(7, 8, 8, 0.85)' />

        <ModalContent maxH='720px' w='460px' maxW='100%' m='0' bg='#313338' borderRadius='12px'>

          <ModalHeader p='16px'>
            <Box m='4px 0'>
              <Heading fontWeight='500' fontSize='20px' lineHeight='24px' color='#f2f3f5'>
                チャンネルを作成
              </Heading>
              <Text fontSize='12px' lineHeight='16px' fontWeight='400' color='#b5bac1'>
                テキストチャンネル内
              </Text>
            </Box>
          </ModalHeader>
          
          <ModalCloseButton size='24px' m='15px 5px 0 0' color='#73767d'
            _hover={{ bg: 'transparent', color: '#dbdee1' }}
          />

          <ModalBody maxH='680px' p='0 16px'>
            <form onSubmit={handoleCreateChannel} id='createChannel'>
              <FormControl mb='20px'>
                <FormLabel 
                  m='0 0 8px 0' color='#b5bac1'
                  fontSize='12px' lineHeight='16px' fontWeight='700'
                >
                  チャンネルの種類
                </FormLabel>
                
                <Checkbox isChecked={category === 'テキストチャンネル'}
                  value='テキストチャンネル'
                  w='100%' p='10px 12px' mb='8px'
                  bg={category === 'テキストチャンネル' ? '#43444b' : '#2b2d31'}
                  borderRadius='3px'
                  flexDirection='row-reverse'
                  justifyContent='space-between' gridGap='8px'
                  _hover={{
                    bg: category !== 'テキストチャンネル' && '#393c41',
                    'span:last-of-type': {
                      div: {
                        svg: {
                          color: category !== 'テキストチャンネル' && '#9a9da1'
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
                  <Flex align='center' mr='8px' position='relative'>
                    <Icon as={BiHash} boxSize='22px' mr='12px' color='#acadb1' />
                    {/* {privateChannel && (
                      <Icon 
                        as={IoMdLock} 
                        boxSize='10px'
                        position='absolute'
                        top='20px'
                        left='14px'
                        borderRadius='100%'
                        color='#7e8288'
                      />
                    )} */}
                    <Box>
                      <Text fontWeight='500' fontSize='16px' lineHeight='20px' color='#dbdee1'>
                        Text
                      </Text>
                      <Text mt='4px' fontWeight='400' fontSize='14px' lineHeight='18px' color='#b5bac1'>
                        メッセージや画像、GIF、絵文字、意見、ダジャレを送れます
                      </Text>
                    </Box>
                  </Flex>
                </Checkbox>

                <Checkbox isChecked={category === 'ボイスチャンネル'}
                  value='ボイスチャンネル'
                  w='100%' p='10px 12px'
                  bg={category === 'ボイスチャンネル' ? '#43444b' : '#2b2d31'}
                  borderRadius='3px'
                  flexDirection='row-reverse'
                  justifyContent='space-between' gridGap='8px'
                  _hover={{
                    bg: category !== 'ボイスチャンネル' && '#393c41',
                    'span:last-of-type': {
                      div: {
                        svg: {
                          color: category !== 'ボイスチャンネル' && '#9a9da1'
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
                  <Flex align='center' mr='8px' position='relative'>
                    <Icon as={HiSpeakerWave} boxSize='22px' mr='12px' color='#7e8288' />
                    {/* {privateChannel && (
                      <Icon 
                        as={IoMdLock} 
                        boxSize='10px'
                        position='absolute'
                        top='10px'
                        left='14px'
                        borderRadius='100%'
                        color='#7e8288'
                      />
                    )} */}
                    <Box>
                      <Text fontWeight='500' fontSize='16px' lineHeight='20px' color='#dbdee1'>
                        Voice
                      </Text>
                      <Text mt='4px' fontWeight='400' fontSize='14px' lineHeight='18px' color='#b5bac1'>
                        ボイス、ビデオ、画面共有で楽しめます
                      </Text>
                    </Box>
                  </Flex>
                </Checkbox>
              </FormControl>
              
              <FormControl mb='20px'>
                <FormLabel htmlFor='channelName'
                  color='#b5bac1' mb='8px'
                  fontSize='12px'
                  lineHeight='16px'
                  fontWeight='700'
                >
                  チャンネル名
                </FormLabel>
                <InputGroup bg='#1e1f22' borderRadius='3px'>
                  <InputLeftElement flex='1 1 0%'
                    position='relative'
                    justifyContent='flex-start'
                    p='0 6px' color='#dbdee1'
                    pointerEvents='none'
                  >
                    <Icon as={BiHash} boxSize='20px' />
                    {/* {privateChannel && (
                      <Icon 
                        as={IoMdLock} 
                        boxSize='8px'
                        position='absolute'
                        top='10px'
                        right='6px'
                        borderRadius='100%'
                        outline='2px solid #1e1f22'
                      />
                    )} */}
                  </InputLeftElement>
                  <Input type='text' id='channelName' value={channelName}
                    h='40px' p='10px 10px 10px 0' color='#dbdee1'
                    border='none' focusBorderColor='transparent'
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
              _hover={{ backgroundColor: 'transparent' }}
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
              {...(privateChannel && {onClick: () => console.log('next')})}
            >
              {privateChannel ? '次へ' : 'チャンネルを作成'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateChannel