import { Blockquote, Center, Container, Image, Paper, Space, Text, Title } from "@mantine/core";

export default function Home() {
    return (
        <Center>
            <Container size={'sm'}>
                <Title>What is it?</Title>
                <Text>
                    Tethys is a permit scraper for rec.gov. Lots of people are applying for river permits every year and it is getting harder and harder to get them.
                </Text>
                <Space h="md" />
                <Text>
                    This project scrapes rec.gov on a regular cadence - it takes "snapshots" of the availability calendar and identifies changes in availability state:
                </Text>
                <Space h="md" />
                <Center>
                    <Image src='/img/recgov_calendar.png' width={'60%'} />
                </Center>
                <Space h="md" />
                <Text>
                    When an availability transition is detected it is logged to a database and a slack message is sent to users who set up an alert for the given river.
                </Text>
                <Space h="md" />

                <Space h="lg" />
                <Title>Is Alerting Publicly Available?</Title>
                <Text>
                    TBD. Alerting for permit cancellations are kind of a zero sum game.
                    If a bunch of people want primo cancellation dates and they're all subscribed to alerts then it becomes a function of who has the quickest trigger finger.
                    If you're interested hit me up: <a href={`mailto:rmcsqrd@gmail.com`}>rmcsqrd@gmail.com</a>
                </Text>

                <Space h="lg" />
                <Title>What users are saying:</Title>
                <Blockquote cite="– My Dad">
                    this is impressive, tell no one
                </Blockquote>
                <Blockquote cite="– also My Dad">
                    You aren't the only person doing this, I wouldn't even bother
                </Blockquote>
            </Container >
        </Center >
    )
}