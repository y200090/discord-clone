import { Button, Heading, Icon, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { RiLoginBoxFill } from 'react-icons/ri'
import { useLogoutMutation } from '../../redux/apis/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout as logoutUser, selectCurrentUser } from '../../redux/slices/authSlice';

const Logout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ logout ] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutUser());
      navigate('/');
      
    } catch (err) {
      console.log(err?.data);
    }
  };

  return (
    <>
      <Button
        w='100%'
        alignItems='center'
        justifyContent='space-between'
        color='#b5bac1'
        bg='transparent'
        p='6px 10px'
        borderRadius='4px'
        fontSize='16px'
        lineHeight='20px'
        fontWeight='500'
        overflow='hidden'
        whiteSpace='nowrap'
        textOverflow='ellipsis'
        _hover={{ 
          color: '#f2f3f5',
          bg: '#35373c' 
        }}
        onClick={onOpen}
      >
        ログアウト
        <Icon as={RiLoginBoxFill} />
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior='inside'
      >
        <ModalOverlay bg='rgba(7, 8, 9, 0.9)' />
        <ModalContent
          maxH='720px'
          minH='200px'
          w='440px'
          m='auto'
          borderRadius='6px'
          flexDirection='column'
        >
          <ModalHeader
            flex='0 0 auto'
            borderRadius='4px 4px 0 0'
            p='16px'
            bg='#313338'
          >
            <Heading
              as={'h1'}
              fontSize='20px'
              fontWeight='600'
              lineHeight='24px'
              color='#f2f3f5'
            >
              ログアウト
            </Heading>
          </ModalHeader>
          <ModalBody
            flex='1 1 auto' 
            p='0 16px 20px' 
            bg='#313338'
          >
            <Text
              fontSize='16px'
              lineHeight='20px'
              fontWeight='400'
              color='#dbdee1'
            >
              本当にログアウトしますか？
            </Text>
          </ModalBody>
          <ModalFooter
            flex='0 0 auto'
            justifyContent='flex-end'
            borderRadius='0 0 4px 4px'
            p='16px'
            bg='#2b2d31'
          >
            <Button
              h='38px'
              minH='38px'
              w='auto'
              minW='96px'
              p='2px 16px'
              bg='transparent'
              color='#f4f4f4'
              fontSize='14px'
              lineHeight='16px'
              fontWeight='500'
              _hover={{ 
                bg: 'transparent',
                textDecoration: 'underline',
              }}
              onClick={onClose}
            >
              キャンセル
            </Button>
            <Button
              h='38px'
              minH='38px'
              w='auto'
              minW='96px'
              p='2px 16px'
              borderRadius='3px'
              bg='#da373c'
              color='#f4f4f4'
              fontSize='14px'
              lineHeight='16px'
              fontWeight='500'
              _hover={{ bg: '#a12828' }}
              onClick={handleLogout}
            >
              ログアウト
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Logout