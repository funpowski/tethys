import { Box, Center, Container, Flex, Group, Image, Space, Stack, Text, Title, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export default function About() {
    const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

    return (
        <Center>
            <Container size={'xs'}>
                {!isMobile && <Title>About</Title>}
                <Space my={'md'} />
                <Flex direction="column">
                    <Text>
                        Tethys (the Greek goddess of freshwater) is a river permit scraper. Brought to you by the NLR.
                    </Text>
                    <Box h={isMobile ? '60vh' : '80vh'} />
                    <Center>
                        <Image
                            src={"/img/nlr.png"}
                            alt="NLR Logo"
                            height={50}
                            width={'auto'}
                            style={{ cursor: 'pointer' }}
                            onClick={() => window.location.href = 'https://www.riomcmahon.me'}
                        />
                    </Center>
                </Flex>
            </Container >
        </Center >
    )
}