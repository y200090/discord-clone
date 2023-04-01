import { Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, IconButton, Image, Input, InputGroup, InputRightElement, Link as ChakraLink, Text, VStack } from '@chakra-ui/react'
import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import MotionForm from '../components/layouts/MotionForm'
import { discordLogo } from '../assets'
import { useDispatch, useSelector } from 'react-redux'
import { useLoginMutation } from '../redux/apis/authApi'
import { selectCurrentUser, setCredential } from '../redux/slices/authSlice'

const Login = () => {
  const [ isRevealPassword, setIsRevealPassword ] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [ login ] = useLoginMutation();
  const {
    register, 
    handleSubmit, 
    reset, 
    formState: {
      errors, 
      isSubmitting,
    }
  } = useForm({
    shouldFocusError: true,
  });

  const onSubmit = async (data) => {
    try {
      const user = await login({...data}).unwrap();
      dispatch(setCredential({...user}));
      reset();
      navigate(location?.state?.referrer || '/channels/@me');
      
    } catch (err) {
      console.log(err?.data);
    }
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
      <MotionForm {...(location?.state?.redirect && {redirect: true})}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack w='100%' align='center' spacing='4px' mb='20px'>
            <Box
              align='center' 
              color='#f3f4f5' 
              mb='12px'
              display={{base: 'block', sm: 'none'}}
            >
              <ChakraLink as={RouterLink} to='/'>
                <Image src={discordLogo} h='36px' w='130px' />
              </ChakraLink>
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
                htmlFor='email'
              >
                {errors.email 
                  ? <Text color='#fa777b'>メールアドレス</Text>
                  : <Text color='#b8b9bf'>メールアドレス</Text>
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
                htmlFor='password'
              >
                {errors.password 
                  ? <Text color='#fa777b'>パスワード</Text>
                  : <Text color='#b8b9bf'>パスワード</Text>
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
                mt='6px'
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
        </form>
      </MotionForm>
    </>
  )
}

export default Login