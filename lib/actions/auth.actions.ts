'use server'

import { createClient } from '@/lib/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    // Check user's role in our users table to redirect to the right place
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single()

    revalidatePath('/', 'layout')

    if (profile?.role === 'admin') {
        redirect('/admin/dashboard')
    } else {
        redirect('/')
    }
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
    redirect('/')
}
