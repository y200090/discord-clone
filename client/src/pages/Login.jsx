import { Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, IconButton, Image, Input, InputGroup, InputRightElement, Link as ChakraLink, Text, VStack } from '@chakra-ui/react'
import styled from '@emotion/styled'
import React, { useState } from 'react'
import { Navigate, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { discordLogo } from '../assets'
import { useDispatch } from 'react-redux'
import { useLoginMutation } from '../redux/apis/authApi'
import { setCredential } from '../redux/slices/authSlice'
import { setCurrentUser } from '../redux/slices/userSlice'
import { useCookies } from 'react-cookie';
import { MotionForm } from '../layouts';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [ cookies ] = useCookies(['logged_in']);
  const [ login, { isError, error } ] = useLoginMutation();
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
  const [ isRevealPassword, setIsRevealPassword ] = useState(false);

  const onSubmit = async (data) => {
    try {
      const result = await login({...data}).unwrap();
      dispatch(setCredential(result.accessToken));
      dispatch(setCurrentUser(result.user));
      reset();
      navigate(location?.state?.referrer || '/channels/@me');
      
    } catch (err) {
      console.log(err);
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

  if (cookies.logged_in) {
    return (
      <Navigate to={location?.state?.referrer || '/channels/@me'} />
    );
  }

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
            <FormControl mb='20px' isInvalid={errors.email || isError}>
              <FormLabel htmlFor='email'
                fontSize='12px' lineHeight='16px' fontWeight='700'
                display='flex' alignItems='center'
              >
                {errors.email || isError
                  ? <Text color='#fa777b'>メールアドレス</Text>
                  : <Text color='#b8b9bf'>メールアドレス</Text>
                }

                <RequiredStar>
                  {errors.email || isError
                    ? (
                      <FormErrorMessage color='#fa777b' m='0' 
                        fontSize='12px' lineHeight='16px' fontWeight='500'
                      >
                        - {errors?.email?.message || error?.data}
                      </FormErrorMessage>
                    )
                    : '*'
                  }
                </RequiredStar>
              </FormLabel>

              <Input type='text' id='email' autoFocus
                bg='#1e1f22' color='#dbdce0' border='none'
                focusBorderColor='transparent'
                errorBorderColor='transparent'
                borderRadius='4px' 
                {...register('email', EmailValidator)}
              />
            </FormControl>

            <FormControl isInvalid={errors.password || isError}>
              <FormLabel htmlFor='password'
                fontSize='12px' lineHeight='16px' fontWeight='700'
                display='flex' alignItems='center'
              >
                {errors.password || isError
                  ? <Text color='#fa777b'>パスワード</Text>
                  : <Text color='#b8b9bf'>パスワード</Text>
                }

                <RequiredStar>
                  {errors.password || isError
                    ? (
                      <FormErrorMessage
                        color='#fa777b'
                        fontSize='12px'
                        lineHeight='16px'
                        fontWeight='500'
                        m='0'
                      >
                        - {errors?.password?.message || error?.data}
                      </FormErrorMessage>
                    )
                    : '*'
                  }
                </RequiredStar>
              </FormLabel>

              <InputGroup>
                <Input id='password' 
                  type={isRevealPassword ? 'text' : 'password'} 
                  bg='#1e1f22' color='#dbdce0' border='none' 
                  focusBorderColor='transparent'
                  errorBorderColor='transparent'
                  borderRadius='4px'
                  {...register('password', PasswordValidator)}
                />

                <InputRightElement>
                  <IconButton aria-label='reveal-password-icon'
                    icon={isRevealPassword ? <MdVisibility /> : <MdVisibilityOff />}
                    bg='transparent' color='#989aa2' fontSize='18px'
                    _hover={{backgroundColor: 'transparent'}}
                    onClick={() => setIsRevealPassword((prevState) => !prevState)}
                  />
                </InputRightElement>
              </InputGroup>

              <Button variant='link' color='#00aafc' mt='6px'>
                <Text fontSize='14px' lineHeight='16px' fontWeight='400'>
                  パスワードをお忘れですか？
                </Text>
              </Button>
            </FormControl>
            
            <Box w='100%' mt='20px'>
              <Button type='submit'
                w='100%' mb='8px' bg='#5865f2' borderRadius='4px'
                _hover={{bg: '#4752c4'}}
                isLoading={isSubmitting}
                isDisabled={errors.email || errors.password}
              >
                <Text color='#e0e1e5' fontWeight='500'>
                  ログイン
                </Text>
              </Button>

              <Text color='#989aa2' fontSize='14px' lineHeight='16px'>
                アカウント登録が必要ですか？
                <ChakraLink as={RouterLink} to='/register'
                  color='#00aafc' ml='4px'
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