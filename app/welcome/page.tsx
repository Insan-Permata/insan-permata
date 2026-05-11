import { redirect } from 'next/navigation'
import { createClient } from '@/lib/utils/supabase/server'
import WelcomeForm from './WelcomeForm'

export const dynamic = 'force-dynamic'

export default async function WelcomePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login?error=invite_link_invalid')
    }

    return <WelcomeForm email={user.email ?? ''} />
}
