import { Avatar, AvatarBadge, Box, IconButton, Link as ChakraLink, Text } from '@chakra-ui/react'
import React from 'react'
import { FaDiscord } from 'react-icons/fa'
import { MdClose, MdPeopleAlt } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { useRemoveDMMutation } from '../redux/apis/friendApi'
import { selectCurrentUser } from '../redux/slices/authSlice'

const DirectMessageLink = (props) => {
  const { toURL, photoURL, group, displayName, color, description } = props;
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const [ RemoveDM ] = useRemoveDMMutation();

  const handleRemoveDM = async (e) => {
    e.preventDefault();

    try {
      await RemoveDM({
        currentUserId: currentUser?._id,
        directMessageId: toURL
      });

      navigate('/channels/@me');
      
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Box as={'li'} w='100%' maxW='224px' p='1px 0'>
        <ChakraLink as={NavLink} to={toURL}
          h='42px' minW='0px' p='0 8px' tabIndex={-1}
          display='flex' alignItems='center' justifyContent='start'
          bg='transparent' borderRadius='4px'
          _hover={{ 
            bg: '#35373c', 
            'div > p': {
              color: '#dbdee1'
            },
            'div > span > div': {
              borderColor: '#35373c',
            },
            button: {
              color: '#aaacb0',
              '&:hover': {
                color: '#dbdee1'
              }
            }
          }}
          _activeLink={{ 
            bg: '#404249', 
            '&:hover': { bg: '#35373c' },
            'div > span > div': {
              borderColor: '#404249'
            },
            'div > p': {
              color: '#dbdee1'
            },
          }}
        >
          <Box flex='0 0 auto' h='32px' w='32px' mr='12px'>
            <Avatar boxSize='32px' bg={color}
              {...(photoURL 
                ? {src: photoURL}
                : (group 
                    ? {icon: <MdPeopleAlt />}
                    : {icon: <FaDiscord />}
                  )
              )}
            >
              <AvatarBadge  boxSize='16px' bg='#23a55a' borderColor='#2b2d31' />
            </Avatar>
          </Box>
          <Box flex='1 1 auto' minW='0px' color='#949ba4'
            whiteSpace='nowrap'
            overflow='hidden'
            textOverflow='ellipsis'
          >
            <Text fontSize='16px' lineHeight='20px' fontWeight='500'>
              {displayName}
            </Text>
            <Text mt='-2px'
              fontSize='12px'
              lineHeight='16px'
              fontWeight='500'
              whiteSpace='nowrap'
              overflow='hidden'
              textOverflow='ellipsis'
            >
              {description}
            </Text>
          </Box>

          <IconButton aria-label='delete-dm'
            icon={<MdClose size='20px' />} boxSize='20px'
            minW='20px' m='0 1px 0 auto'
            bg='transparent' color='transparent'
            _hover={{ bg: 'transparent' }}
            onClick={handleRemoveDM}
          />
        </ChakraLink>
      </Box>
    </>
  )
}

export default DirectMessageLink