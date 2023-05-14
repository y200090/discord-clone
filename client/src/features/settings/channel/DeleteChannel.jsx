import { Button, Icon, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import { useDeleteChannelMutation } from '../../../redux/apis/channelApi';
import { useNavigate } from 'react-router-dom';

const DeleteChannel = ({ channel }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ DeleteChannel ] = useDeleteChannelMutation();
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      await DeleteChannel({ channel }).unwrap();

      onClose();
      navigate(`/channels/${channel?.parentServer?._id}`)
      
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <>
      <Button
        h='auto' w='100%' alignItems='center' justifyContent='space-between'
        color='#b5bac1' bg='transparent' p='6px 10px' mb='2px' borderRadius='4px'
        fontSize='16px' lineHeight='20px' fontWeight='500'
        overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'
        _hover={{ 
          color: '#f2f3f5',
          bg: '#35373c' 
        }}
        onClick={onOpen}
      >
        チャンネルを削除
        <Icon as={FaTrashAlt} boxSize='12px' />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior='inside'>
        <ModalOverlay bg='rgba(7, 8, 9, 0.9)' />

        <ModalContent maxH='720px' minH='200px' w='440px' m='auto' borderRadius='4px' bg='#313338'>
          <ModalHeader p='16px' color='#f2f3f5'
            fontSize='20px' lineHeight='24px' fontWeight='600'
          >
            チャンネルを削除
          </ModalHeader>

          <ModalBody p='0 16px 20px'>
            <Text color='#f2f3f5'
              fontSize='16px' lineHeight='20px' fontWeight='400'
            >
              本当に<strong>#{channel?.title}</strong>を削除してもよろしいですか？元に戻すことはできません。
            </Text>
          </ModalBody>

          <ModalFooter justifyContent='flex-end' p='16px' borderRadius='0 0 4px 4px' bg='#2b2d31'>
            <Button
              h='38px' minH='38px' w='auto' minW='96px' p='2px 16px' 
              bg='transparent' color='#f4f4f4'
              fontSize='14px' lineHeight='16px' fontWeight='500'
              _hover={{ 
                bg: 'transparent',
                textDecoration: 'underline',
              }}
              onClick={onClose}
            >
              キャンセル
            </Button>
            <Button 
              h='38px' minH='38px' w='auto' minW='96px' p='2px 16px'
              borderRadius='3px' bg='#da373c' color='#f4f4f4'
              fontSize='14px' lineHeight='16px' fontWeight='500'
              _hover={{ bg: '#a12828' }}
              onClick={handleDelete}
            >
              チャンネルを削除
            </Button>
          </ModalFooter>
      </ModalContent>
      </Modal>
    </>
  )
}

export default DeleteChannel