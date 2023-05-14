import { Box, Flex, Heading, Icon, IconButton, Modal, ModalContent, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { css } from '@emotion/react';
import React from 'react'
import { BiHash } from 'react-icons/bi';
import { FaLock } from 'react-icons/fa';
import { SlClose } from 'react-icons/sl'

const Settings = (props) => {
  const { isOpen, onClose, type, tabItems, Logout, DeleteServer, DeleteChannel, channel } = props;
  const children = [];
  Object.values(tabItems).forEach((tabItem) => {
    Object.values(tabItem).forEach((item) => {
      children.push(item);
    });
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size='full' motionPreset='scale' scrollBehavior='inside'>
        <ModalContent h='100%' w='100%'>
          <Tabs variant='unstyled' h='100%' w='100%' display='flex'>
            <Flex flex='1 0 218px' bg='#2b2d31'>
              <Flex justify='flex-end' h='100%' w='100%'
                flex='1 0 auto' overflow='scroll'
                css={css`
                  &::-webkit-scrollbar {
                    height: 100%;
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
                <Flex as={'nav'} direction='column' h='100%' w='218px' p='60px 6px 60px 20px'>
                  <TabList flexDirection='column' w='100%'>
                    {Object.keys(tabItems).map((tabHeader, i) => (
                      <Flex key={tabHeader} direction='column'>
                        <Heading flexShrink={0} display='flex' flexWrap='wrap' cursor='default' 
                          color='#949ba4' p='0px 10px 6px 10px' textTransform='uppercase'
                          whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'
                          fontSize='12px' lineHeight='16px' fontWeight='700'
                        >
                          {type === 'チャンネル設定' && (
                            <Flex as={'span'} align='center' h='100%' mr='2px' position='relative'>
                              <Icon as={BiHash} boxSize='13px'/>
                              {channel?.privateChannel &&
                                <Icon as={FaLock} boxSize='4px' 
                                  position='absolute' top='4px' left='8px' 
                                  bg='#2b2d31' outline='1.5px solid #2b2d31' 
                                />
                              }
                            </Flex>
                          )}
                          <Text as={'span'}>
                            {tabHeader}
                          </Text>
                          {type === 'チャンネル設定' && (
                            <Text as={'span'} ml='4px' color='#b5bac1'
                              textTransform='uppercase'
                            >
                              {channel?.category}
                            </Text>
                          )}
                        </Heading>
                        {Object.keys(tabItems[tabHeader]).map((tabTitle) => (
                          <Tab key={tabTitle}
                            w='100%' p='6px 10px' mb='2px'
                            justifyContent='start' flexShrink={0}
                            color='#b5bac1' borderRadius='4px'
                            fontSize='16px' lineHeight='20px' fontWeight='500'
                            overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'
                            _hover={{ color: '#f2f3f5', bg: '#35373c' }}
                            _selected={{ 
                              color: '#f2f3f5',
                              bg: '#404249',
                              _hover: { bg: '#35373c' }
                            }}
                          >
                            {tabTitle}
                          </Tab>
                        ))}
                        <Box h='1px' m='8px 10px' bg='#3b3d44' />
                        {(i === Object.keys(tabItems).length - 1) && (
                          type === 'ユーザー設定'
                            ? Logout
                            : type === 'サーバー設定'
                              ? DeleteServer
                              : type === 'チャンネル設定'
                                && DeleteChannel
                        )}
                      </Flex>
                    ))}
                  </TabList>
                </Flex>
              </Flex>
            </Flex>

            <Flex flex='1 1 800px' bg='#313338'>
              <Flex justify='flex-start'
                h='100%' w='100%' overflow='hidden scroll'
                css={css`
                  &::-webkit-scrollbar {
                    height: 100%;
                    width: 16px;
                  }
                  &::-webkit-scrollbar-thumb {
                    background-color: #1a1b1e;
                    border-radius: 100px;
                    border: 4px solid transparent;
                    background-clip: content-box;
                  }
                  &::-webkit-scrollbar-track {
                    background-color: #2b2d31;
                    border-radius: 100px;
                    border: 4px solid transparent;
                    background-clip: content-box;
                  }
                `}
              >
                <TabPanels flex='1 1 auto' minH='100%' maxW='740px'>
                  {children?.map((child) => (
                    <TabPanel key={child.key} p='0'>
                      {child}
                    </TabPanel>
                  ))}
                </TabPanels>
                
                <Box flex='0 0 36px'
                  position='relative' pt='60px' w='60px' mr='21px'
                >
                  <Flex align='center' justify='center' direction='column' position='absolute'>
                    <IconButton aria-label='close-button'
                      icon={<SlClose size='36px' />} size='36px'
                      bg='transparent' color='#b1b5bc'
                      _hover={{
                        color: '#dbdee1',
                        bg: 'transparent',
                        '& + span': {
                          color: '#dbdee1'
                        }
                      }}
                      onClick={onClose}
                    />
                    <Heading as={'span'}
                      mt='8px' color='#b1b5bc' cursor='default'
                      fontSize='14px' fontWeight='600' lineHeight='14px'
                    >
                      ESC
                    </Heading>
                  </Flex>
                </Box>
              </Flex>
            </Flex>
          </Tabs>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Settings