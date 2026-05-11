'use server'

import { createClient } from '@/lib/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function setInitialPassword(formData: FormData) {
    const password = (formData.get('password') as string) ?? ''
    const confirmPassword = (formData.get('confirmPassword') as string) ?? ''

    if (password.length < 8) {
        return { error: 'Password must be at least 8 characters long.' }
    }
    if (password !== confirmPassword) {
        return { error: 'Passwords do not match.' }
    }

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Your session has expired. Please request a new invite link.' }
    }

    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
        return { error: error.message }
    }

    redirect('/my-account')
}
