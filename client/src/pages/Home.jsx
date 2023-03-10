import { Box, Flex, IconButton, Image, Link as ChakraLink } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { discordLogo } from '../assets'
import { ImMenu } from 'react-icons/im'

const Home = () => {
  const [ accessToken, setAccessToken ] = useState(false);
  
  return (
    <>
      <Box h='100%' w='100%' overflowX='hidden'>
        <Flex 
          minH='626px' 
          direction='column'
          bg='#404eed' 
          pb={{base: '0px', md: '80px'}}
          position='relative'
          overflow='hidden'
        >
          <Flex 
            as={'header'}
            h='80px' 
            w='100%'
            p={{base: '0 24px', md: '0 40px'}}
            zIndex='9999'
          >
            <Flex
              as={'nav'}
              align='center'
              justify='space-between'
              h='100%'
              w='100%'
            >
              <ChakraLink as={RouterLink} to='/'>
                <Image src={discordLogo} h='34px' w='124px' />
              </ChakraLink>

              <ChakraLink
                as={RouterLink}
                to='/login'
                outline='none'
                fontSize='14px'
                fontWeight='500'
                lineHeight='24px'
                bg='#fff'
                color='#23272a'
                p='7px 16px'
                borderRadius='40px'
                _hover={{
                  textDecoration: 'none',
                  color: '#5865f2',
                  boxShadow: 'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
                }}
              >
                {accessToken ? 'Open Discord' : 'Login'}
              </ChakraLink>
            </Flex>
          </Flex>

          <Flex w='100%' p='56px 24px'>

          </Flex>
        </Flex>
      </Box>
    </>
  )
}

export default Home