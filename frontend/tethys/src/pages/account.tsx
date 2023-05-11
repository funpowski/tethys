import { Text, Center, Container, Title, Modal, Tabs } from "@mantine/core"
import { IconUser, IconUserPlus } from "@tabler/icons-react"
import { useState } from "react"
import 

export default function Account({ opened, close }) {
    return (
        <Modal title={<Title order={3}>Authentication</Title>} opened={opened} onClose={close}>
            <Tabs defaultValue="login">
                <Tabs.List>
                    <Tabs.Tab value="login" icon={<IconUser size="0.8rem" />}>Login</Tabs.Tab>
                    <Tabs.Tab value="create" icon={<IconUserPlus size="0.8rem" />}>Create New</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="login" pt="xs">
                    <form onSubmit={form.onSubmit((values) => console.log(values))}>
                        <TextInput
                            withAsterisk
                            label="Email"
                            placeholder="your@email.com"
                            {...form.getInputProps('email')}
                        />

                        <Checkbox
                            mt="md"
                            label="I agree to sell my privacy"
                            {...form.getInputProps('termsOfService', { type: 'checkbox' })}
                        />

                        <Group position="right" mt="md">
                            <Button type="submit">Submit</Button>
                        </Group>
                    </form>
                </Tabs.Panel>

                <Tabs.Panel value="create" pt="xs">
                    Messages tab content
                </Tabs.Panel>
            </Tabs>
        </Modal>
    )
}