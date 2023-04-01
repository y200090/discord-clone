import { Box, Button, Flex, Heading, Image, Link as ChakraLink, Text, VStack } from '@chakra-ui/react'
import { discordLogo } from '../assets'
import React from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'

const LoginAlert = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleRedirect = () => {
    navigate('/login', {state: {referrer: location.state.referrer}});
  };
  
  return (
    <>
      <VStack w='100%' align='center'>
        <ChakraLink
          as={RouterLink}
          to='/'
          display={{base: 'block', sm: 'none'}}
          color='#f3f4f5'
          mb='16px'
        >
          <Image src={discordLogo} h='36px' w='130px' />
        </ChakraLink>

        <Box minH={{base: '540px', sm: 'unset'}} w='100%' textAlign='center'>
          <Heading
            fontSize='24px'
            lineHeight='30px'
            fontWeight='600'
            color='#f2f3f5'
          >
            認証切れ
          </Heading>
          <Text
            display='block'
            fontSize='16px'
            lineHeight='20px'
            fontWeight='400'
            color='#b5bab9'
            m='8px 0 24px'
          >
            ログインを継続するか、新しいアカウントを追加してください。
          </Text>
          <Flex 
            align='center'
            justify='center'
            p='12px 16px'
            bg='#2b2d31' 
            borderRadius='4px'
          >
            <Button
              h='38px'
              w='auto'
              minW='96px'
              bg='#4e5058'
              p='2px 16px'
              borderRadius='3px'
              fontSize='14px'
              lineHeight='16px'
              fontWeight='500'
              color='#fff'
              _hover={{ bg: '#6d6f78' }}
              onClick={handleRedirect}
            >
              ログイン
            </Button>
            <ChakraLink
              as={RouterLink}
              h='38px'
              w='auto'
              minW='96px'
              display='flex'
              alignItems='center'
              bg='transparent'
              p='2px 16px'
              borderRadius='3px'
              fontSize='14px'
              lineHeight='16px'
              fontWeight='500'
              color='#fff'
              _hover={{ 
                bg: 'transparent', 
                textDecoration: 'underline',
              }}
            >
              アカウントを追加
            </ChakraLink>
          </Flex>
        </Box>
      </VStack>
    </>
  )
}

export default LoginAlert