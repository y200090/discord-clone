import { Box, Container, Flex, Image, Link as ChakraLink } from '@chakra-ui/react'
import styled from '@emotion/styled'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { discordLogo } from '../../assets';

const MotionForm = ({ children }) => {
  const ResponsiveForm = styled.div`
    width: 100%;
    background-color: #313338;
    @media (min-width: 481px) {
      height: auto;
      max-width: 480px;
      padding: 32px;
      border-radius: 6px;
      box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
    }
    @media (max-width: 480px) {
      height: 100%;
      padding: 20px;
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
            <ResponsiveForm>
              { children }
            </ResponsiveForm>
          </Flex>
        </Container>
      </Box>
    </>
  )
}

export default MotionForm