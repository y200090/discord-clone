import { Box, Button, Heading, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, VStack, Icon, Flex } from '@chakra-ui/react'
import React from 'react'
import { MdOutlineArrowForwardIos } from 'react-icons/md'
import { createOriginal } from '../assets'

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
        <ModalContent maxH='558px' m='0' borderRadius='4px'>
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
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateServer