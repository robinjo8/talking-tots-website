export interface ActivityAggregate {
  gameKey: string;
  displayName: string;
  count: number;
  percentage: number;
  color: string;
  type: 'game' | 'exercise';
}

interface ProgressEntry {
  activity_subtype: string | null;
  activity_type: string;
}

// All 10 games + 1 exercise with their patterns
const categoryPatterns = [
  // Games (10)
  { pattern: /^puzzle_/, key: 'puzzle', name: 'Sestavljanka', type: 'game' as const, color: 'purple' },
  { pattern: /^sliding_puzzle_/, key: 'sliding_puzzle', name: 'Drsna sestavljanka', type: 'game' as const, color: 'blue' },
  { pattern: /^labirint-/, key: 'labirint', name: 'Labirint', type: 'game' as const, color: 'green' },
  { pattern: /^(C|Č|K|L|R|S|Š|Z|Ž)$/, key: 'memory', name: 'Spomin', type: 'game' as const, color: 'orange' },
  { pattern: /^sequence_/, key: 'sequence', name: 'Zaporedja', type: 'game' as const, color: 'teal' },
  { pattern: /^matching_/, key: 'igra_ujemanja', name: 'Igra ujemanja', type: 'game' as const, color: 'rose' },
  { pattern: /^wheel-/, key: 'wheel', name: 'Kolo besed', type: 'game' as const, color: 'amber' },
  { pattern: /^artikulacija_bingo_/, key: 'bingo', name: 'Bingo', type: 'game' as const, color: 'yellow' },
  { pattern: /^smesne-povedi-/, key: 'smesne_povedi', name: 'Smešne povedi', type: 'game' as const, color: 'indigo' },
  { pattern: /^ponovi-poved-/, key: 'ponovi_poved', name: 'Ponovi poved', type: 'game' as const, color: 'cyan' },
  // Exercises (1)
  { pattern: /^vaje_motorike_govoril$/, key: 'tongue_gym', name: 'Vaje za jezik', type: 'exercise' as const, color: 'red' },
];

function matchCategory(subtype: string | null): typeof categoryPatterns[0] | null {
  if (!subtype) return null;
  
  for (const category of categoryPatterns) {
    if (category.pattern.test(subtype)) {
      return category;
    }
  }
  return null;
}

export function aggregateActivities(history: ProgressEntry[]): {
  games: ActivityAggregate[];
  exercises: ActivityAggregate[];
  total: number;
} {
  const counts: Record<string, { count: number; category: typeof categoryPatterns[0] }> = {};
  
  // Count activities per category
  for (const entry of history) {
    const category = matchCategory(entry.activity_subtype);
    if (category) {
      if (!counts[category.key]) {
        counts[category.key] = { count: 0, category };
      }
      counts[category.key].count++;
    }
  }
  
  const total = Object.values(counts).reduce((sum, c) => sum + c.count, 0);
  
  // Build aggregated list for all categories (including those with 0 count)
  const allAggregates: ActivityAggregate[] = categoryPatterns.map((cat) => {
    const countData = counts[cat.key];
    const count = countData?.count || 0;
    return {
      gameKey: cat.key,
      displayName: cat.name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      color: cat.color,
      type: cat.type,
    };
  });
  
  // Separate into games and exercises, sort by count descending
  const games = allAggregates
    .filter((a) => a.type === 'game')
    .sort((a, b) => b.count - a.count);
    
  const exercises = allAggregates
    .filter((a) => a.type === 'exercise')
    .sort((a, b) => b.count - a.count);
  
  return { games, exercises, total };
}
