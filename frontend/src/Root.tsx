import { ChakraProvider } from '@chakra-ui/react'

import theme from './theme'

import App from './App'

const Root = () => (
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
)

export default Root
