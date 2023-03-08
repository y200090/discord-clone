import { Box, Button, Flex, Heading, IconButton, Text, Tooltip, Icon, Input, Avatar } from '@chakra-ui/react'
import { css } from '@emotion/react'
import React, { useState } from 'react'
import { BsPersonCheckFill } from 'react-icons/bs'
import { MdAdd } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom'
import AddToFriend from '../AddToFriend'
import Blocking from '../Blocking'
import Friends from '../Friends'
import Online from '../Online'
import Pending from '../Pending'
import ShowAll from '../ShowAll'

const Main = () => {
  const [activeMenu, setActiveMenu] = useState('add-to-friend');
  
  return (
    <>
      <Friends />

      <Flex
        as={'main'}
        position='relative'
        h='100%'
        w='100%'
        flexDirection='column'
        bg='#313338'
        overflow='hidden'
      >
        <Flex 
          as={'header'} 
          position='relative'
          h='48px' 
          w='100%'
          flex='0 0 auto'
          align='center'
          boxShadow='
            0 1px 0 #2c2e33,
            0 1.5px 0 #2a2c31,
            0 2px 0 #2e3034
          '
          p='0 8px'
          zIndex='10'
        >
          <Flex
            position='absolute'
            w='100%'
            flex='1 1 auto'
            align='center'
            fontSize='16px'
            lineHeight='20px'
            overflow='hidden'
          >
            <Box 
              h='24px'
              w='auto'
              flex='0 0 auto'
              m='0 8px'
            >
              <Icon 
                as={BsPersonCheckFill} 
                h='24px'
                w='24px'
                color='#82858f'
              />
            </Box>

            <Box flex='0 0 auto'mr='8px' >
              <Text 
                color='#f3f4f5' 
                fontWeight='600' 
                pointerEvents='none'
              >
                フレンド
              </Text>
            </Box>
            
            <Box h='24px' w='1px' bg='#3f4147' m='0 8px' flex='0 0 auto' />

            <Flex>
              <Button 
                aria-label='online'
                isActive={activeMenu == 'online'}
                h='26px'
                p='0 8px'
                m='0 8px'
                bg='transparent' 
                color='#b8b9bf'
                fontWeight='500'
                onClick={() => setActiveMenu('online')}
                _hover={{
                  color: '#f3f4f5',
                  backgroundColor: '#393c41'
                }}
                _active={{
                  color: '#f3f4f5',
                  backgroundColor: '#43444b',
                  '&:hover': {
                    backgroundColor: '#393c41'
                  }
                }}
              >
                オンライン
              </Button>

              <Button 
                aria-label='show-all'
                isActive={activeMenu == 'show-all'}
                h='26px'
                p='0 8px'
                m='0 8px'
                bg='transparent' 
                color='#b8b9bf'
                fontWeight='500'
                onClick={() => setActiveMenu('show-all')}
                _hover={{
                  color: '#f3f4f5',
                  backgroundColor: '#393c41'
                }}
                _active={{
                  color: '#f3f4f5',
                  backgroundColor: '#43444b',
                  '&:hover': {
                    backgroundColor: '#393c41'
                  }
                }}
              >
                全て表示
              </Button>

              <Button
                aria-label='pending'
                isActive={activeMenu == 'pending'}
                h='26px'
                p='0 8px'
                m='0 8px'
                bg='transparent' 
                color='#b8b9bf'
                fontWeight='500'
                onClick={() => setActiveMenu('pending')}
                _hover={{
                  color: '#f3f4f5',
                  backgroundColor: '#393c41'
                }}
                _active={{
                  color: '#f3f4f5',
                  backgroundColor: '#43444b',
                  '&:hover': {
                    backgroundColor: '#393c41'
                  }
                }}
              >
                保留中
              </Button>

              <Button
                aria-label='blocking'
                isActive={activeMenu == 'blocking'}
                h='26px'
                p='0 8px'
                m='0 8px'
                bg='transparent' 
                color='#b8b9bf'
                fontWeight='500'
                onClick={() => setActiveMenu('blocking')}
                _hover={{
                  color: '#f3f4f5',
                  backgroundColor: '#393c41'
                }}
                _active={{
                  color: '#f3f4f5',
                  backgroundColor: '#43444b',
                  '&:hover': {
                    backgroundColor: '#393c41'
                  }
                }}
              >
                ブロック中
              </Button>

              <Button
                aria-label='add-to-friend'
                isActive={activeMenu == 'add-to-friend'}
                h='26px'
                p='0 8px'
                m='0 8px'
                bg='#248045' 
                color='#f3f4f5'
                fontWeight='500'
                onClick={() => setActiveMenu('add-to-friend')}
                _hover={{
                  backgroundColor: '#248045'
                }}
                _active={{
                  backgroundColor: 'transparent',
                  color: '#2dc771'
                }}
              >
                フレンドに追加
              </Button>
            </Flex>
          </Flex>
        </Flex>

        <Online active={activeMenu == 'online'} />
        <ShowAll active={activeMenu == 'show-all'} />
        <Pending active={activeMenu == 'pending'} />
        <Blocking active={activeMenu == 'blocking'} />
        <AddToFriend active={activeMenu == 'add-to-friend'} />
      </Flex>
    </>
  )
}

export default Main