import { Avatar, Box, Flex, Image, Link as ChakraLink, Tooltip } from '@chakra-ui/react'
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react'
import { NavLink, useParams } from 'react-router-dom'

const NavIcon = (props) => {
  const { toURL, indexURL, title, icon, photoURL, color, bg, isOpen, onClose, onClick, notifications } = props;
  const { serverId } = useParams();

  return (
    <>
      <Flex position='relative' w='100%' justify='center'>
        <Tooltip label={title} hasArrow placement='right'
          p='6px 10px' bg='#111214' color='#e0e1e5'
          fontSize='16px' fontWeight='600' borderRadius='4px'
        >
          <ChakraLink 
            {...(toURL && {as: NavLink})}
            {...(indexURL ? {to: toURL+'/'+indexURL} : {to: toURL})}
            {...(onClick && {onClick: onClick})}
            tabIndex={-1} position='relative'
            _hover={{
              'span, img': {
                borderRadius: '16px',
                bg: `${bg}`,
                color: `${color?.active}`,
              },
              '& + div > div': {
                height: '20px',
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
                width: '100%'
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
              : <Avatar icon={icon} 
                  bg='#313338' color={color?.inactive} 
                  borderRadius='50%' transition='all 0.15s ease-out' 
                />
            }

            {notifications > 0 &&
              <NotificationCounter>{notifications}</NotificationCounter>
            }
          </ChakraLink>
        </Tooltip>

        <Flex align='center'
          position='absolute' top='0' left='0' h='48px' w='4px'
          pointerEvents='none'
          {...(onClose && {display: 'none'})}
        >
          <Box 
            h={notifications ? '8px' : '0' } w={notifications ? '100%' : '0%' }
            bg='#f3f4f5' 
            borderRadius='0px 4px 4px 0px' transition='all 0.2s ease-out'
          />
        </Flex>
      </Flex>
    </>
  )
};

const NotificationCounter = styled.span`
  position: absolute;
  right: 0;
  bottom: 0;
  min-height: 16px;
  min-width: 16px;
  padding: 0 1px 1px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 12px;
  line-height: 16px;
  font-weight: 700;
  color: #fffff3;
  background-color: #f23f42 !important;
  outline: 4px solid #1e1f22;
`

export default NavIcon