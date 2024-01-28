import { Box, Center, Container, Flex, Group, Image, Space, Stack, Text, Title } from "@mantine/core";

export default function About() {
    return (
        <Center>
            <Container size={'xs'}>
                <Title>About</Title>
                <Space my={'md'} />
                <Flex direction="column">
                    <Text>
                        Tethys (the Greek goddess of freshwater) is a river permit scraper. Brought to you by the NLR.
                    </Text>
                    <Box h={'80vh'} />
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