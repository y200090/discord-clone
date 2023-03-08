import { Avatar, Box, Flex, Link as ChakraLink } from '@chakra-ui/react'
import React from 'react'
import { NavLink } from 'react-router-dom'

const NavIcon = ({ toURL, indexURL, avatarIcon, avatarSrc, baseColor, activeBg, clickFunc }) => {
  return (
    <>
      <Flex position='relative' w='100%' justify='center'>
        <ChakraLink 
          {...(toURL && {as: NavLink} )}
          to={toURL}
          {...indexURL && {state: {index: indexURL}}}
          tabIndex={-1}
          _activeLink={{
            span: {
              borderRadius: '16px',
              backgroundColor: `${activeBg}`,
              color: '#f3f4f5',
            },
            '.currentActive': {
              height: '40px',
              width: '100%',
              opacity: '1'
            }
          }}
          _hover={{
            span: {
              borderRadius: '16px',
              backgroundColor: `${activeBg}`,
              color: '#f3f4f5',
            },
            '.currentActive': {
              opacity: '1',
              width: '100%',
            }
          }}
          {...(clickFunc && {onClick: clickFunc})}
        >
          <Avatar 
            {...(avatarIcon && {icon: avatarIcon})}
            {...(avatarSrc && {src: avatarSrc})}
            borderRadius='50%'
            bg='#313338'
            color={baseColor}
            transition='all 0.15s ease-out'
          />
          
          <Flex
            pointerEvents='none'
            position='absolute'
            top='0'
            left='0'
            h='48px'
            w='4px'
            align='center'
          >
            <Box
              className='currentActive'
              h='20px'
              w='0%'
              bg='#f3f4f5'
              opacity='0'
              borderRadius='0px 4px 4px 0px'
              transition='all 0.3s ease-out'
            />
          </Flex>
        </ChakraLink>
      </Flex>
    </>
  )
}

export default NavIcon