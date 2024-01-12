import { Blockquote, Center, Container, Image, Paper, Space, Stack, Text, Title } from "@mantine/core";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export default function About() {
    return (
        <Center>
            <Container size={'sm'}>
                <Title>Tethys</Title>
                <Stack>
                    <Text>
                        Tethys is a permit scraper for rec.gov. Lots of people are applying for river permits every year and it is getting harder and harder to get them.
                    </Text>
                </Stack>
                <Space h="lg" />


                <Title>Alerting</Title>
                <Text>
                    TBD on if this will be publicly available. Alerting for permit cancellations are kind of a zero sum game.
                    If a bunch of people want primo cancellation dates and they're all subscribed to alerts then it becomes a function of who has the quickest trigger finger.
                </Text>
                <Space h="lg" />


                <Title>Data</Title>
                <Blockquote cite='- Booz Allen Hamilton probably'>
                    Yo dawg I heard you like accessing public lands so I put your tax dollars to work® so you can pay us <a href="https://www.nationalparkstraveler.org/2023/02/update-lawsuit-alleges-recreationgov-cluttered-junk-fees-seeks-refunds">fees</a> while losing the lottery every year
                </Blockquote>
                <Text>
                    This project scrapes rec.gov on a regular cadence - every hour an AWS lambda function takes a "snapshot" of the availability calendar and identifies changes in availability state.
                </Text>
                <Space h="lg" />
                <Center>
                    <Image src='/img/recgov_calendar.png' width={'60%'} />
                </Center>
                <Space h="lg" />
                <Text>
                    When an availability transition is detected it is logged to a database and a slack message is sent to users who set up an alert for the given river.
                </Text>
            </Container >
        </Center >
    )
}