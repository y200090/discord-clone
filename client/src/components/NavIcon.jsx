import { Avatar, Box, Flex, Image, Link as ChakraLink, Tooltip } from '@chakra-ui/react'
import { css } from '@emotion/react';
import React from 'react'
import { NavLink, useParams } from 'react-router-dom'

const NavIcon = (props) => {
  const { toURL, indexURL, title, avatarIcon, photoURL, color, bg, isOpen, onClose, onClick } = props;
  const { serverId } = useParams();

  return (
    <>
      <Flex position='relative' w='100%' justify='center'>
        <Tooltip label={title} hasArrow placement='right'
          p='6px 10px' bg='#111214' color='#e0e1e5'
          fontSize='16px' fontWeight='600' borderRadius='4px'
        >
          <ChakraLink tabIndex={-1}
            {...(toURL && {as: NavLink} )}
            {...(indexURL ? {to: toURL+'/'+indexURL} : {to: toURL})}
            {...(onClick && {onClick: onClick})}
            _hover={{
              'span, img': {
                borderRadius: '16px',
                bg: `${bg}`,
                color: `${color?.active}`,
              },
              '& + div > div': {
                opacity: '1',
                width: '100%',
              },
            }}
            _activeLink={{
              'span, img': {
                borderRadius: '16px',
                bg: `${bg}`,
                color: `${color?.active}`,
              },
              '& + div > div': {
                height: '40px',
                width: '100%',
                opacity: '1'
              }
            }}
            {...((toURL === '/channels/'+serverId || isOpen) && {
              css: css`
                span, img {
                  border-radius: 16px;
                  background-color: ${bg};
                  color: #f3f4f5;
                }
                & + div > div {
                  height: 40px;
                  width: 100%;
                  opacity: 1;
                }
              `
            })}
          >
            {photoURL 
              ? <Image src={photoURL} boxSize='48px' 
                  borderRadius='50%' transition='all 0.15s ease-out' 
                />
              : <Avatar icon={avatarIcon} 
                  bg='#313338' color={color.inactive} 
                  borderRadius='50%' transition='all 0.15s ease-out' 
                />
            }
          </ChakraLink>
        </Tooltip>

        <Flex className='item' align='center'
          position='absolute' top='0' left='0' h='48px' w='4px'
          pointerEvents='none'
          {...(onClose && {display: 'none'})}
        >
          <Box className='currentActive'
            h='20px' w='0%' bg='#f3f4f5' opacity='0'
            borderRadius='0px 4px 4px 0px' transition='all 0.2s ease-out'
          />
        </Flex>
      </Flex>
    </>
  )
}

export default NavIcon