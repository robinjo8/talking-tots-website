import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const allowedOrigins = [
  "https://tomitalk.com",
  "https://www.tomitalk.com",
  "https://tomitalk.lovable.app",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin") || "";
  const isAllowed = allowedOrigins.includes(origin) || (origin.startsWith("https://") && origin.endsWith(".lovable.app"));
  const allowOrigin = isAllowed ? origin : allowedOrigins[0];
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: oldSessions, error: sessionsError } = await supabase
      .from('articulation_test_sessions')
      .select(`
        id,
        child_id,
        submitted_at,
        children:child_id (name, age)
      `)
      .eq('status', 'pending')
      .eq('is_completed', true)
      .is('assigned_to', null)
      .lt('submitted_at', sevenDaysAgo.toISOString())

    if (sessionsError) {
      console.error('Error fetching old sessions:', sessionsError)
      throw sessionsError
    }

    if (!oldSessions || oldSessions.length === 0) {
      console.log('No old pending sessions found')
      return new Response(
        JSON.stringify({ message: 'No old pending sessions', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const sessionIds = oldSessions.map(s => s.id)
    
    const { data: existingReminders, error: remindersError } = await supabase
      .from('notifications')
      .select('related_session_id')
      .eq('type', 'reminder')
      .in('related_session_id', sessionIds)

    if (remindersError) {
      console.error('Error checking existing reminders:', remindersError)
      throw remindersError
    }

    const existingReminderIds = new Set(existingReminders?.map(r => r.related_session_id) || [])
    
    const sessionsNeedingReminder = oldSessions.filter(s => !existingReminderIds.has(s.id))

    if (sessionsNeedingReminder.length === 0) {
      console.log('All old sessions already have reminders')
      return new Response(
        JSON.stringify({ message: 'All sessions already notified', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: internalOrgs, error: orgsError } = await supabase
      .from('organizations')
      .select('id')
      .eq('type', 'internal')
      .eq('is_active', true)

    if (orgsError) {
      console.error('Error fetching organizations:', orgsError)
      throw orgsError
    }

    if (!internalOrgs || internalOrgs.length === 0) {
      console.log('No internal organizations found')
      return new Response(
        JSON.stringify({ message: 'No internal organizations', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const now = new Date()
    
    const notifications = sessionsNeedingReminder.flatMap(session => {
      const submittedAt = new Date(session.submitted_at)
      const daysWaiting = Math.floor((now.getTime() - submittedAt.getTime()) / (1000 * 60 * 60 * 24))
      
      const child = session.children as { name: string; age: number } | null
      const childName = child?.name || 'Neznano'
      const childAge = child?.age || '?'

      return internalOrgs.map(org => ({
        organization_id: org.id,
        type: 'reminder' as const,
        title: `Opomnik: Primer čaka ${daysWaiting} dni`,
        message: `${childName}, ${childAge} let - čaka na pregled`,
        link: '/admin/pending',
        related_session_id: session.id,
      }))
    })

    const { data: insertedNotifications, error: insertError } = await supabase
      .from('notifications')
      .insert(notifications)
      .select()

    if (insertError) {
      console.error('Error inserting notifications:', insertError)
      throw insertError
    }

    console.log(`Created ${insertedNotifications?.length || 0} reminder notifications`)

    return new Response(
      JSON.stringify({ 
        message: 'Reminder notifications created', 
        count: insertedNotifications?.length || 0,
        sessions: sessionsNeedingReminder.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in check-old-pending-tests:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    )
  }
})
