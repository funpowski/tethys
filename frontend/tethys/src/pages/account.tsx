import { Text, Center, Container, Title, Modal, Tabs, TextInput, Checkbox, Group, Button, PasswordInput, Box, Space, rem } from "@mantine/core"
import { Form, useForm } from "@mantine/form"
import { IconUser, IconUserPlus } from "@tabler/icons-react"
import { useAtom } from "jotai"
import { useState } from "react"
import { supabase_s } from "./_app"
import { authenticated_s, currentUser_s } from "./state"
import { SupabaseUser } from "./state"
import { error } from "console"

export default function Account() {

    const [supabase, setSupabase] = useAtom(supabase_s)
    const [currentUser, setCurrentUser] = useAtom(currentUser_s)
    const [authenticated, setAuthenticated] = useAtom(authenticated_s)

    interface LoginForm {
        email: string
        password: string
    }

    async function supabaseLogin(loginValues: LoginForm) {
        await supabase?.auth.signInWithPassword({
            email: loginValues.email,
            password: loginValues.password,
        }).then((data) => {
            setAuthenticated(true)
            setCurrentUser(data.data.user as unknown as SupabaseUser)
        }).catch((error) => {
            alert(error)
        })
        close()
    }

    async function supabaseLogout() {
        await supabase?.auth.signOut().then((response) => {
            setAuthenticated(false)
            setCurrentUser(null)
        }).catch((error) => {
            alert(error)
        })
        close()

    }

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    const iconStyle = { width: rem(15), height: rem(15) };

    return (
        <Center>
            <Container size={'xs'}>
                <Box style={{
                    width: '30vw'
                }}>

                    <Title>Account</Title>
                    <Space my={'md'} />
                    {authenticated === false ?
                        <Tabs defaultValue="login">
                            <Tabs.List>
                                <Tabs.Tab value="login" leftSection={<IconUser style={iconStyle} />}>Login</Tabs.Tab>
                                <Tabs.Tab value="create" leftSection={<IconUserPlus style={iconStyle} />}>Create New</Tabs.Tab>
                            </Tabs.List>

                            <Tabs.Panel value="login" pt="xs">
                                <form onSubmit={form.onSubmit((values) => supabaseLogin(values))}>
                                    <TextInput
                                        withAsterisk
                                        label="Email"
                                        placeholder="your@email.com"
                                        {...form.getInputProps('email')}
                                    />
                                    <PasswordInput
                                        placeholder="Password"
                                        label="Password"
                                        withAsterisk
                                        {...form.getInputProps('password')}
                                    />

                                    <Group mt="md">
                                        <Button type="submit">Submit</Button>
                                    </Group>
                                </form>
                            </Tabs.Panel>

                            <Tabs.Panel value="create" pt="xs">
                                <Text fs="italic">(Not enabled currently...)</Text>
                            </Tabs.Panel>
                        </Tabs>
                        :
                        <Tabs defaultValue='logout'>
                            <Tabs.Panel value="logout" pt="xs">
                                <Button onClick={() => supabaseLogout()}>Logout</Button>
                            </Tabs.Panel>
                        </Tabs>
                    }
                </Box>
            </Container>
        </Center >
    )
}