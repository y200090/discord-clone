import { Text, Icon, Box, Tooltip, IconButton, Link as ChakraLink, ButtonGroup } from '@chakra-ui/react'
import React from 'react'
import { BsPersonPlusFill } from 'react-icons/bs'
import { RiSettings5Fill } from 'react-icons/ri'
import { BiHash } from 'react-icons/bi'
import { NavLink } from 'react-router-dom'
import { HiSpeakerWave } from 'react-icons/hi2'

const ChannelLink = (props) => {
  const { toURL, channelName, category, isOpen } = props;
  
  return (
    <>
      <Box as={'li'} className='channel-link' w='100%' listStyleType='none'>
        <ChakraLink as={NavLink} to={'/channels' + toURL}
          w='100%' p='5px 8px' m='1px 0'
          display='flex' alignItems='center'
          borderRadius='4px' color='#82858f'
          tabIndex='-1' zIndex='5'
          {...(!isOpen && {display: 'none'})}
          _hover={{
            bg: '#35373c',
            p: {
              color: '#f3f4f5'
            },
            div: {
              display: 'flex'
            }
          }}
          _activeLink={{
            display: 'flex !important',
            bg: '#404249',
            p: {
              color: '#f3f4f5'
            },
            div: {
              display: 'flex'
            }
          }}
        >
          {category === 'テキストチャンネル'
            ? <Icon as={BiHash} boxSize={'24px'} mr='6px' />
            : category === 'ボイスチャンネル'
              && <Icon as={HiSpeakerWave} boxSize={'22px'} mr='8px' />
          }
          
          <Text 
            fontSize='16px' lineHeight='20px' fontWeight='500'
            overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'
          >
            {channelName}
          </Text>

          <ButtonGroup ml='auto' display='none'>
            <Tooltip label='招待を作成'
              hasArrow placement='top'
              bg='#111214' color='#e0e1e5'
            >
              <IconButton aria-label='招待を作成'
                icon={<BsPersonPlusFill size={18} />} size={18}
                bg='transparent' color='#b8b9bf'
                _hover={{ bg: 'transparent', color: '#dcdde1' }}
              />
            </Tooltip>
            <Tooltip label='チャンネルの編集'
              hasArrow placement='top'
              bg='#111214' color='#e0e1e5'
            >
              <IconButton aria-label='チャンネルの編集'
                icon={<RiSettings5Fill size={18} />} size={18}
                bg='transparent' color='#b8b9bf'
                _hover={{ bg: 'transparent', color: '#dcdde1' }}
              />
            </Tooltip>
          </ButtonGroup>
        </ChakraLink>
      </Box>
    </>
  )
}

export default ChannelLink