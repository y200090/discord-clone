import { Avatar, Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { FaDiscord } from 'react-icons/fa'
import { HiArrowNarrowRight } from 'react-icons/hi'
import InvitationLink from './InvitationLink';

const MessageBox = ({ message, dateFlag }) => {
  const createdAt = new Date(message.createdAt);
  const dateTime = new Date();
  const today = (createdAt.getFullYear() + (createdAt.getMonth() + 1) + createdAt.getDate()) === (dateTime.getFullYear() + (dateTime.getMonth() + 1) + dateTime.getDate());
  const postTime = createdAt.getFullYear() + '/' + 
    ('0' + (createdAt.getMonth() + 1)).slice(-2) + '/' + 
    ('0' + (createdAt.getDate())).slice(-2);
  const postDate = ' ' + 
    ('0' + (createdAt.getHours())).slice(-2) + ':' + 
    ('0' + (createdAt.getMinutes())).slice(-2);

  return (
    <>
      <Flex align='center' p='2px 0 2px 1rem'
        {...(!dateFlag && {minH: message.type != 'アナウンス' && '2.75rem'})}
        _hover={{ 
          bg: '#2e3035', 
          span: {
            opacity: '1'
          }
        }}
      >
        {message.type == 'アナウンス'
          ? (
            <>
              <Avatar bg='transparent' mt='auto' h='auto' w='40px'
                icon={<HiArrowNarrowRight size='20px' color='#3a9657' />}
              />
              <Box pl='15px'
                fontSize='1rem' fontWeight='500' lineHeight='1.375rem'
              >
                <Text as={'span'} color='#fefefe' cursor='pointer'
                  _hover={{ textDecoration: 'underline' }}
                >
                  {message.sender.displayName}
                </Text>
                <Text as={'span'} color='#949ba4'>
                  {message.body.replace(message.sender.displayName, '')}
                </Text>
              </Box>
              <Text as={'span'} ml='0.5rem' color='#949ba4' cursor='default'
                fontSize='0.75rem' lineHeight='1.375rem' fontWeight='400'
              >
                {(today ? '今日' : postTime) + postDate}
              </Text>
            </>
          )
          : (
            <>
              {dateFlag
                ? (
                  <Text as={'span'} w='40px' textAlign='end' mb='auto'
                    color='#949ba4' opacity={0}
                    fontSize='0.6875rem' lineHeight='1.375rem'
                  >
                    {postDate}
                  </Text>
                )
                : (
                  <Avatar boxSize='40px' m='calc(4px - 0.125rem) 0 auto'
                    {...(message.sender.photoURL
                      ? {src: message.sender.photoURL}
                      : {
                        icon: <FaDiscord size='26px' />,
                        bg: message.sender.color
                      }
                    )}
                  />
                )
              }

              <Box pl='15px' flex='1 1 auto'>
                <Box as={'h3'} maxH='1.375rem' 
                  lineHeight='1.375rem' whiteSpace='break-spaces'
                  display={dateFlag && 'none'}
                >
                  <Text as={'span'} color='#f2f3f5' cursor='pointer'
                    fontSize='1rem' fontWeight='500' lineHeight='1.375rem'
                    _hover={{ textDecoration: 'underline' }}
                  >
                    {message.sender.displayName} 
                  </Text>
                  <Text as={'span'} ml='0.5rem' color='#949ba4' cursor='default'
                    fontSize='0.75rem' lineHeight='1.375rem' fontWeight='400'
                  >
                    {(today ? '今日' : postTime) + postDate}
                  </Text>
                </Box>
                <Text as={'div'} color='#dbdee1' 
                  fontSize='1rem' lineHeight='1.375rem' whiteSpace='break-spaces'
                >
                  {message.type === '招待リンク'
                    ? <InvitationLink message={message} />
                    : message.body
                  }
                </Text>
              </Box>
            </>
          )
        }
      </Flex>
    </>
  )
}

export default MessageBox