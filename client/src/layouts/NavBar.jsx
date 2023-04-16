import { AvatarGroup, Box, useDisclosure, VStack } from '@chakra-ui/react'
import { css } from '@emotion/react'
import React from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { FaDiscord } from 'react-icons/fa'
import { IoMdCompass } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { CreateServer } from '../features'
import { selectCurrentUser } from '../redux/slices/userSlice'
import NavIcon from '../components/NavIcon'

const NavBar = () => {
  const currentUser = useSelector(selectCurrentUser);
  const servers = currentUser?.joinedServers;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const rest = { 
    isOpen: isOpen, 
    onClose: onClose, 
    currentUser: currentUser 
  };
  
  return (
    <>
      <Box as={'nav'} flexShrink='0' h='100%' w='72px' bg='#1e1f22'>
        <Box h='100%' w='100%' p='12px 0'
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
              title={'ダイレクトメッセージ'}
              avatarIcon={<FaDiscord size={28} />}
              color={{
                active: '#f3f4f5',
                inactive: '#dbdee1'
              }}
              bg={'#5865f2'}
            />
            <Box h='2px' w='32px' bg='#35363c' borderRadius='2px' />
            <AvatarGroup
              h='100%' w='100%'
              display='flex'
              flexDirection='column-reverse'
              rowGap='8px'
            >
              {servers?.map((server) => (
                <NavIcon 
                  key={server?._id}
                  toURL={`/channels/${server?._id}`}
                  indexURL={`${server?.ownedChannels[0]._id}`}
                  title={server?.title}
                  {...(server?.photoURL 
                    ? {photoURL: server?.photoURL} 
                    : {
                      color: {
                        active: '#f3f4f5',
                        inactive: '#dbdee1'
                      },
                      bg: '#5865f2'
                    }
                  )}
                />
              ))}
              <NavIcon
                title={'サーバーを追加'}
                avatarIcon={<AiOutlinePlus size={24} />}
                color={{
                  active: '#f3f4f5',
                  inactive: '#23a55a'
                }}
                bg={'#23a55a'}
                onClick={onOpen}
                isOpen={isOpen}
                onClose={onClose}
              />
              <NavIcon 
                toURL={'/guild-discovery'}
                title={'公開サーバーを探す'}
                avatarIcon={<IoMdCompass size={24} />}
                color={{
                  active: '#f3f4f5',
                  inactive: '#23a55a'
                }}
                bg={'#23a55a'}
              />
            </AvatarGroup>
          </VStack>
        </Box>
      </Box>

      <CreateServer {...rest} />
    </>
  )
}

export default NavBar