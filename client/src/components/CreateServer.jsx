import { Box, Button, Heading, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, VStack, Icon, Flex, Input, FormControl, FormLabel, Link as ChakraLink } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import styled from '@emotion/styled';
import React, { useState } from 'react'
import { MdOutlineArrowForwardIos } from 'react-icons/md'
import { createOriginal } from '../assets'
import { IoMdCamera } from 'react-icons/io'
import { Link as RouterLink } from 'react-router-dom';

const FirstStepForm = () => {
  return (
    <>
      <ModalHeader 
        textAlign='center'
        p='24px 16px 0'
        fontSize='24px'
        lineHeight='30px'
      >
        サーバーを作成
        <Text 
          color='#4e5058' 
          fontSize='16px' 
          lineHeight='20px' 
          fontWeight='400'
          mt='8px'
        >
          サーバーは、あなたとフレンドが交流する場所です。サーバーを１つ作って会話を始めましょう。
        </Text>
      </ModalHeader>
      <ModalCloseButton 
        size='lg'
        color='#a7a8ac'
        _hover={{
          backgroundColor: 'transparent',
          color: 'unset',
        }}
      />

      <ModalBody 
        maxH='330px'
        mt='24px' 
        p='0 16px 8px'
      >
        <Flex w='100%' direction='column'>
          <Button
            h='auto'
            w='100%'
            p='0'
            bg='transparent'
            border='1px solid #e1e2e4'
            borderRadius='8px'
            display='flex'
            _hover={{
              backgroundColor: '#ebebed',
              borderColor: '#d2d3d6'
            }}
          >
            <Image 
              boxSize='48px'
              src={createOriginal}
              m='8px 8px 8px 16px'
            />
            <Text
              overflow='hidden'
              textOverflow='ellipsis'
              fontSize='16px'
              lineHeight='20px'
              fontWeight='700'
              color='#313338'
            >
              オリジナルの作成
            </Text>
            <Icon
              as={MdOutlineArrowForwardIos} 
              color='#313338'
              h='20px'
              w='20px'
              m='0 16px 0 auto'
            />
          </Button>
          <Text
            w='100%'
            m='16px 0 8px'
            textAlign='start'
            color='#4e5058' 
            fontSize='12px' 
            fontWeight='700' 
            lineHeight='16px'
          >
            テンプレートから始める
          </Text>

          <Button
            h='auto'
            w='100%'
            p='0'
            mb='8px'
            bg='transparent'
            border='1px solid #e1e2e4'
            borderRadius='8px'
            display='flex'
            _hover={{
              backgroundColor: '#ebebed',
              borderColor: '#d2d3d6'
            }}
          >
            <Image 
              boxSize='48px'
              src={createOriginal}
              m='8px 8px 8px 16px'
            />
            <Text
              overflow='hidden'
              textOverflow='ellipsis'
              fontSize='16px'
              lineHeight='20px'
              fontWeight='700'
              color='#313338'
            >
              オリジナルの作成
            </Text>
            <Icon
              as={MdOutlineArrowForwardIos} 
              color='#313338'
              h='20px'
              w='20px'
              m='0 16px 0 auto'
            />
          </Button>
          
        </Flex>
      </ModalBody>

      <ModalFooter 
        bg='#f3f4f5' 
        borderRadius='0 0 4px 4px'
        p='16px'
      >
        <VStack w='100%' align='center'>
          <Heading
            fontSize='20px'
            lineHeight='24px'
            fontWeight='600'
          >
            もう招待されていますか？
          </Heading>
          <Button
            w='100%'
            bg='#6d6f78'
            color='#fdfdfd'
            fontSize='14px'
            lineHeight='16'
            fontWeight='500'
            borderRadius='3px'
            _hover={{
              backgroundColor: '#4e5058',
            }}
          >
            サーバーに参加
          </Button>
        </VStack>
      </ModalFooter>
    </>
  )
};

const SecondStepForm = () => {
  const [ serverName, setServerName ] = useState('');
  
  const handleUpload = (e) => {

  }

  const handleCreateServer = (e) => {
    e.preventDefault();
    console.log(serverName)
    setServerName('');
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
  `
  
  return (
    <>
      <ModalHeader 
        textAlign='center'
        p='24px 24px 0'
        fontSize='24px'
        lineHeight='30px'
      >
        サーバーをカスタマイズ
        <Text 
          color='#4e5058' 
          fontSize='16px' 
          lineHeight='20px' 
          fontWeight='400'
          mt='8px'
        >
          新しいサーバーの名前とアイコンを設定して、個性を出しましょう。設定内容は後から変更できます。
        </Text>
      </ModalHeader>
      <ModalCloseButton 
        size='lg'
        color='#a7a8ac'
        _hover={{
          backgroundColor: 'transparent',
          color: 'unset',
        }}
      />

      <ModalBody 
        maxH='330px'
        m='16px 0' 
        p='4px 16px 0'
        display='flex'
        flexDirection='column'
      >
        <Flex
          w='100%'
          justify='center'
        >
          <PhotoUploadCircle htmlFor='photoUpload'>
            <AddIcon 
              position='absolute'
              top='0'
              right='2px'
              boxSize='24px'
              borderRadius='100%'
              p='6px'
              bg='#5865f2'
              color='#eaecfd'
              outline='6px solid #fff'
            />
            <Icon 
              as={IoMdCamera}
              boxSize='24px'
              color='#4e5058'
            />
            <Text
              textTransform='uppercase'
              fontSize='11px'
              fontWeight='800'
              lineHeight='14px'
              color='#4e5058'
            >
              Upload
            </Text>
          </PhotoUploadCircle>
          <Input 
            type='file'
            id='photoUpload'
            display='none'
            onChange={handleUpload}
          />
        </Flex>

        <form onSubmit={handleCreateServer} id='createServerForm'>
          <FormControl mt='24px' w='100%'>
            <FormLabel
              color='#4e5058'
              fontSize='12px'
              lineHeight='16px'
              fontWeight='700'
              mb='8px'
              htmlFor='serverName'
            >
              サーバー名
            </FormLabel>
            <Input 
              type='text'
              id='serverName'
              value={serverName}
              h='40px'
              w='100%'
              bg='#e3e5e8'
              p='10px'
              borderRadius='3px'
              fontSize='16px'
              lineHeight='20px'
              fontWeight='400'
              border='none'
              focusBorderColor='transparent'
              onChange={(e) => setServerName(e.target.value)}
            />
          </FormControl>

          <Box mt='8px' pb='4px'>
            <Text 
              fontSize='12px'
              fontWeight='400'
              lineHeight='16px'
              color='#5c5e66'
            >
              サーバーを作成すると、Discordの
              <ChakraLink
                as={RouterLink}
                to='/guidelines'
                isExternal
                color='#006ce7'
                fontWeight='600'
              >
                コミュニティガイドライン
              </ChakraLink>
              に同意したことになります。
            </Text>
          </Box>
        </form>
      </ModalBody>

      <ModalFooter 
        bg='#f3f4f5' 
        borderRadius='0 0 4px 4px'
        p='16px'
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        <Button
          h='auto'
          w='auto'
          p='2px 4px'
          bg='transparent'
          color='currentcolor'
          fontSize='14px'
          fontWeight='500'
          lineHeight='16px'
          _hover={{
            backgroundColor: 'transparent'
          }}
        >
          戻る
        </Button>

        <Button
          type='submit'
          form='createServerForm'
          h='38px'
          w='96px'
          bg='#5865f2'
          color='#edeffe'
          p='2px 16px'
          fontSize='14px'
          fontWeight='500'
          lineHeight='16px'
          borderRadius='3px'
          _hover={{
            backgroundColor: '#4752c4',
          }}
        >
          新規作成
        </Button>
      </ModalFooter>
    </>
  )
}

const CreateServer = ({ isModal, setIsModal }) => {
  return (
    <>
      <Modal 
        isOpen={isModal == 'create-server'} 
        onClose={() => setIsModal('')}
        isCentered
        scrollBehavior='inside'
      >
        <Box 
          position='fixed'
          h='100vh'
          w='100vw'
          top='0'
          left='0'
          bg='#070808'
          opacity='0.85'
          zIndex='1000'
        />
        <ModalContent maxH='558px' w='440px' m='0' borderRadius='4px'>
          {/* <FirstStepForm /> */}
          <SecondStepForm />
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateServer