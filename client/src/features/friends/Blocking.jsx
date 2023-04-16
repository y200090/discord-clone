import { Flex, Image, Text } from '@chakra-ui/react';
import React from 'react'
import { NoBlocking } from '../../assets';

const Blocking = ({ currentUser }) => {
  // const blockingUsers = currentUser.
  // const blockingUsersLength = Object.keys(currentUser).length === 0
  //   ? 0
  //   : currentUser?.friends?.blocking?.length;
  
  // if (!blockingUsersLength) {
    return (
      <>
        <Flex m='auto' direction='column' cursor='default'>
          <Image src={NoBlocking}
            flex='0 1 auto' h='200px' w='415px' mb='40px'
          />
          <Text m='auto' color='#949ba4' fontSize='16px' lineHeight='20px'>
            ブロックしているフレンドはいません。
          </Text>
        </Flex>
      </>
    )
  // }
    
  // return (
  //   <>

  //   </>
  // )
}

export default Blocking