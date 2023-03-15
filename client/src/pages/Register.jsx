import { Box, Button, Checkbox, FormControl, FormErrorMessage, FormLabel, Heading, IconButton, Image, Input, InputGroup, InputRightElement, Link as ChakraLink, Text, Tooltip, VStack } from '@chakra-ui/react'
import { css } from '@emotion/react';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { BsQuestionCircle } from 'react-icons/bs';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { discordLogo } from '../assets';
import { strongPassword, mediumPassword } from '../assets/regexp';
import MotionForm from '../components/layouts/MotionForm';
import { useSignUpMutation } from '../redux/apis/authApi';
import { setCredential } from '../redux/auth/slices';

const Register = () => {
  const [isRevealPassword, setIsRevealPassword] = useState(false);
  const [password, setPassword] = useState({
    value: '', 
    strength: '', 
    message: '',
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signUp, {isLoading}] = useSignUpMutation();
  const {
    register,
    handleSubmit, 
    watch, 
    reset, 
    formState: {
      errors, 
      isSubmitting,
    }
  } = useForm({
    shouldFocusError: true,
  });
  const watchChecked = watch('checked', false);

  const onSubmit = async (data) => {
    try {
      const currentUser = await signUp({...data}).unwrap();
      dispatch(setCredential({...currentUser}));
      reset();
      navigate('/channels/@me');
      
    } catch (err) {
      console.log(err?.data);
    }
  };

  const emailValidator = {
    required: '入力必須項目です', 
    pattern: {
      value: /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/, 
      message: '正しい形式のメールアドレスを入力してください'
    },
  };

  const passwordValidator = {
    required: '入力必須項目です', 
    onChange: (e) => {
      if (strongPassword.test(e.target.value)) {
        setPassword({...password, 
          value: e.target.value, 
          strength: 'lime',
          message: '安全性の高いパスワードです'
        });
  
      } else if (mediumPassword.test(e.target.value)) {
        setPassword({...password, 
          value: e.target.value, 
          strength: 'yellow',
          message: '平均的な強度のパスワードです'
        });
  
      } else {
        setPassword({...password, 
          value: e.target.value, 
          strength: 'red',
          message: '脆弱なパスワードです'
        });
      }
    },
  };

  return (
    <>
      <MotionForm>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack w='100%' align='center' spacing='0px' mb='20px'>
            <Box
              align='center' 
              color='#f3f4f5' 
              mb='16px'
              display={{base: 'block', sm: 'none'}}
            >
              <ChakraLink as={RouterLink} to='/'>
                <Image src={discordLogo} h='36px' w='130px' />
              </ChakraLink>
            </Box>

            <Heading fontSize='24px' lineHeight='30px' color='#f3f4f5'>
              アカウント作成
            </Heading>
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
                {/* 何故か色変化にアニメーションがつくため要素の置換で代用 */}
                {errors.email 
                  ? <Text color='#fa777b'>メールアドレス</Text>
                  : <Text color='#b8b9bf'>メールアドレス</Text>
                }

                <Tooltip 
                  hasArrow
                  placement='top-start'
                  bg='#f3f4f5'
                  color='#1e1f22'
                  label='利用可能なメールアドレスである必要があります'
                >
                  <IconButton 
                    aria-label='question-mark'
                    bg='transparent'
                    size='12px'
                    ml='4px'
                    icon={errors.email ? 
                      <BsQuestionCircle color='#fa777b' /> 
                      : 
                      <BsQuestionCircle color='#b8b9bf' />
                    } 
                    _hover={{backgroundColor: 'transparent'}}
                    _focus={{boxShadow: 'none'}}
                  />
                </Tooltip>

                {errors.email && 
                  <FormErrorMessage
                    color='#fa777b'
                    fontSize='12px'
                    lineHeight='16px'
                    fontWeight='500'
                    m='0'
                    ml='4px'
                  >
                    - {errors.email.message}
                  </FormErrorMessage>
                }
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
                {...register('email', emailValidator)}
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
                {errors.password 
                  ? <Text color='#fa777b'>パスワード</Text>
                  : <Text color='#b8b9bf'>パスワード</Text>
                }
                
                <Tooltip 
                  hasArrow
                  placement='top-start'
                  bg='#f3f4f5'
                  color='#1e1f22'
                  label='パスワードは8文字以上かつ英数字を含んでいることが望ましいです'
                >
                  <IconButton 
                    aria-label='question-mark'
                    bg='transparent'
                    size='12px'
                    ml='4px'
                    icon={errors.password ? 
                      <BsQuestionCircle color='#fa777b' /> 
                      : 
                      <BsQuestionCircle color='#b8b9bf' />
                    } 
                    _hover={{backgroundColor: 'transparent'}}
                    _focus={{boxShadow: 'none'}}
                  />
                </Tooltip>

                {errors.password && 
                  <FormErrorMessage
                    color='#fa777b'
                    fontSize='12px'
                    lineHeight='16px'
                    fontWeight='500'
                    m='0'
                    ml='4px'
                  >
                    - {errors.password.message}
                  </FormErrorMessage>
                }

                {password.value && 
                  <Text color={password.strength} ml='auto'>
                    {password.message}
                  </Text>
                }
              </FormLabel>

              <InputGroup>
                <Input 
                  type={isRevealPassword ? 'text' : 'password'}
                  id='password' 
                  value={password.value}
                  bg='#1e1f22' 
                  color='#dbdce0'
                  border='none' 
                  focusBorderColor='transparent'
                  errorBorderColor='transparent'
                  borderRadius='4px'
                  {...register('password', passwordValidator)}
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

            </FormControl>

            <FormControl mt='12px'>
              <Checkbox 
                size='lg' 
                css={css`
                  span:first-of-type {
                    border-width: 1px;
                    border-color: #85878e;
                    border-radius: 6px;
                  }
                  span:first-of-type[data-checked] {
                    background-color: #5865f2;
                  }
                `}
                {...register('checked')}
              >
                <Text fontSize='12px' lineHeight='16px' color='#e0e1e5'>
                  Discordの
                  <ChakraLink
                    as={RouterLink}
                    to='/terms'
                    isExternal
                    color='#00aafc'
                  >
                    サービス利用規約
                  </ChakraLink>
                  及び
                  <ChakraLink
                    as={RouterLink}
                    to='/privacy'
                    isExternal
                    color='#00aafc'
                  >
                    プライバシーポリシー
                  </ChakraLink>
                  を読み、これに同意しました。
                </Text>
              </Checkbox>
            </FormControl>

            <Box w='100%' mt='20px'>
              <Tooltip
                hasArrow
                isDisabled={watchChecked}
                placement='top'
                bg='#f3f4f5'
                color='#1e1f22'
                w='200px'
                label='続けるには、サービス利用規約への同意が必要です'
              >
                <Button
                  type='submit'
                  w='100%'
                  bg='#5865f2'
                  _hover={{backgroundColor: '#4752c4'}}
                  borderRadius='4px'
                  mb='8px'
                  isLoading={isSubmitting}
                  isDisabled={errors.email || errors.password || !watchChecked}
                >
                  <Text color='#e0e1e5' fontWeight='500'>
                    登録
                  </Text>
                </Button>
              </Tooltip>

              <Text color='#989aa2' fontSize='14px' lineHeight='16px'>
                既にアカウントをお持ちですか？
                <ChakraLink
                  as={RouterLink}
                  to='/login'
                  color='#00aafc'
                  ml='4px'
                >
                  ログインページ
                </ChakraLink>
              </Text>
            </Box>
          </Box>
        </form>
      </MotionForm>
    </>
  )
}

export default Register