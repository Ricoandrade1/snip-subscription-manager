import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { userId, userEmail } = await req.json()
    
    console.log('Attempting to reset password for:', { userId, userEmail })
    
    // Initialize Supabase client with admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // First verify if the user exists in auth.users
    const { data: userData, error: userError } = await supabaseAdmin
      .from('auth.users')
      .select('id')
      .eq('email', userEmail)
      .single()

    if (userError) {
      console.error('Error finding user:', userError)
      return new Response(
        JSON.stringify({ error: 'User not found in auth system' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    // Update user's password to '123456'
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userData.id,
      { password: '123456' }
    )

    if (updateError) {
      console.error('Error updating password:', updateError)
      throw updateError
    }

    // Send email using Resend
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY')
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Barber System <onboarding@resend.dev>',
        to: [userEmail],
        subject: 'Sua senha foi redefinida',
        html: `
          <h1>Sua senha foi redefinida</h1>
          <p>Sua nova senha é: <strong>123456</strong></p>
          <p>Por favor, altere sua senha após o primeiro acesso.</p>
        `,
      }),
    })

    if (!emailResponse.ok) {
      console.error('Error sending email:', await emailResponse.text())
      throw new Error('Failed to send email')
    }

    return new Response(
      JSON.stringify({ message: 'Password reset successful' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})