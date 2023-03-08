import { Box, Button, Flex, IconButton, Input, Textarea } from '@chakra-ui/react'
import { css } from '@emotion/react';
import React, { useRef, useState } from 'react'
import { MdAddCircle } from 'react-icons/md'

const SendMessage = () => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef();
  const baseHeight = 44;

  const changeTextarea = (e) => {
    setMessage(e.target.value);

    textareaRef.current.style.height = baseHeight + 'px';
    textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (e.target.value === '' || !e.target.value.match(/\S/g)) {
      return false;
    } 

    console.log(message)
    setMessage('');
    textareaRef.current.style.height = baseHeight + 'px';
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
        <Flex
          w='100%' 
          p='0 16px 0 0'
          mb='24px'
          bg='#383a40'
          borderRadius='8px'
          align='flex-start'
        >
          <Flex 
            flex='0 0 auto' 
            p='10px 16px'
            align='center'
          >
            <IconButton 
              tabIndex='2'
              icon={<MdAddCircle size={24} />}
              bg='transparent'
              size={24}
              color='#b8b9bf'
              _hover={{
                backgroundColor: 'transparent',
                color: '#e0e1e5'
              }}
            />
          </Flex>
          <Box w='100%'>
            <Textarea 
              tabIndex='1'
              ref={textareaRef}
              value={message}
              onChange={changeTextarea}
              onKeyDown={handleKeyDown}
              fontSize='1rem'
              lineHeight='1.375rem'
              fontWeight='4000'
              minH='44px'
              resize='none'
              color='#f3f4f5'
              p='11px 0'
              placeholder='#一般へメッセージを送信'
              border='none'
              focusBorderColor='transparent'
              outline='none'
              css={css`
                &::placeholder {
                  color: #6a6b75;
                }
              `}
            />
          </Box>

        </Flex>
      </form>
    </>
  )
}

export default SendMessage