import { Flex, HStack, Text, Icon, Box, Heading, Tooltip, IconButton, VStack, Link as ChakraLink, ButtonGroup } from '@chakra-ui/react'
import { css } from '@emotion/react'
import React, { useState } from 'react'
import { BsPersonPlusFill } from 'react-icons/bs'
import { MdAdd, MdKeyboardArrowDown } from 'react-icons/md'
import { RiSettings5Fill } from 'react-icons/ri'
import { BiHash } from 'react-icons/bi'
import { NavLink } from 'react-router-dom'
import { ChevronDownIcon } from '@chakra-ui/icons'

const Channels = () => {
  const serverName = 'test'
  const [isOpen, setIsOpen] = useState(true);
  
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
          boxShadow='
            0 1px 0 #1f2023, 
            0 1.5px 0 #232528, 
            0 2px 0 #282a2e
          '
          p='12px 16px'
          zIndex='10'
          cursor='pointer'
          _hover={{
            backgroundColor: '#35373c'
          }}
        >
          <HStack h='24px' w='100%' align='center'>
            <Text
              fontSize='16px' 
              lineHeight='20px' 
              fontWeight='600' 
              color='#f3f4f5'
              flex='1 1 0%'
            >
              {serverName}
            </Text>
            <Icon as={MdKeyboardArrowDown} boxSize='24px' color='#cdced0' />
          </HStack>
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
          <Box as={'ul'} w='100%'>
            <Flex
              position='relative'
              as={'li'}
              w='100%'
              p='16px 8px 0 12px'
              mb='2px'
              align='center'
              justify='space-between'
              color='#989aa2'
              _hover={{
                'svg, p': {
                  color: '#e0e1e5'
                }
              }}
              onClick={() => setIsOpen((prevState) => !prevState)}
              cursor='pointer'
            >
              <ChevronDownIcon 
                position='absolute'
                left='-5px'
                boxSize={'14px'}
                transition='transform 0.25s ease'
                {...(!isOpen && {transform: 'rotate(-90deg)'})}
              />
              <Text 
                flex='1 1 auto' 
                overflow='hidden'
                textOverflow='ellipsis'
                whiteSpace='nowrap'
                fontSize='12px'
                lineHeight='16px'
                fontWeight='600'
              >
                テキストチャンネル
              </Text>

              <Tooltip
                label='チャンネルを作成'
                hasArrow
                placement='top'
                bg='#111214'
                color='#e0e1e5'
              >
                <IconButton 
                  icon={<MdAdd size={22} />}
                  aria-label='create-channel'
                  size={'22'}
                  mr='9px'
                  flex='0 0 auto'
                  bg='transparent'
                  _hover={{
                    color: '#e0e1e5',
                    backgroundColor: 'transparent'
                  }}
                />
              </Tooltip>
            </Flex>

            <ChannelLink toURL={'/234508755/1234567899'} ChannelName={'一般'} isOpen={isOpen} />
            <ChannelLink toURL={'/234508755/2444446789'} ChannelName={'ゲーム'} isOpen={isOpen} />
            <ChannelLink toURL={'/234508755/1894534554'} ChannelName={'レゴ'} isOpen={isOpen} />
            <ChannelLink toURL={'/234508755/7934562345'} ChannelName={'好きなもの'} isOpen={isOpen} />
          </Box>
        </Box>
      </Flex>
    </>
  )
}

const ChannelLink = ({ toURL, ChannelName, isOpen }) => {
  return (
    <>
      <Box 
        as={'li'} 
        className='channel-link'
        p='1px 8px 1px 0' 
        w='100%'
        listStyleType='none'
      >
        <ChakraLink
          as={NavLink}
          tabIndex='-1'
          to={'/channels' + toURL}
          w='100%'
          p='5px 8px'
          display='flex'
          alignItems='center'
          borderRadius='4px'
          color='#82858f'
          {...(!isOpen && {display: 'none'})}
          _hover={{
            backgroundColor: '#35373c',
            p: {
              color: '#f3f4f5'
            },
            div: {
              display: 'flex'
            }
          }}
          _activeLink={{
            display: 'flex !important',
            backgroundColor: '#404249',
            p: {
              color: '#f3f4f5'
            },
            div: {
              display: 'flex'
            }
          }}
          zIndex='5'
        >
          <Icon
            as={BiHash}
            boxSize={'24px'}
            mr='6px'
          />
          <Text 
            fontSize='16px'
            lineHeight='20px'
            fontWeight='500'
          >
            {ChannelName}
          </Text>

          <ButtonGroup ml='auto' display='none'>
            <Tooltip
              label='招待を作成'
              hasArrow
              placement='top'
              bg='#111214'
              color='#e0e1e5'
            >
              <IconButton 
                icon={<BsPersonPlusFill size={18} />}
                size={18}
                bg='transparent'
                color='#b8b9bf'
                _hover={{
                  backgroundColor: 'transparent',
                  color: '#dcdde1'
                }}
              />
            </Tooltip>
            <Tooltip
              label='チャンネルの編集'
              hasArrow
              placement='top'
              bg='#111214'
              color='#e0e1e5'
            >
              <IconButton 
                icon={<RiSettings5Fill size={18} />}
                size={18}
                bg='transparent'
                color='#b8b9bf'
                _hover={{
                  backgroundColor: 'transparent',
                  color: '#dcdde1'
                }}
              />
            </Tooltip>
          </ButtonGroup>
        </ChakraLink>
      </Box>
    </>
  )
}

export default Channels