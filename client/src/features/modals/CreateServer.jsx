import { Box, Button, Heading, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, VStack, Icon, Flex, Input, FormControl, FormLabel, Link as ChakraLink, ModalOverlay, FormErrorMessage } from '@chakra-ui/react'
import { AddIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { discordIcon, categories } from '../../assets'
import { MdOutlineArrowForwardIos } from 'react-icons/md'
import { IoMdCamera, IoMdCompass } from 'react-icons/io'
import { useServerCreationMutation } from '../../redux/apis/serverApi';
import { useForm } from 'react-hook-form';
import { BiChevronRight } from 'react-icons/bi';

const CreateServer = ({ isOpen, onClose, currentUser }) => {
  const [ ServerCreation, { 
    isLoading, 
    isSuccess 
  }] = useServerCreationMutation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    }
  } = useForm();
  const [ progress, setProgress ] = useState(0);
  const [ category, setCategory ] = useState('');
  const [ serverName, setServerName ] = useState('');
  const [ photoURL, setPhotoURL ] = useState('');
  const sampleItems = [
    'hTKzmak',
    'https://api.discord-clone/hTKzmak',
    'https://api.discord-clone/as9d8fn',
  ];

  useEffect(() => {
    setServerName(`${currentUser?.displayName}のサーバー`);
  }, [currentUser, category]);

  useEffect(() => {
    return () => {
      setProgress(0);
      setCategory('');
      setServerName('');
      setPhotoURL('');
      reset();
    };
  }, [isOpen]);

  const handleUpload = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCreateServer = async (e) => {
    e.preventDefault();
    
    try {
      const newServer = await ServerCreation({ serverName, photoURL, category, currentUser }).unwrap();
      console.log(newServer);
      onClose();
      setProgress(0);
      navigate(`/channels/${newServer._id}/${newServer.ownedChannels[0]._id}`);
      
    } catch (err) {
      console.log(err?.data);
    }
  };

  const onSubmit = async (data) => {
    console.log(data.invitationLink);
  };
  
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior='inside'>
        <ModalOverlay bg='rgba(7, 8, 8, 0.85)' />

        <ModalContent maxH='720px' w='440px' maxW='100%' m='0' bg='#fff' borderRadius='4px'>

          <Box display={progress !== 0 && 'none'}>
            <ModalHeader p='24px 16px 0'>
              <Heading color='#060607' textAlign='center' fontSize='24px' lineHeight='30px'>
                サーバーを作成
              </Heading>
              <Text textAlign='center' color='#4e5058' fontSize='16px' lineHeight='20px' fontWeight='400' mt='8px'>
                サーバーは、あなたとフレンドが交流する場所です。サーバーを１つ作って会話を始めましょう。
              </Text>
            </ModalHeader>

            <ModalCloseButton size='lg' mr='-4px' color='#a7a8ac'
              _hover={{ bg: 'transparent', color: 'unset' }}
            />

            <ModalBody maxH='330px' mt='24px' p='0 0 8px 16px' overflow='auto'
              css={css`
                &::-webkit-scrollbar {
                  width: 8px;
                }
                &::-webkit-scrollbar-thumb {
                  background-color: #c9cacc;
                  border-radius: 100px;
                  border: 2px solid transparent;
                  background-clip: content-box;
                }
              `}
            >
              <Flex w='100%' pr='8px' direction='column'>
                {categories.map((category, i) => (
                  <Box key={category.type}>
                    <Button h='auto' w='100%' mb='8px' p='0' display='flex' bg='transparent' border='1px solid #e1e2e4' borderRadius='8px'
                      _hover={{ bg: '#ebebed', borderColor: '#d2d3d6' }}
                      onClick={() => {
                        setCategory(category.type);
                        setProgress((prevState) => prevState + 1);
                      }}
                    >
                      <Image src={category.icon} boxSize='48px' m='8px 8px 8px 16px' />
                      <Text color='#313338' overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis' fontWeight='700'>
                        {category.type}
                      </Text>
                      <Icon as={MdOutlineArrowForwardIos} color='#313338' h='20px' w='20px' m='0 16px 0 auto' />
                    </Button>

                    {i === 0 && (
                      <Text color='#4e5058' 
                        w='100%' m='16px 0 8px'
                        textAlign='start'
                        fontSize='12px' 
                        fontWeight='700' 
                        lineHeight='16px'
                      >
                        テンプレートから始める
                      </Text>
                    )}
                  </Box>
                ))}
              </Flex>
            </ModalBody>

            <ModalFooter p='16px' bg='#f3f4f5' borderRadius='0 0 4px 4px'>
              <VStack w='100%' align='center'>
                <Heading fontSize='20px' lineHeight='24px' fontWeight='600'>
                  もう招待されていますか？
                </Heading>
                <Button w='100%' bg='#6d6f78' color='#fdfdfd' 
                  fontSize='14px' lineHeight='16px' fontWeight='500' 
                  borderRadius='3px'
                  _hover={{ backgroundColor: '#4e5058' }}
                  onClick={() => setProgress((prevState) => prevState - 1)}
                >
                  サーバーに参加
                </Button>
              </VStack>
            </ModalFooter>
          </Box>

          <Box display={progress !== 1 && 'none'}>
            <ModalHeader p='24px 24px 0'>
              <Heading color='#060607' textAlign='center' fontSize='24px' lineHeight='30px'>
                サーバーをカスタマイズ
              </Heading>
              <Text textAlign='center' color='#4e5058' fontSize='16px' lineHeight='20px' fontWeight='400' mt='8px'>
                新しいサーバーの名前とアイコンを設定して、個性を出しましょう。設定内容は後から変更できます。
              </Text>
            </ModalHeader>

            <ModalCloseButton size='lg' mr='-4px' color='#a7a8ac'
              _hover={{ bg: 'transparent', color: 'unset' }}
            />

            <ModalBody maxH='330px' m='16px 0' p='4px 16px 0' display='flex' flexDirection='column'>
              <form onSubmit={handleCreateServer} id='createServer'>
                <FormControl w='100%' display='flex' justifyContent='center'>
                  {!photoURL 
                    ? <PhotoUploadCircle htmlFor='photoUpload'>
                        <AddIcon position='absolute' top='0' right='2px' boxSize='24px' borderRadius='100%' p='6px' bg='#5865f2' color='#eaecfd' outline='6px solid #fff' />

                        <Icon as={IoMdCamera} boxSize='24px' color='#4e5058' />

                        <Text textTransform='uppercase' fontSize='11px' fontWeight='800' lineHeight='14px' color='#4e5058'>
                          Upload
                        </Text>
                      </PhotoUploadCircle>
                    : <FormLabel htmlFor='photoUpload' m='0' cursor='pointer'>
                        <Image boxSize='80px' src={photoURL} fallbackSrc={discordIcon} borderRadius='100%' />
                      </FormLabel>
                  }
                  <Input type='file' id='photoUpload' display='none' onChange={handleUpload} />
                </FormControl>

                <FormControl mt='24px' w='100%'>
                  <FormLabel htmlFor='serverName' color='#4e5058' fontSize='12px' lineHeight='16px' fontWeight='700' mb='8px'>
                    サーバー名
                  </FormLabel>
                  <Input type='text' id='serverName' 
                    value={serverName} 
                    h='40px' w='100%' bg='#e3e5e8' p='10px' 
                    borderRadius='3px' fontWeight='400' border='none' 
                    focusBorderColor='transparent' 
                    onChange={(e) => setServerName(e.target.value)} 
                  />
                </FormControl>

                <Box mt='8px' pb='4px'>
                  <Text fontSize='12px' fontWeight='400' lineHeight='16px' color='#5c5e66'>
                    サーバーを作成すると、Discordの
                    <ChakraLink as={RouterLink} to='/guidelines' isExternal color='#006ce7' fontWeight='600'>
                      コミュニティガイドライン
                    </ChakraLink>
                    に同意したことになります。
                  </Text>
                </Box>
              </form>
            </ModalBody>

            <ModalFooter display='flex' p='16px' bg='#f3f4f5' borderRadius='0 0 4px 4px' alignItems='center' justifyContent='space-between'>
              <Button h='auto' w='auto' p='2px 4px' 
                bg='transparent' color='currentcolor' 
                fontSize='14px' fontWeight='500' lineHeight='16px'
                _hover={{ bg: 'transparent' }}
                onClick={() => {
                  setPhotoURL('');
                  setProgress((prevState) => prevState - 1);
                }}
              >
                戻る
              </Button>

              <Button type='submit' form='createServer' 
              h='38px' w='96px' p='2px 16px' 
              bg='#5865f2' color='#edeffe' borderRadius='3px' fontSize='14px' fontWeight='500' lineHeight='16px' 
              isLoading={isLoading} 
              _hover={{ bg: '#4752c4' }}>
                新規作成
              </Button>
            </ModalFooter>
          </Box>

          <Box display={progress !== -1 && 'none'}>
            <ModalHeader p='16px' cursor='default'>
              <Heading as={'h1'} m='24px 0 8px' 
                color='#060607' textAlign='center'
                fontSize='24px' lineHeight='30px' fontWeight='700'
              >
                サーバーに参加
              </Heading>
              <Text
                fontSize='14px' fontWeight='400' lineHeight='18px'
              >
                既存のサーバーに加入するには、以下の招待を入力してください
              </Text>
            </ModalHeader>

            <ModalCloseButton size='lg' mr='-4px' color='#a7a8ac'
              _hover={{ bg: 'transparent', color: 'unset' }}
            />

            <ModalBody p='0 16px'>
              <form onSubmit={handleSubmit(onSubmit)} id='joinServer'>
                <FormControl mb='16px' isInvalid={errors.invitationLink}>
                  <Text color={errors.invitationLink ? '#dd484d' : '#4e5058'}
                    mb='8px' cursor='default'
                    fontSize='12px' lineHeight='16px' fontWeight='700'
                  >
                    招待リンク
                    <WarningStar>
                      {errors.invitationLink
                        ? (
                          <FormErrorMessage as={'span'} 
                            display='inline-block' m='0'
                            fontSize='12px' fontWeight='500'
                          >
                            - {errors.invitationLink.message}
                          </FormErrorMessage>
                        )
                        : '*'
                      }
                    </WarningStar>
                  </Text>
                  <Input type='text' id='invitationLink'
                    h='40px' p='10px' w='100%'
                    borderRadius='4px' bg='#e3e5e8'
                    borderColor='transparent'
                    focusBorderColor='transparent'
                    errorBorderColor='transparent'
                    fontSize='16px' fontWeight='500' color='#4d4f54'
                    placeholder='https://api.discord-clone/qw0n398y0f'
                    css={css`
                      &::placeholder {
                        color: #4d4f54;
                      }
                    `}
                    {...register('invitationLink', {
                      required: '有効な招待リンクもしくは招待コードを入力してください。',
                    })}
                  />
                </FormControl>
              </form>
              <Box mb='16px' cursor='default'>
                <Text color='#4e5058' mb='8px'
                  fontSize='12px' lineHeight='16px' fontWeight='700'
                >
                  招待はこのような形です
                </Text>
                {sampleItems.map((item) => (
                  <Box key={item}
                    fontSize='14px' lineHeight='18px' color='#6b6b6b'
                  >
                    {item}
                  </Box>
                ))}
              </Box>
              <ChakraLink as={RouterLink} to='/guild-discovery'
                _hover={{ textDecoration: 'none' }}
              >
                <Flex 
                  align='center' bg='#f2f3f5'
                  p='12px' mb='16px' borderRadius='8px'
                  _hover={{ bg: '#eaebed' }}
                >
                  <Icon as={IoMdCompass} boxSize='40px'
                    mr='12px' p='8px' borderRadius='100%'
                    bg='#3ba55c' color='#fff'
                  />
                  <Box>
                    <Heading color='#060607'
                      fontSize='16px' fontWeight='600' lineHeight='20px'
                      overflow='hidden' textOverflow='ellipsis'
                    >
                      招待をお持ちでない場合
                    </Heading>
                    <Text color='#313338'
                      overflow='hidden' textOverflow='ellipsis'
                      fontSize='12px' lineHeight='16px' fontWeight='400'
                    >
                      サーバー発見の公開コミュニティをチェックしましょう。
                    </Text>
                  </Box>
                  <Icon as={BiChevronRight} boxSize='30px' 
                    m='0 6px 0 auto' color='#4f5660'
                    transform='translateX(-6px)'
                  />
                </Flex>
              </ChakraLink>
            </ModalBody>

            <ModalFooter display='flex' 
              alignItems='center' justifyContent='space-between'
              p='16px' boxShadow='inset 0 1px 0 #f6f6f7'
              bg='#f2f3f5' borderRadius='0 0 4px 4px'
            >
              <Button
                h='auto' w='auto' p='2px 4px'
                bg='transparent'
                fontSize='14px' lineHeight='16px' fontWeight='500'
                _hover={{ textDecoration: 'underline' }}
                onClick={() => setProgress((prevState) => prevState + 1)}
              >
                戻る
              </Button>
              <Button type='submit' form='joinServer'
                h='38px' minH='38px' w='auto' minW='96px'
                bg='#5865f2' color='#fff' borderRadius='3px'
                fontSize='14px' lineHeight='16px' fontWeight='500'
                _hover={{ bg: '#4752c4' }}
                isLoading={isSubmitting}
              >
                サーバーに参加する
              </Button>
            </ModalFooter>
          </Box>

        </ModalContent>
      </Modal>
    </>
  )
};

const PhotoUploadCircle = styled.label`
  position: relative;
  height: 80px;
  width: 80px;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='100' ry='100' stroke='%234E5058FF' stroke-width='3.5' stroke-dasharray='9' stroke-dashoffset='100' stroke-linecap='butt'/%3e%3c/svg%3e");
  border-radius: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const WarningStar = styled.span`
  color: #dd484d;
  margin-left: 4px;
`;

export default CreateServer