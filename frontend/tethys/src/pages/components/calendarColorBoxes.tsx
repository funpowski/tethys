import React from 'react';
import { Text, Box, Group, Stack } from '@mantine/core';

const AvailabilityRange = () => {
    const stepSize = 0.2;

    const boxes = Array.from({ length: Math.ceil(1 / stepSize) + 1 }, (_, index) => {
        const value = index * stepSize;
        const label = value === 0 ? 'less availability' : value === 1 ? 'more availability' : '';

        return (
            <Box key={value}
                style={{
                    height: '20px',
                    width: '20px',
                    backgroundColor: `rgba(60, 179, 113, ${value + stepSize})`,
                    borderRadius: '3px',
                    marginRight: '5px',
                }}
            />
        );
    });

    return (
        <>
            <Stack gap={'xs'}>
                <Group justify="space-between" >
                    <Text size="xs" fs='italic'>Less Availability</Text>
                    <Text size="xs" fs='italic'>More Availability</Text>
                </Group>
                <Group justify="center">
                    {boxes}
                </Group>
            </Stack>
        </>
    )
};

export default AvailabilityRange;
