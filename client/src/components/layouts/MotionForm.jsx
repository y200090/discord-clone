import { Box, Container, Flex, Image, Link as ChakraLink } from '@chakra-ui/react'
import { css } from '@emotion/react';
import React from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { discordLogo } from '../../assets';
import LoginAlert from '../LoginAlert';

const MotionForm = ({ redirect, children }) => {
  const ResponsiveForm = css`
    width: 100%;
    background-color: #313338;
    @media (min-width: 481px) {
      height: auto;
      max-width: 480px;
      padding: ${redirect ? '24px 16px 16px' : '32px'};
      border-radius: 6px;
      box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
    }
    @media (max-width: 480px) {
      height: 100%;
      padding: ${redirect ? '24px 16px 16px' : '20px'};
      border-radius: 0;
    }
  `;
  
  return (
    <>
      <Box
        position='absolute' 
        left={{sm: '24px', md: '40px'}}
        h='80px' 
        display={{base: 'none', sm: 'flex'}}
        alignItems='center' 
      >
        <ChakraLink as={RouterLink} to='/'>
          <Image src={discordLogo} h='34px' w='124px' />
        </ChakraLink>
      </Box>
    
      <Box bg='#5865f2'>
        <Container h='100vh' w='100%' maxW='480px' p='0'>
          <Flex h='100%' w='100%' align='center' justify='center'>
            <div css={ResponsiveForm}>
              {redirect
                ? (
                  <LoginAlert />
                )
                : (
                  <>
                    { children }
                  </>
                )
              }
            </div>
          </Flex>
        </Container>
      </Box>
    </>
  )
}

export default MotionForm