import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_ANON_KEY!
    )

    // Get request body
    const { userId, userEmail } = await req.json()
    console.log('Received request for user:', { userId, userEmail })

    if (!userId || !userEmail) {
      throw new Error('User ID and email are required')
    }

    // Generate a random password
    const tempPassword = Math.random().toString(36).slice(-8)
    console.log('Generated temporary password')

    // Update user's password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
      { password: tempPassword }
    )

    if (updateError) {
      console.error('Error updating password:', updateError)
      throw updateError
    }

    console.log('Password updated successfully')

    // Send email with new password
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Barber System <onboarding@resend.dev>',
        to: [userEmail],
        subject: 'Sua nova senha',
        html: `
          <h1>Nova Senha</h1>
          <p>Sua senha foi redefinida com sucesso.</p>
          <p>Sua nova senha temporária é: <strong>${tempPassword}</strong></p>
          <p>Por favor, faça login e altere sua senha imediatamente.</p>
        `
      })
    })

    // Log the complete response for debugging
    console.log('Resend API Response Status:', emailResponse.status)
    const responseBody = await emailResponse.text()
    console.log('Resend API Response Body:', responseBody)

    if (!emailResponse.ok) {
      throw new Error(`Failed to send email: ${responseBody}`)
    }

    return new Response(
      JSON.stringify({ message: 'Password reset successful' }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error in reset-password function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})