import { Text, Center, Container, Title, Modal, Tabs, TextInput, Checkbox, Group, Button, PasswordInput } from "@mantine/core"
import { Form, useForm } from "@mantine/form"
import { IconUser, IconUserPlus } from "@tabler/icons-react"
import { useAtom } from "jotai"
import { useState } from "react"
import { supabase_s } from "./_app"
import { authenticated_s, currentUser_s } from "./state"

export default function Account({ opened, close }) {

    const [supabase, setSupabase] = useAtom(supabase_s)
    const [currentUser, setCurrentUser] = useAtom(currentUser_s)
    const [authenticated, setAuthenticated] = useAtom(authenticated_s)

    interface LoginForm {
        email: string
        password: string
    }

    async function supabaseLogin(loginValues: LoginForm) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: loginValues.email,
            password: loginValues.password,
        })
        if (error !== null) {
            alert(error)
        } else {
            setAuthenticated(true)
            setCurrentUser(data.user)
        }
        close()
    }

    async function supabaseLogout() {
        const { error } = await supabase.auth.signOut()
        if (error !== null) {
            alert(error)
        } else {
            setAuthenticated(false)
            setCurrentUser(null)
        }
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

    return (
        <Modal title={<Title order={3}>Authentication</Title>} opened={opened} onClose={close}>
            {authenticated === false ?
                <Tabs defaultValue="login">
                    <Tabs.List>
                        <Tabs.Tab value="login" icon={<IconUser size="0.8rem" />}>Login</Tabs.Tab>
                        <Tabs.Tab value="create" icon={<IconUserPlus size="0.8rem" />}>Create New</Tabs.Tab>
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

                            <Group position="right" mt="md">
                                <Button type="submit">Submit</Button>
                            </Group>
                        </form>
                    </Tabs.Panel>

                    <Tabs.Panel value="create" pt="xs">
                        <Text>Coming soon...</Text>
                        <Text fs="italic">(Contact Rio for account creation)</Text>
                    </Tabs.Panel>
                </Tabs>
                :
                <Tabs defaultValue='logout'>
                    <Tabs.Panel value="logout" pt="xs">
                        <Button onClick={() => supabaseLogout()}>Logout</Button>
                    </Tabs.Panel>
                </Tabs>
            }
        </Modal>

    )
}