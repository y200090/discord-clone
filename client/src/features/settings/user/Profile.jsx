import { Avatar, Box, Button, Flex, FormControl, FormLabel, Heading ,Icon, Input, Text, Textarea } from '@chakra-ui/react'
import { css, keyframes } from '@emotion/react';
import React, { useState } from 'react'
import { BsPencilFill } from 'react-icons/bs';
import { FaDiscord } from 'react-icons/fa';
import { FcEngineering } from 'react-icons/fc';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import { useEditUserProfileMutation } from '../../../redux/apis/userApi';
import { socket } from '../../../socket';

const Profile = ({ currentUser }) => {
  const [ photoURL, setPhotoURL ] = useState(currentUser?.photoURL);
  const [ bannerColor, setBannerColor ] = useState(currentUser?.color);
  const [ description, setDescription ] = useState(currentUser?.description);
  const [ isEdit, setIsEdit ] = useState(false);
  const [ EditUserProfile, { isLoading } ] = useEditUserProfileMutation();
  
  const handleUpdate = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result);
        reader.result == currentUser?.photoURL
          ? setIsEdit(false)
          : setIsEdit(true)
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleReflect = async () => {
    try {
      await EditUserProfile({
        currentUserId: currentUser._id,
        newPhotoURL: photoURL,
        newBannerColor: bannerColor,
        newDescription: description
      }).unwrap();

      socket.emit('update_occurred', currentUser);
      setIsEdit(false);

    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <>
      <Box p='60px 10px 80px 40px'>
        <Heading color='#f2f3f5' fontSize='20px' lineHeight='24px' fontWeight='600'>
          プロフィール
        </Heading>

        <Flex pt='6px' m='24px 0 16px' borderBottom='1px solid #3f4147'>
          <Box color='#fff' cursor='default'
            pb='16px' mr='16px' borderBottom='2px solid #949cf7'
            fontSize='16px' lineHeight='20px' fontWeight='500'
            overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'
          >
            ユーザープロフィール
          </Box>
        </Flex>

        <Flex gap='35px'>
          <Flex flex='1 1 0%' direction='column'>
            <Box mb='24px' pb='24px' borderBottom='1px solid #3f4147'>
              <Heading mb='8px' color='#b5bac1'
                fontSize='12px' lineHeight='16px' fontWeight='700'
              >
                アバター
              </Heading>
              <FormLabel htmlFor='profilePhoto' cursor='pointer'
                display='inline-flex' alignItems='center'
                h='32px' w='auto' p='2px 16px'm='0'
                bg='#5865f2' color='#fff' borderRadius='3px'
                fontSize='14px' fontWeight='500' lineHeight='16px' 
                overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'
                _hover={{ bg: '#4752c4' }}
              >
                アバターを変更
              </FormLabel>
            </Box>
            <Box mb='24px' pb='24px' borderBottom='1px solid #3f4147'>
              <Heading mb='8px' color='#b5bac1'
                fontSize='12px' lineHeight='16px' fontWeight='700'
              >
                バナーカラー
              </Heading>
              <FormControl position='relative' display='flex' m='0 0 3px 0'>
                <FormLabel htmlFor='bannerColor' m='0' h='50px' w='70px'>
                  <Box position='relative' cursor='pointer'
                    h='100%' w='100%' borderRadius='4px' bg={bannerColor}
                  >
                    <Icon as={BsPencilFill} boxSize='11px' color='#fff' 
                      position='absolute' top='4px' right='4px'
                    />
                  </Box>
                </FormLabel>
                <Input type='color' id='bannerColor' value={bannerColor}
                  opacity='0' visibility='hidden' 
                  h='0' w='0' mt='-3px' 
                  onChange={(e) => {
                    setBannerColor(e.target.value),
                    e.target.value == currentUser?.color
                      ? setIsEdit(false)
                      : setIsEdit(true)
                  }}
                />
              </FormControl>
            </Box>
            <Box>
              <Heading mb='8px' color='#b5bac1'
                fontSize='12px' lineHeight='16px' fontWeight='700'
              >
                自己紹介
              </Heading>
              <Text color='#b5bac1' mb='16px'
                fontSize='14px' lineHeight='20px' fontWeight='400'
              >
                マークダウンやリンクを使ってもＯＫです。
              </Text>
              <Box position='relative' h='136px' maxH='50vh' w='100%' bg='#1e1f22' borderRadius='3px'>
                <Textarea value={description} resize='none' color='#d6d9dc'
                  h='100%' border='none' p='11px 38px 11px 16px'
                  fontSize='1rem' fontWeight='400' lineHeight='1.375rem'
                  _focus={{ borderColor: 'transparent' }} 
                  _focusVisible={{ 
                    borderColor: 'transparent', 
                    boxShadow: 'none' 
                  }}
                  overflow='hidden scroll'
                  css={css`
                    &::-webkit-scrollbar {
                      width: 12px;
                    }
                    &::-webkit-scrollbar-thumb {
                      background-color: #16171a;
                      border-radius: 100px;
                      border: 4px solid transparent;
                      background-clip: content-box;
                    }
                  `}
                  onChange={(e) => {
                    setDescription(e.target.value),
                    e.target.value == currentUser?.description 
                      ? setIsEdit(false)
                      : setIsEdit(true)
                  }}
                />
                <Flex align='center' position='absolute' bottom='12px' right='14px' h='24px'>
                  <Text color='#bcbec1' fontSize='16px' lineHeight='16px' fontWeight='400'>
                    {190 - description.length}
                  </Text>
                </Flex>
              </Box>
            </Box>
          </Flex>

          <Box maxW='348px'>
            <Text color='#b5bac1'
              mb='8px' fontSize='12px' lineHeight='16px' fontWeight='700'
              overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'
            >
              プレビュー
            </Text>

            {/* プロフィールカード */}
            <Flex direction='column' position='relative'
              maxH='calc(100vh - 28px)' minH='280px' w='340px'
              bg='#232428' borderRadius='8px'
              boxShadow='rgba(0, 0, 0, 0.24) 0px 3px 8px'
              rowGap='22px'
            >
              <Box minH='60px' minW='340px' bg={bannerColor} borderRadius='8px 8px 0 0' />

              <Box h='80px' w='80px'
                position='absolute' top='16px' left='22px' zIndex={1}
                _hover={{
                  div: {
                    display: 'flex'
                  }
                }}
              >
                <Avatar boxSize='80px' outline='6px solid #232428'
                  position='relative' cursor='pointer'
                  {...(photoURL
                    ? {src: photoURL}
                    : {
                      icon: <FaDiscord size='50px' />,
                      bg: bannerColor
                    }
                  )}
                >
                  <Icon as={MdOutlineAddPhotoAlternate} boxSize='28px'
                    position='absolute' top='0' right='0' p='5px'
                    bg='#e3e5e8' color='#74787f' borderRadius='50%' 
                    zIndex={2}
                  />
                </Avatar>
                <FormControl display='none'
                  alignItems='center' justifyContent='center'
                  position='absolute' top='0' left='0' 
                  h='100%' w='100%' borderRadius='50%' 
                  bg='#000' opacity={0.7}
                >
                  <FormLabel htmlFor='profilePhoto' 
                    h='100%' w='100%' m='0' color='#fbfbfb' 
                    display='flex' alignItems='center' justifyContent='center'
                    fontSize='10px' lineHeight='12px' fontWeight='700'
                    whiteSpace='pre' cursor='pointer'
                  >
                    アバターを変更
                  </FormLabel>
                  <Input type='file' id='profilePhoto' display='none' onChange={handleUpdate} />
                </FormControl>
                
                <Box position='absolute' top='54px' left='54px'
                  h='28px' w='28px' borderRadius='50%' bg='#232428'
                  p='6px' cursor='default'
                >
                  <Box h='100%' w='100%' bg='#80848e' borderRadius='50%' p='4px'>
                    <Box h='100%' w='100%' bg='#232428' borderRadius='50%' />
                  </Box>
                </Box> 
              </Box>

              <Flex direction='column'
                maxH='calc(100vh - 128px)' p='0 12px' m='28px 16px 16px' 
                bg='#111214' borderRadius='8px'
              >
                <Box pt='12px' fontSize='20px' lineHeight='24px' fontWeight='500'>
                  <Text as={'span'} color='#fff'>
                    {currentUser?.displayName}
                  </Text>
                  <Text as={'span'} color='#b5bac1'>
                    {currentUser?.tag?.replace(currentUser?.displayName, '')}
                  </Text>
                </Box>

                <Box mt='12px' h='1px' w='100%' bg='#2e2f34' />

                {description && (
                  <Box pt='12px'>
                    <Text as={'h4'} color='#f2f3f5' mb='6px'
                      fontSize='12px' lineHeight='16px' fontWeight='700'
                      >
                      自己紹介
                    </Text>
                    <Box color='#dbdee1' overflow='hidden'
                      fontSize='14px' lineHeight='18px' fontWeight='400'
                      css={css`
                        & {
                          display: -webkit-box;
                          -webkit-box-orient: vertical;
                          -webkit-line-clamp: 6;
                        }
                      `}
                    >
                      {description}
                    </Box>
                  </Box>
                )}

                <Box p='12px 0'>
                  <Text as={'h4'} color='#f2f3f5'
                    fontSize='12px' lineHeight='16px' fontWeight='700'
                  >
                    プロフィールをカスタマイズ
                  </Text>

                  <Flex align='center' mt='8px'>
                    <Flex align='center' justify='center' flex='0 0 auto'
                      h='64px' w='64px' mr='16px'
                      bg='#3c45a5' borderRadius='8px'
                    >
                      <Icon as={FcEngineering} boxSize='48px' 
                        css={css`
                          animation: 5s linear infinite ${rotation};
                        `}
                      />
                    </Flex>
                    <Box flex='1 1 auto' color='#f2f3f5'
                      fontSize='14px' lineHeight='18px'
                    >
                      <Text fontWeight='600'>
                        ユーザープロフィール
                      </Text>
                      <Text fontWeight='400'>
                        00:00経過
                      </Text>
                    </Box>
                  </Flex>
                  
                  <Button tabIndex={-1}
                    mt='12px' h='32px' maxW='284px' w='100%'
                    bg='#4e5058' color='#fff' borderRadius='3px'
                    fontSize='14px' lineHeight='16px' fontWeight='500'
                    _hover={{ opacity: 0.8, bg: '#4e5058' }}
                  >
                    ボタンの例
                  </Button>
                </Box>
              </Flex>
            </Flex>
          </Box>
        </Flex>

        {isEdit && (
          <Box position='absolute' left='0' right='71px' bottom='0' 
            maxW='740px' p='0 20px 20px' zIndex={2}
            css={css`
              transform: translateX(49%);
            `}
          >
            <Flex align='center' justify='space-between' 
              p='10px 10px 10px 16px' borderRadius='5px' bg='#111214'
              boxShadow='0 2px 10px 0 #272626'
            >
              <Text color='#dbdee1'
                fontSize='16px' lineHeight='20px' fontWeight='500'
                overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'
              >
                注意：保存していない変更があります！
              </Text>

              <Flex flexGrow={0} gap='0 10px' justify='end'>
                <Button h='32px' minW='60px' w='auto'
                  color='#dbdee1' bg='transparent' p='2px 16px'
                  fontSize='14px' lineHeight='16px' fontWeight='500'
                  paddingInline={0}
                  _hover={{ bg: 'transparent', textDecoration: 'underline' }}
                  onClick={() => {
                    setPhotoURL(currentUser?.photoURL),
                    setBannerColor(currentUser?.color),
                    setDescription(currentUser?.description),
                    setIsEdit(false)
                  }}
                >
                  リセット
                </Button>
                <Button isLoading={isLoading}
                  h='32px' minW='60px' w='auto'
                  color='#fff' bg='#248046' p='2px 16px'
                  fontSize='14px' lineHeight='16px' fontWeight='500'
                  borderRadius='3px'
                  _hover={{ bg: '#1a6334' }}
                  onClick={handleReflect}
                >
                  変更を保存する
                </Button>
              </Flex>
            </Flex>
          </Box>
        )}
      </Box>
    </>
  )
}

const rotation = keyframes`
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
`

export default Profile