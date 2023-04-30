import { Text, Icon, Box, Tooltip, IconButton, Link as ChakraLink, ButtonGroup, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { BiHash } from 'react-icons/bi'
import { NavLink } from 'react-router-dom'
import { HiSpeakerWave } from 'react-icons/hi2'
import { MdPersonAddAlt1 } from 'react-icons/md'
import { SettingsIcon } from '@chakra-ui/icons'
import { CreateInvitationForm } from '../features'

const ChannelLink = (props) => {
  const { toURL, channelName, category, isAccordionOpen, server } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const rest = {
    isOpen: isOpen,
    onClose: onClose,
    channelName: channelName,
    category: category,
    server: server,
  };
  
  return (
    <>
      <Box as={'li'} className='channel-link' w='100%' listStyleType='none'>
        <ChakraLink as={NavLink} to={'/channels' + toURL}
          w='100%' p='5px 8px' m='1px 0'
          display='flex' alignItems='center'
          borderRadius='4px' color='#82858f'
          tabIndex='-1' zIndex='5'
          {...(!isAccordionOpen && {display: 'none'})}
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

          <ButtonGroup m='0 1px 0 auto' display='none'>
            <Tooltip label='招待を作成'
              hasArrow placement='top'
              p='6px 10px' borderRadius='4px'
              bg='#111214' color='#e0e1e5'
            >
              <IconButton aria-label='招待を作成'
                icon={<MdPersonAddAlt1 size={16} />} size={16}
                bg='transparent' color='#b8b9bf' mr='-4px'
                zIndex={5}
                _hover={{ bg: 'transparent', color: '#dcdde1' }}
                onClick={(e) => {
                  e.preventDefault();
                  onOpen();
                }}
              />
            </Tooltip>
            <Tooltip label='チャンネルの編集'
              hasArrow placement='top'
              p='6px 10px' borderRadius='4px'
              bg='#111214' color='#e0e1e5'
            >
              <IconButton aria-label='チャンネルの編集'
                icon={<SettingsIcon size={16} p='1.5px' />} size={16}
                bg='transparent' color='#b8b9bf'
                _hover={{ bg: 'transparent', color: '#dcdde1' }}
              />
            </Tooltip>
          </ButtonGroup>
        </ChakraLink>
      </Box>

      <CreateInvitationForm {...rest} />
    </>
  )
}

export default ChannelLink