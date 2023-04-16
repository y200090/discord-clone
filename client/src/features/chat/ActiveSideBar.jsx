import { Avatar, Box, Button, Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { css } from '@emotion/react'
import React from 'react'
import { FaCrown, FaDiscord } from 'react-icons/fa'

const ActiveSideBar = ({ isOpen, header, members, owner }) => {
  
  return (
    <>
      <Flex h='100%' minW={isOpen ? '240px' : '0'} bg='#2b2d31'>
        <Box flex='0 0 auto' h='auto' w='100%' p='0 0 20px'
          display={isOpen ? 'block' : 'none'}
          css={css`
            scrollbar-width: none;
            -ms-overflow-style: none;
            &::-webkit-scrollbar {
              display: none;
            }
          `}
        >
          <Heading color='#949ba4'
            p='24px 8px 0 16px' h='40px' 
            fontSize='12px' fontWeight='600' lineHeight='16px'
            overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'
          >
            {header}
          </Heading>
          <Box maxW='224px' m='0 8px' p='1px 0' borderRadius='4px'>
            {members?.map((member) => (
              <Button key={member?._id} alignItems='center' justifyContent='start'
                h='42px' w='100%' p='0 8px' 
                bg='transparent' borderRadius='4px'
                _hover={{ bg: '#35373c' }}
              >
                <Avatar 
                  flex='0 0 auto' mr='12px'
                  boxSize='32px' bg={member?.color}
                  {...(member?.photoURL
                    ? {src: member?.photoURL}
                    : {icon: <FaDiscord />}
                  )}
                />
                <Flex flex='1 1 auto' align='center' justify='flex-start'>
                  <Text color='#949ba4' flex='0 1 auto'
                    fontSize='16px' fontWeight='400' lineHeight='20px'
                    overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'
                    >
                    {member?.displayName}
                  </Text>
                  {owner._id == member?._id && 
                    <Icon as={FaCrown} boxSize='14px' 
                      flex='0 0 auto' ml='4px' color='#f0b132' 
                    />
                  }
                </Flex>
              </Button>
            ))}
          </Box>
        </Box>
      </Flex>
    </>
  )
}

export default ActiveSideBar