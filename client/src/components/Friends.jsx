import { Box, Button, Flex, Heading, IconButton, Text, Tooltip } from '@chakra-ui/react'
import { css } from '@emotion/react'
import React from 'react'
import { BsPersonCheckFill } from 'react-icons/bs'
import { MdAdd } from 'react-icons/md'
import SkeletonBox from '../assets/SkeletonBox'

const Friends = () => {
  return (
    <>
      <Flex
        as={'nav'}
        w='240px'
        flex='0 0 auto'
        flexDirection='column'
        bg='#2b2d31'
      >
        <Flex
          h='48px'
          w='100%'
          flex='0 0 auto'
          align='center'
          boxShadow='
            0 1px 0 #1f2023, 
            0 1.5px 0 #232528, 
            0 2px 0 #282a2e
          '
          p='0 10px'
          zIndex='10'
        >
          <Button
            h='28px'
            w='100%'
            display='inline-block'
            p='1px 6px'
            outline='none'
            border='none'
            textAlign='left'
            bg='#1e1f22'
            color='#989aa2'
            borderRadius='4px'
            fontSize='14px'
            lineHeight='22px'
            fontWeight='500'
            whiteSpace='nowrap'
            _hover={{
              opacity: '1',
              backgroundColor: '#1e1f22'
            }}
          >
            トークに参加または作成する
          </Button>
        </Flex>

        <Box
          w='100%'
          p='0 0 0 8px'
          flex='1 1 auto'
          overflow='auto'
          css={css`
            &::-webkit-scrollbar {
                width: 8px;
              }
              &::-webkit-scrollbar-thumb {
                background-color: transparent;
                border-radius: 100px;
                border: 2px solid transparent;
                background-clip: content-box;
              }
            &:hover {
              &::-webkit-scrollbar-thumb {
                background-color: #1a1b1e;
              }
            }
          `}
        >
          <Box h='42px' w='100%' mt='9px'>
            <Button 
              leftIcon={
                <BsPersonCheckFill size={24} />
              }
              justifyContent='flex-start'
              columnGap='4px'
              h='100%'
              w='100%'
              color='#f3f4f5'
              bg='#404249'
              borderRadius='4px'
              lineHeight='20px'
              fontWeight='500'
              _hover={{
                backgroundColor: '#35373c'
              }}
            >
              フレンド
            </Button>
          </Box>

          <Heading
            h='40px'
            display='flex'
            padding='18px 8px 4px 10px'
            fontSize='12px'
            lineHeight='16px'
            fontWeight='600'
            color='#989aa2'
            _hover={{
              color: '#e0e1e5',
              button: {
                backgroundColor: 'transparent'
              }
            }}
          >
            <Text flex='1 1 0%' cursor='default'>
              ダイレクトメッセージ
            </Text>

            <Tooltip
              label='DMを追加'
              hasArrow
              placement='top'
              bg='#111214'
              color='#e0e1e5'
            >
              <IconButton
                aria-label='add-dm'
                size={'22'}
                mr='2px'
                flex='0 1 0%'
                bg='transparent'
                icon={<MdAdd size={22} />}
              />
            </Tooltip>
          </Heading>

          <Flex flexDirection='column' rowGap='12px' p='16px 8px' mb='200px'>
            <SkeletonBox />
          </Flex>
        </Box>
      </Flex>
    </>
  )
}

export default Friends