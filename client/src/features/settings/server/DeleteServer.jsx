import { Box, Button, FormControl, FormErrorMessage, Heading, Icon, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { FaTrashAlt } from 'react-icons/fa';
import { useDeleteServerMutation } from '../../../redux/apis/serverApi';
import { useForm } from 'react-hook-form';

const DeleteServer = ({ server }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ DeleteServer, { isError, error, reset: unset } ] = useDeleteServerMutation();
  const { 
    register,
    handleSubmit,
    reset, 
    formState: {
      isSubmitting,
    }
  } = useForm();

  useEffect(() => {
    return () => {
      if (isError) {
        unset();
      }
      reset();
    };
  }, [isOpen]);

  const onSubmit = async (data) => {
    try {
      await DeleteServer({ 
        server, 
        password: data?.serverTitle 
      }).unwrap();

      reset();
      onClose();
      
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
        サーバーを削除
        <Icon as={FaTrashAlt} boxSize='12px' />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior='inside'>
        <ModalOverlay bg='rgba(7, 8, 9, 0.9)' />

        <ModalContent maxH='720px' minH='200px' w='440px' m='auto' borderRadius='4px' bg='#313338'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader p='16px' color='#f2f3f5'
              fontSize='20px' lineHeight='24px' fontWeight='600'
            >
              「{server?.title}」を削除
            </ModalHeader>

            <ModalBody p='0 16px'>
              <Box p='10px' mb='20px' borderRadius='5px' bg='#f0b132'>
                <Text color='#fff'
                  fontSize='16px' lineHeight='20px' fontWeight='400'
                >
                  本当に<strong>{server?.title}</strong>を削除しますか？この操作を元に戻すことはできません。
                </Text>
              </Box>
              <FormControl mb='20px' isInvalid={isError}>
                <Heading mb='8px' color='#b5bac1'
                  fontSize='12px' lineHeight='16px' fontWeight='700'
                >
                  サーバー名を入力してください。
                </Heading>
                <Input type='text' id='serverTitle'
                  h='40px' w='100%' p='10px' borderRadius='3px'
                  bg='#1e1f22' color='#dbdee1' border='none'
                  focusBorderColor='transparent'
                  errorBorderColor='transparent'
                  {...register('serverTitle')}
                />
                {isError &&
                  <FormErrorMessage mt='8px' color='#fa777c'
                    fontSize='12px' fontWeight='400' lineHeight='16px'
                  >
                    {error?.data}
                  </FormErrorMessage>
                }
              </FormControl>
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
              <Button type='submit'
                h='38px' minH='38px' w='auto' minW='96px' p='2px 16px'
                borderRadius='3px' bg='#da373c' color='#f4f4f4'
                fontSize='14px' lineHeight='16px' fontWeight='500'
                _hover={{ bg: '#a12828' }}
                isLoading={isSubmitting}
              >
                サーバーを削除
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DeleteServer