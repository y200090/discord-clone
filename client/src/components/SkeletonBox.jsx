import { Box, Circle, Flex, VStack } from '@chakra-ui/react';
import React from 'react'

const SkeletonBox = () => {
  const skeletonColors = [
    '#313338', 
    '#303337', 
    '#303237', 
    '#2f3236', 
    '#2e3136', 
    '#2e3035', 
    '#2e2f33', 
    '#2d2f33', 
    '#2c2e32', 
    '#2c2e31'
  ];

  return (
    <>
      <VStack 
        p='16px 8px' 
        align='start' 
        rowGap='5px' 
        pointerEvents='none' 
        cursor='default'
      >
        {skeletonColors.map((color) => (
          <Flex align='center' columnGap='8px' key={color}>
            <Circle size='32px' bg={color} />
            <Box h='20px' w='144px' bg={color} borderRadius='10px' />
          </Flex>
        ))}
      </VStack>
    </>
  )
}

export default SkeletonBox