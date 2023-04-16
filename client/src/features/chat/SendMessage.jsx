import { Box, Button, Flex, IconButton, Input, Textarea } from '@chakra-ui/react'
import { css } from '@emotion/react';
import React, { useRef, useState } from 'react'
import { MdAddCircle } from 'react-icons/md'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { usePostMessageMutation } from '../../redux/apis/messageApi';
import { selectCurrentUser } from '../../redux/slices/userSlice'

const SendMessage = () => {
  const { channelId } = useParams();
  const currentUser = useSelector(selectCurrentUser);
  const [ PostMessage ] = usePostMessageMutation();
  const [ message, setMessage ] = useState('');
  const textareaRef = useRef();
  const baseHeight = 44;

  const changeTextarea = (e) => {
    setMessage(e.target.value);

    textareaRef.current.style.height = baseHeight + 'px';
    textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (e.target.value === '' || !e.target.value.match(/\S/g)) {
      return false;
    } 

    try {
      await PostMessage({ currentUser, message, channelId });
      
    } catch (err) {
      console.log(err);

    } finally {
      setMessage('');
      textareaRef.current.style.height = baseHeight + 'px';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        handleSubmit(e);
      }
    }
  };
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Flex align='flex-start'
          w='100%' p='0 16px 0 0' mb='24px'
          bg='#383a40' borderRadius='8px'
        >
          <Flex align='center' flex='0 0 auto' p='10px 16px'>
            <IconButton aria-label='画像ファイル選択'
              icon={<MdAddCircle size={24} />} size={24}
              bg='transparent' color='#b8b9bf' tabIndex='2'
              _hover={{ bg: 'transparent', color: '#e0e1e5' }}
            />
          </Flex>
          <Box w='100%'>
            <Textarea ref={textareaRef} value={message} tabIndex='1'
              minH='44px' p='11px 0' color='#f3f4f5'
              fontSize='1rem' lineHeight='1.375rem' fontWeight='4000'
              resize='none' border='none' outline='none'
              focusBorderColor='transparent'
              placeholder='#一般へメッセージを送信'
              css={css`
                &::placeholder {
                  color: #6a6b75;
                }
              `}
              onChange={changeTextarea} onKeyDown={handleKeyDown}
            />
          </Box>
        </Flex>
      </form>
    </>
  )
}

export default SendMessage