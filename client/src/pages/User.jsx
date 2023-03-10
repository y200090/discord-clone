import { AvatarGroup, Box, Flex, VStack } from '@chakra-ui/react'
import { css } from '@emotion/react'
import React, { useState } from 'react'
import { FaDiscord } from 'react-icons/fa'
import { AiFillMessage, AiOutlinePlus } from 'react-icons/ai'
import { IoMdCompass } from 'react-icons/io'
import { Outlet } from 'react-router-dom'
import { CreateServer, NavIcon } from '../components'
import { useSelector } from 'react-redux'

const User = () => {
  const [isModal, setIsModal] = useState('');
  const currentUser = useSelector((state) => state.auth.currentUser);

  console.log(currentUser)
  
  return (
    <>
      <Flex h='100vh' w='100vw'>
        <Box
          as={'nav'}
          flexShrink='0'
          h='100%'
          w='72px'
          bg='#1e1f22'
        >
          <Box
            h='100%'
            w='100%'
            p='12px 0'
            overflow='auto'
            css={css`
              scrollbar-width: none;
              -ms-overflow-style: none;
              &::-webkit-scrollbar {
                display: none;
              }
            `}
          >
            <VStack>
              <NavIcon 
                toURL={'/channels/@me'} 
                avatarIcon={<FaDiscord size={28} />}
                baseColor={'#f3f4f5'}
                activeBg={'#5865f2'}
              />
              <Box h='2px' w='32px' bg='#35363c' borderRadius='2px' />
              <AvatarGroup
                height='100%'
                width='100%'
                display='flex'
                flexDirection='column-reverse'
                rowGap='8px'
              >
                <NavIcon
                  toURL={'/channels/234508755'}
                  indexURL={'1234567899'}
                />
                <NavIcon
                  avatarIcon={<AiOutlinePlus size={24} />}
                  baseColor={'#23a55a'}
                  activeBg={'#23a55a'}
                  clickFunc={() => setIsModal('create-server')}
                />
                <NavIcon 
                  toURL={'/search'}
                  avatarIcon={<IoMdCompass size={24} />}
                  baseColor={'#23a55a'}
                  activeBg={'#23a55a'}
                />
              </AvatarGroup>
            </VStack>
          </Box>
        </Box>

        <Flex flexGrow='1' h='100%'>
          <Outlet />
        </Flex>

        <CreateServer isModal={isModal} setIsModal={setIsModal} />
      </Flex>
    </>
  )
}

export default User