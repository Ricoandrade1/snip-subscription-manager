import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, userEmail } = await req.json()
    
    if (!userId || !userEmail) {
      throw new Error('User ID and email are required')
    }

    console.log('Attempting to send password reset email to:', userEmail)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Barber System <onboarding@resend.dev>',
        to: userEmail,
        subject: 'Password Reset Request',
        html: `
          <h2>Password Reset Request</h2>
          <p>A password reset was requested for your account.</p>
          <p>If you did not request this change, please ignore this email.</p>
          <p>Your temporary password is: ${generateTemporaryPassword()}</p>
          <p>Please change your password after logging in.</p>
        `
      })
    })

    const data = await res.json()
    console.log('Resend API response:', data)

    if (!res.ok) {
      throw new Error(`Failed to send email: ${JSON.stringify(data)}`)
    }

    return new Response(
      JSON.stringify({ message: 'Password reset email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in reset-password function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

function generateTemporaryPassword() {
  const length = 12
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }
  return password
}