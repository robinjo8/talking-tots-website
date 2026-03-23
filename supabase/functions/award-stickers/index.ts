import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Weighted random rarity selection
function pickRarity(): string {
  const roll = Math.random() * 100;
  if (roll < 60) return 'common';
  if (roll < 85) return 'special';
  if (roll < 95) return 'rare';
  return 'legendary';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No auth' }), { status: 401, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify user
    const anonClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!);
    const { data: { user }, error: authError } = await anonClient.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const { child_id, count = 1, reason, include_golden = false } = await req.json();

    if (!child_id || !reason) {
      return new Response(JSON.stringify({ error: 'Missing child_id or reason' }), { status: 400, headers: corsHeaders });
    }

    // Get stickers the child doesn't own yet
    const { data: ownedIds } = await supabase
      .from('child_stickers')
      .select('sticker_id')
      .eq('child_id', child_id);
    
    const ownedSet = new Set((ownedIds || []).map(s => s.sticker_id));

    const { data: allStickers } = await supabase
      .from('album_stickers')
      .select('*');

    if (!allStickers) {
      return new Response(JSON.stringify({ error: 'No stickers found' }), { status: 500, headers: corsHeaders });
    }

    const available = allStickers.filter(s => !ownedSet.has(s.id));
    
    if (available.length === 0) {
      return new Response(JSON.stringify({ awarded: [], message: 'Album complete!' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const awarded: any[] = [];
    const stickerCount = Math.min(count, available.length);

    for (let i = 0; i < stickerCount; i++) {
      const remaining = available.filter(s => !awarded.some(a => a.id === s.id));
      if (remaining.length === 0) break;

      // Pick rarity with fallback
      let targetRarity = pickRarity();
      let candidates = remaining.filter(s => s.rarity === targetRarity);
      
      // Fallback: try other rarities
      if (candidates.length === 0) {
        const fallbackOrder = ['common', 'special', 'rare', 'legendary'];
        for (const r of fallbackOrder) {
          candidates = remaining.filter(s => s.rarity === r);
          if (candidates.length > 0) break;
        }
      }

      if (candidates.length === 0) break;

      const picked = candidates[Math.floor(Math.random() * candidates.length)];
      awarded.push(picked);
    }

    // Insert awarded stickers
    if (awarded.length > 0) {
      const inserts = awarded.map(s => ({
        child_id,
        sticker_id: s.id,
        earned_reason: reason,
        is_golden_version: false,
      }));

      // If include_golden, make first one golden
      if (include_golden && inserts.length > 0) {
        inserts[0].is_golden_version = true;
      }

      const { error: insertError } = await supabase
        .from('child_stickers')
        .insert(inserts);

      if (insertError) {
        console.error('Insert error:', insertError);
        return new Response(JSON.stringify({ error: insertError.message }), { status: 500, headers: corsHeaders });
      }
    }

    return new Response(JSON.stringify({ awarded }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
});
