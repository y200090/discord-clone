import { Box, Flex, IconButton, Input, Icon, Text, Tooltip } from '@chakra-ui/react'
import { css } from '@emotion/react'
import React, { useEffect } from 'react'
import { BiHash } from 'react-icons/bi'
import { MdPeopleAlt } from 'react-icons/md'
import { GiHamburgerMenu } from 'react-icons/gi'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Channels from '../Channels'

const Server = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(location)
    if (location.state?.index) {
      navigate(location.state.index);
    }
  })
  
  return (
    <>
      <Channels />

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
          fontSize='16px'
          lineHeight='20px'
          boxShadow='
            0 1px 0 #2c2e33,
            0 1.5px 0 #2a2c31,
            0 2px 0 #2e3034
          '
          p='0 8px'
          zIndex='1000'
        >
          <Flex flex='1 1 auto' align='center' overflow='hidden' cursor='default'>
            <IconButton 
              aria-label='hamburger-menu'
              icon={<GiHamburgerMenu size={20} />}
              size={20}
              bg='transparent'
              color='#f3f4f5'
              m='0 12px'
              _hover={{
                backgroundColor: 'transparent',
              }}
              display='none'
            />
            
            <Icon
              as={BiHash}
              boxSize={'28px'}
              flex='0 0 auto'
              m='0 8px'
              color='#82858f'
            />
            <Text minW='auto' color='#f3f4f5' fontWeight='600'>
              一般
            </Text>
          </Flex>
          
          <Flex flex='0 0 auto' align='center'>
            <Tooltip
              label='メンバーリストを表示'
              hasArrow
              placement='bottom'
              bg='#111214'
              color='#e0e1e5'
            >
              <IconButton 
                aria-label='show-member'
                icon={<MdPeopleAlt size={24} />}
                bg='transparent'
                m='0 8px'
                size={24}
                color='#b8b9bf'
                _hover={{
                  backgroundColor: 'transparent',
                  color: '#e0e1e5'
                }}
              />
            </Tooltip>

            <Box m='0 8px' z='100'>
              <Input 
                type='text'
                id='message'
                h='24px'
                w='144px'
                border='none'
                outline='none'
                focusBorderColor='transparent'
                bg='#1e1f22'
                color='#f3f4f5'
                borderRadius='4px'
                p='2px 4px'
                fontSize='14px'
                placeholder='検索'
                transition='width 0.25s ease'
                css={css`
                  &::placeholder {
                    padding-left: 4px;
                    color: #87898c;
                  }
                `}
                _focus={{
                  width: '240px'
                }}
              />
            </Box>
          </Flex>
        </Flex>

        <Outlet />
      </Flex>
    </>
  )
}

export default Server