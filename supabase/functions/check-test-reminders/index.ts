import React from 'npm:react@18.3.1'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { TestReminderEmail } from './_templates/test-reminder.tsx'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReminderMilestone {
  days: number
  type: string
  title: string
  message: string
  emailSubject: string
}

const MILESTONES: ReminderMilestone[] = [
  {
    days: 83,
    type: 'test_reminder_7d_before',
    title: 'Novo preverjanje bo na voljo čez 7 dni',
    message: 'Čez 7 dni bo na voljo novo preverjanje izgovorjave. Pripravite se na naslednjo oceno napredka vašega otroka.',
    emailSubject: 'TomiTalk: Novo preverjanje izgovorjave bo kmalu na voljo',
  },
  {
    days: 90,
    type: 'test_available',
    title: 'Novo preverjanje izgovorjave je na voljo!',
    message: 'Čas je za novo preverjanje izgovorjave. Opravite test za spremljanje napredka vašega otroka.',
    emailSubject: 'TomiTalk: Novo preverjanje izgovorjave je na voljo!',
  },
  {
    days: 93,
    type: 'test_reminder_3d_after',
    title: 'Opomnik: Novo preverjanje čaka',
    message: 'Novo preverjanje izgovorjave je na voljo že 3 dni. Ne pozabite ga opraviti za natančno spremljanje napredka.',
    emailSubject: 'TomiTalk: Opomnik – opravite preverjanje izgovorjave',
  },
  {
    days: 97,
    type: 'test_reminder_7d_after',
    title: 'Zadnji opomnik: Prosimo, opravite preverjanje',
    message: 'Novo preverjanje izgovorjave je na voljo že 7 dni. Redno preverjanje je ključno za spremljanje govornaga napredka.',
    emailSubject: 'TomiTalk: Zadnji opomnik – preverjanje izgovorjave',
  },
]

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const resendApiKey = Deno.env.get('RESEND_API_KEY')!

    const supabase = createClient(supabaseUrl, serviceRoleKey)
    const resend = new Resend(resendApiKey)

    // 1. Get the latest test result per child
    const { data: children, error: childrenError } = await supabase
      .from('children')
      .select('id, name, parent_id')

    if (childrenError) {
      throw new Error(`Error fetching children: ${childrenError.message}`)
    }

    let notificationsSent = 0
    let emailsSent = 0

    for (const child of children || []) {
      // Check if parent has active Pro subscription
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('status, plan_id, current_period_end, cancel_at_period_end')
        .eq('user_id', child.parent_id)
        .maybeSingle()

      // Skip if no Pro subscription
      const isProActive = subscription && (
        (subscription.status === 'active' || subscription.status === 'trialing') ||
        ((subscription.status === 'canceled' || subscription.cancel_at_period_end) &&
          subscription.current_period_end && new Date(subscription.current_period_end) > new Date())
      )
      const isPro = isProActive && subscription.plan_id === 'pro'

      if (!isPro) {
        console.log(`Skipping child ${child.id} - parent has no active Pro subscription`)
        continue
      }

      // Get the latest test result for this child
      const { data: latestTest } = await supabase
        .from('articulation_test_results')
        .select('completed_at')
        .eq('child_id', child.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!latestTest) continue

      const completedAt = new Date(latestTest.completed_at)
      const now = new Date()
      const daysSinceTest = Math.floor((now.getTime() - completedAt.getTime()) / (1000 * 60 * 60 * 24))

      // Calculate smart cooldown: if normal 90-day cooldown would push past
      // subscriptionEnd - 7 days, shorten it
      const subscriptionEnd = subscription.current_period_end
        ? new Date(subscription.current_period_end)
        : null
      const lastTestTarget = subscriptionEnd
        ? new Date(subscriptionEnd.getTime() - 7 * 24 * 60 * 60 * 1000)
        : null

      let nextTestDays = 90
      if (lastTestTarget) {
        const daysToLastTarget = Math.floor(
          (lastTestTarget.getTime() - completedAt.getTime()) / (1000 * 60 * 60 * 24)
        )
        // If normal cooldown (90) overshoots the last-test target, shorten it
        // But minimum 30 days between tests
        if (daysToLastTarget < 90 && daysToLastTarget >= 30) {
          nextTestDays = daysToLastTarget
        }
      }

      // Dynamic milestones based on smart cooldown
      const dynamicMilestones: ReminderMilestone[] = [
        {
          days: nextTestDays - 7,
          type: 'test_reminder_7d_before',
          title: 'Novo preverjanje bo na voljo čez 7 dni',
          message: 'Čez 7 dni bo na voljo novo preverjanje izgovorjave. Pripravite se na naslednjo oceno napredka vašega otroka.',
          emailSubject: 'TomiTalk: Novo preverjanje izgovorjave bo kmalu na voljo',
        },
        {
          days: nextTestDays,
          type: 'test_available',
          title: 'Novo preverjanje izgovorjave je na voljo!',
          message: 'Čas je za novo preverjanje izgovorjave. Opravite test za spremljanje napredka vašega otroka.',
          emailSubject: 'TomiTalk: Novo preverjanje izgovorjave je na voljo!',
        },
        {
          days: nextTestDays + 3,
          type: 'test_reminder_3d_after',
          title: 'Opomnik: Novo preverjanje čaka',
          message: 'Novo preverjanje izgovorjave je na voljo že 3 dni. Ne pozabite ga opraviti za natančno spremljanje napredka.',
          emailSubject: 'TomiTalk: Opomnik – opravite preverjanje izgovorjave',
        },
        {
          days: nextTestDays + 7,
          type: 'test_reminder_7d_after',
          title: 'Zadnji opomnik: Prosimo, opravite preverjanje',
          message: 'Novo preverjanje izgovorjave je na voljo že 7 dni. Redno preverjanje je ključno za spremljanje govornega napredka.',
          emailSubject: 'TomiTalk: Zadnji opomnik – preverjanje izgovorjave',
        },
      ]

      for (const milestone of dynamicMilestones) {
        if (daysSinceTest < milestone.days) continue

        // Check if this notification was already sent
        const { data: existing } = await supabase
          .from('user_notifications')
          .select('id')
          .eq('child_id', child.id)
          .eq('type', milestone.type)
          .eq('user_id', child.parent_id)
          .limit(1)
          .maybeSingle()

        if (existing) continue

        // Insert notification
        const { error: insertError } = await supabase
          .from('user_notifications')
          .insert({
            user_id: child.parent_id,
            child_id: child.id,
            type: milestone.type,
            title: milestone.title,
            message: milestone.message,
            link: '/artikulacijski-test',
            is_read: false,
          })

        if (insertError) {
          console.error(`Error inserting notification for child ${child.id}:`, insertError)
          continue
        }

        notificationsSent++

        // Check email preferences before sending email
        const { data: emailPref } = await supabase
          .from('email_preferences')
          .select('notifications_enabled')
          .eq('user_id', child.parent_id)
          .maybeSingle()

        const notificationsEnabled = emailPref?.notifications_enabled !== false

        if (!notificationsEnabled) {
          console.log(`Email notifications disabled for user ${child.parent_id}, skipping email`)
          continue
        }

        // Get parent email from auth.users
        const { data: userData } = await supabase.auth.admin.getUserById(child.parent_id)

        if (userData?.user?.email) {
          try {
            // Generate unsubscribe token
            const tokenPayload = { sub: child.parent_id, exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 }
            const tokenBase64 = btoa(JSON.stringify({ alg: "none", typ: "JWT" })).replace(/=/g, "") + "." + btoa(JSON.stringify(tokenPayload)).replace(/=/g, "") + "."
            const unsubscribeUrl = `https://tomitalk.com/odjava-obvestil?token=${tokenBase64}`

            const html = await renderAsync(
              React.createElement(TestReminderEmail, {
                childName: child.name,
                title: milestone.title,
                message: milestone.message,
                milestoneType: milestone.type,
                unsubscribeUrl,
              })
            )

            const { error: emailError } = await resend.emails.send({
              from: 'TomiTalk <noreply@tomitalk.si>',
              to: [userData.user.email],
              subject: milestone.emailSubject,
              html,
            })

            if (emailError) {
              console.error(`Error sending email to ${userData.user.email}:`, emailError)
            } else {
              emailsSent++
              console.log(`Email sent to ${userData.user.email} for milestone ${milestone.type}`)
            }
          } catch (emailErr) {
            console.error(`Error rendering/sending email:`, emailErr)
          }
        }
      }
    }

    console.log(`Check-test-reminders completed: ${notificationsSent} notifications, ${emailsSent} emails sent`)

    return new Response(
      JSON.stringify({ success: true, notificationsSent, emailsSent }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in check-test-reminders:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
