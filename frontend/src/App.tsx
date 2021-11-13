import { Flex, Center, Square, } from '@chakra-ui/react'
import Helmet from "react-helmet"

import Dashboard from './components/Dashboard'
import Sidebar from './components/Sidebar'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

export default function App() {
  return (
    <>
      <Helmet>
        <title> Tethys </title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
          crossOrigin=""/>
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
         integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
         crossOrigin=""></script>
      </Helmet>
      <Flex color="nord.0">
        <Center h="100vh" bg="nord.1">
          <Sidebar />
        </Center>
        <Square h="100vh" flex="1" bg="nord.0">
          <Dashboard />
        </Square>
      </Flex>
    </>
  )
}
