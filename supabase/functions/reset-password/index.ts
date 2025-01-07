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

    // First list users to find the one with matching email
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      console.error('Error listing users:', listError)
      throw listError
    }

    const user = users.users.find(u => u.email === userEmail)
    
    if (!user) {
      console.error('User not found with email:', userEmail)
      return new Response(
        JSON.stringify({ error: 'User not found with provided email' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    console.log('Found user:', user.id)

    // Update user's password to '123456'
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
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

    console.log('Attempting to send email to:', userEmail)

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
      const errorText = await emailResponse.text()
      console.error('Error sending email:', errorText)
      throw new Error(`Failed to send email: ${errorText}`)
    }

    const emailData = await emailResponse.json()
    console.log('Email sent successfully:', emailData)

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