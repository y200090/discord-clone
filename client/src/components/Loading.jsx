import { Box, Container, Flex, Text } from '@chakra-ui/react'
import React from 'react'

const Loading = () => {
  return (
    <>
      <Box bg='#2b2d31'>
        <Container
          h='100vh'
          w='100%'
          centerContent
        >
          <Flex h='100%' align='center'>
            <Text color='#fff'>
              ローディング中
            </Text>
          </Flex>
        </Container>
      </Box>
    </>
  )
}

export default Loading