import { Box, Button, Container, Flex, FormControl, FormErrorMessage, FormLabel, Heading, IconButton, Input, InputGroup, InputRightElement, Link as ChakraLink, Text, VStack } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import React, { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { BsChatSquareTextFill } from 'react-icons/bs'
import { useForm } from 'react-hook-form'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'

const Login = () => {
  const [isRevealPassword, setIsRevealPassword] = useState(false);
  
  const {
    register, 
    handleSubmit, 
    reset, 
    formState: {
      errors, 
      isSubmitting,
    }
  } = useForm();

  const onSubmit = (data) => {
    // console.log(data);
    // reset();
    
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(data);
        reset();
        resolve();
      }, 3000);
    })
  };

  const EmailValidator = {
    required: '入力必須項目です', 
    pattern: {
      value: /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/, 
      message: '正しい形式のメールアドレスを入力してください'
    },
  };

  const PasswordValidator = {
    required: '入力必須項目です', 
  };

  const RequiredStar = styled.span`
    color: #f23f43;
    margin-left: 4px;
  `;

  return (
    <>
      <Container h='100vh' w='100%' maxW='480px' p='0'>
        <Flex h='100%' w='100%' align='center' justify='center'>
          <form 
            onSubmit={handleSubmit(onSubmit)}
            css={css`
              width: 100%;
              @media (min-width: 481px) {
                height: auto;
                max-width: 480px;
              }
              @media (max-width: 480px) {
                height: 100%;
                max-width: unset;
              }
            `}
          >
            <Box
              h='100%'
              w='100%'
              p={{base: '20px', sm: '32px'}}
              bg='#313338'
              borderRadius={{base: '0', sm: '6px'}}
              boxShadow={{base: 'none', sm: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px'}}
            >
              <VStack w='100%' align='center' spacing='4px' mb='20px'>
                <Box
                  align='center' 
                  color='#f3f4f5' 
                  mb='12px'
                  css={css`
                    @media (min-width: 481px) {
                      display: none;
                    }
                    @media (max-width: 480px) {
                      display: flex;
                    }
                  `}
                >
                  <BsChatSquareTextFill size={26} />
                  <Heading fontSize='20px' lineHeight='24px' fontWeight='800' ml='8px'>
                    TalkPlace
                  </Heading>
                </Box>
                
                <Heading fontSize='24px' lineHeight='30px' color='#f3f4f5'>
                  おかえりなさい！
                </Heading>

                <Text color='#b8b9bf'>
                  素敵なトークライフを！
                </Text>
              </VStack>

              <Box w='100%'>
                <FormControl mb='20px' isInvalid={errors.email}>
                  <FormLabel
                    fontSize='12px'
                    lineHeight='16px'
                    fontWeight='700'
                    display='flex'
                    alignItems='center'
                  >
                    {errors.email ? 
                      <Text color='#fa777b'>メールアドレス</Text>
                      : 
                      <Text color='#b8b9bf'>メールアドレス</Text>
                    }

                    <RequiredStar>
                      {errors.email ? 
                        <FormErrorMessage
                          color='#fa777b'
                          fontSize='12px'
                          lineHeight='16px'
                          fontWeight='500'
                          m='0'
                        >
                          - {errors.email.message}
                        </FormErrorMessage>
                        : '*'
                      }
                    </RequiredStar>
                  </FormLabel>

                  <Input 
                    type='text' 
                    id='email' 
                    bg='#1e1f22' 
                    color='#dbdce0'
                    border='none'
                    focusBorderColor='transparent'
                    errorBorderColor='transparent'
                    borderRadius='4px' 
                    autoFocus
                    {...register('email', EmailValidator)}
                  />
                </FormControl>

                <FormControl isInvalid={errors.password}>
                  <FormLabel 
                    fontSize='12px'
                    lineHeight='16px'
                    fontWeight='700'
                    display='flex'
                    alignItems='center'
                  >
                    {errors.password ? 
                      <Text color='#fa777b'>パスワード</Text>
                      : 
                      <Text color='#b8b9bf'>パスワード</Text>
                    }

                    <RequiredStar>
                      {errors.password ? 
                        <FormErrorMessage
                          color='#fa777b'
                          fontSize='12px'
                          lineHeight='16px'
                          fontWeight='500'
                          m='0'
                        >
                          - {errors.password.message}
                        </FormErrorMessage>
                        : '*'
                      }
                    </RequiredStar>
                  </FormLabel>

                  <InputGroup>
                    <Input 
                      type={isRevealPassword ? 'text' : 'password'} 
                      id='password' 
                      bg='#1e1f22' 
                      color='#dbdce0'
                      border='none' 
                      focusBorderColor='transparent'
                      errorBorderColor='transparent'
                      borderRadius='4px'
                      {...register('password', PasswordValidator)}
                    />

                    <InputRightElement>
                      <IconButton 
                        aria-label='reveal-password-icon'
                        bg='transparent'
                        color='#989aa2'
                        fontSize='18px'
                        icon={isRevealPassword ? <MdVisibility /> : <MdVisibilityOff />}
                        _hover={{backgroundColor: 'transparent'}}
                        onClick={() => setIsRevealPassword((prevState) => !prevState)}
                      />
                    </InputRightElement>
                  </InputGroup>

                  <Button
                    variant='link'
                    color='#00aafc' 
                    mt='4px'
                  >
                    <Text fontSize='14px' lineHeight='16px' fontWeight='400'>
                      パスワードをお忘れですか？
                    </Text>
                  </Button>
                </FormControl>
                
                <Box w='100%' mt='20px'>
                  <Button 
                    type='submit'
                    w='100%'
                    bg='#5865f2'
                    _hover={{backgroundColor: '#4752c4'}}
                    borderRadius='4px'
                    mb='8px'
                    isLoading={isSubmitting}
                    isDisabled={errors.email || errors.password}
                  >
                    <Text color='#e0e1e5' fontWeight='500'>
                      ログイン
                    </Text>
                  </Button>

                  <Text color='#989aa2' fontSize='14px' lineHeight='16px'>
                    アカウント登録が必要ですか？
                    <ChakraLink
                      as={RouterLink}
                      to='/register'
                      color='#00aafc'
                      ml='4px'
                    >
                      登録ページ
                    </ChakraLink>
                  </Text>
                </Box>
              </Box>
            </Box>
          </form>
        </Flex>
      </Container>
    </>
  )
}

export default Login