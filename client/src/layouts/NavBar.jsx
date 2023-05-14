import { AvatarGroup, Box, useDisclosure, VStack } from '@chakra-ui/react'
import { css } from '@emotion/react'
import React from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { FaDiscord } from 'react-icons/fa'
import { IoMdCompass } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { CreateServerForm } from '../features'
import { selectCurrentUser } from '../redux/slices/userSlice'
import NavIcon from '../components/NavIcon'
import { selectJoinedServers } from '../redux/slices/serverSlice'
import { selectParticipatingChannels } from '../redux/slices/channelSlice'
import { MdPeopleAlt } from 'react-icons/md'

const NavBar = () => {
  const currentUser = useSelector(selectCurrentUser);
  const joinedServers = useSelector(selectJoinedServers);
  const participatingChannels = useSelector(selectParticipatingChannels);
  let notifications = {};
  participatingChannels?.forEach((channel) => {
    let preCount;
    const target = channel?.notifications?.filter((item) => {
      return item.recipient === currentUser?._id;
    });
    
    if (notifications.hasOwnProperty(`${channel?.parentServer?._id}`)) {
      preCount = notifications[`${channel?.parentServer?._id}`];
      notifications[`${channel?.parentServer?._id}`] = preCount + target?.length;

    } else if (channel?.parentServer) {
      notifications[`${channel?.parentServer?._id}`] = target?.length;
    }
  });
  const directMessageIds = currentUser?.setDirectMessages?.map((dm) => {
    return dm?._id;
  });
  const unreadDirectMessages = participatingChannels?.filter((dm) => {
    return directMessageIds?.includes(dm?._id) && dm?.notifications?.length;
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const rest = { 
    isOpen: isOpen, 
    onClose: onClose, 
    currentUser: currentUser 
  };

  return (
    <>
      <Box as={'nav'} flexShrink='0' h='100%' w='72px' bg='#1e1f22'>
        <Box h='100%' w='100%' p='12px 0' overflow='auto'
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
              icon={<FaDiscord size={28} />}
              color={{
                active: '#f3f4f5',
                inactive: '#dbdee1'
              }}
              bg={'#5865f2'}
            />

            {unreadDirectMessages?.length &&
              <AvatarGroup h='100%' w='100%' 
                display='flex' flexDirection='column-reverse' rowGap='8px'
              >
                {unreadDirectMessages?.map((dm) => {
                  const friend = dm?.allowedUsers?.filter((user) => {
                    return user._id != currentUser?._id;
                  });

                  return (
                    <NavIcon key={dm?._id}
                      toURL={`/channels/@me`}
                      indexURL={`${dm?._id}`}
                      title={dm?.category == 'ダイレクトメッセージ'
                        ? friend[0].displayName
                        : dm?.title
                      }
                      {...(dm?.category == 'ダイレクトメッセージ'
                        ? (friend[0]?.photoURL
                          ? {photoURL: friend[0]?.photoURL}
                          : {
                            icon: <FaDiscord size='28px' />,
                            color: {
                              active: '#f3f4f5',
                              inactive: '#dbdee1'
                            },
                            bg: friend[0]?.color
                          }
                        )
                        : {
                          icon: <MdPeopleAlt size={24} />,
                          color: {
                            active: '#f3f4f5',
                            inactive: '#dbdee1'
                          },
                          bg: dm?.color,
                        }
                      )}
                      notifications={dm?.notifications?.length}
                    />
                  )
                })}
              </AvatarGroup>
            }

            <Box h='2px' w='32px' bg='#35363c' borderRadius='2px' />

            <AvatarGroup h='100%' w='100%'
              display='flex' flexDirection='column-reverse' rowGap='8px'
            >
              {joinedServers?.map((server) => {
                return (
                  <NavIcon key={server?._id}
                    toURL={`/channels/${server?._id}`}
                    indexURL={server?.ownedChannels[0]?.category == 'テキストチャンネル' && `${server?.ownedChannels[0]._id}`}
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
                    notifications={notifications[`${server?._id}`]}
                  />
                )
              })}
              
              <NavIcon
                title={'サーバーを追加'}
                icon={<AiOutlinePlus size={24} />}
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
                icon={<IoMdCompass size={24} />}
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

      <CreateServerForm {...rest} />
    </>
  )
}

export default NavBar