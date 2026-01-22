-- ============================================
-- SEED: 10 testnih uporabnikov z opravljenimi testi izgovorjave
-- ============================================

-- 1. Začasno onemogočimo FK constrainte
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.children DROP CONSTRAINT IF EXISTS children_parent_id_fkey;

-- 2. Začasno onemogočimo audit triggerje (samo user-defined, ne sistemske)
ALTER TABLE public.children DISABLE TRIGGER audit_children_insert;
ALTER TABLE public.children DISABLE TRIGGER audit_children_update;
ALTER TABLE public.children DISABLE TRIGGER audit_children_delete;

-- 3. Vstavi testne podatke
DO $$
DECLARE
  parent_ids uuid[] := ARRAY[
    'a1000000-0000-0000-0000-000000000001'::uuid,
    'a1000000-0000-0000-0000-000000000002'::uuid,
    'a1000000-0000-0000-0000-000000000003'::uuid,
    'a1000000-0000-0000-0000-000000000004'::uuid,
    'a1000000-0000-0000-0000-000000000005'::uuid,
    'a1000000-0000-0000-0000-000000000006'::uuid,
    'a1000000-0000-0000-0000-000000000007'::uuid,
    'a1000000-0000-0000-0000-000000000008'::uuid,
    'a1000000-0000-0000-0000-000000000009'::uuid,
    'a1000000-0000-0000-0000-000000000010'::uuid
  ];
  
  first_names text[] := ARRAY['Ana', 'Maja', 'Nina', 'Eva', 'Luka', 'Jan', 'Nik', 'Tim', 'Zala', 'Sara'];
  last_names text[] := ARRAY['Novak', 'Horvat', 'Kovač', 'Krajnc', 'Zupan', 'Potočnik', 'Mlakar', 'Kos', 'Vidmar', 'Golob'];
  child_names text[] := ARRAY['Miha', 'Lana', 'Žan', 'Tina', 'Filip', 'Ema', 'Jakob', 'Julija', 'Gašper', 'Pia'];
  genders text[] := ARRAY['male', 'female', 'male', 'female', 'male', 'female', 'male', 'female', 'male', 'female'];
  
  statuses public.test_session_status[] := ARRAY[
    'pending'::public.test_session_status, 
    'pending'::public.test_session_status, 
    'assigned'::public.test_session_status, 
    'assigned'::public.test_session_status, 
    'in_review'::public.test_session_status, 
    'in_review'::public.test_session_status, 
    'completed'::public.test_session_status, 
    'completed'::public.test_session_status, 
    'completed'::public.test_session_status, 
    'completed'::public.test_session_status
  ];
  
  letters text[] := ARRAY['B', 'C', 'Č', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'Š', 'T', 'V', 'Z', 'Ž'];
  
  words text[][] := ARRAY[
    ARRAY['BALON', 'RIBA', 'ZOB'],
    ARRAY['COPATI', 'VILICE', 'LONEC'],
    ARRAY['ČEBELA', 'OČALA', 'KLJUČ'],
    ARRAY['DREVO', 'DUDA', 'LED'],
    ARRAY['FANT', 'TELEFON', 'KROF'],
    ARRAY['GOBA', 'NOGA', 'KROG'],
    ARRAY['HIŠA', 'MUHA', 'KRUH'],
    ARRAY['JABOLKO', 'JAJCE', 'ZMAJ'],
    ARRAY['KAČA', 'ČRKE', 'OBLAK'],
    ARRAY['LADJA', 'KOLO', 'ŠAL'],
    ARRAY['METLA', 'OMARA', 'DIM'],
    ARRAY['NOGAVICE', 'BANANA', 'SLON'],
    ARRAY['PIPA', 'KAPA', 'KLOP'],
    ARRAY['ROKA', 'URA', 'SIR'],
    ARRAY['SOVA', 'KOST', 'PAS'],
    ARRAY['ŠKARJE', 'HRUŠKA', 'KOKOŠ'],
    ARRAY['TROBENTA', 'AVTO', 'LIST'],
    ARRAY['VETERNICA', 'KRAVA', 'LEV'],
    ARRAY['ZEBRA', 'KOZA', 'OBRAZ'],
    ARRAY['ŽABA', 'ROŽA', 'POLŽ']
  ];
  
  positions text[] := ARRAY['začetek', 'sredina', 'konec'];
  
  i int;
  j int;
  k int;
  parent_id uuid;
  child_id uuid;
  session_id uuid;
  child_age int;
  session_num int;
  is_completed boolean;
  random_val float;
  current_rating public.word_rating;
BEGIN
  FOR i IN 1..10 LOOP
    parent_id := parent_ids[i];
    child_id := gen_random_uuid();
    session_id := gen_random_uuid();
    child_age := 4 + ((i - 1) % 3);
    session_num := ((i - 1) % 5) + 1;
    is_completed := statuses[i] = 'completed';
    
    INSERT INTO public.profiles (id, first_name, last_name)
    VALUES (parent_id, first_names[i], last_names[i])
    ON CONFLICT (id) DO NOTHING;
    
    INSERT INTO public.children (id, parent_id, name, age, gender, birth_date)
    VALUES (
      child_id,
      parent_id,
      child_names[i],
      child_age,
      genders[i],
      CURRENT_DATE - (child_age * INTERVAL '1 year')
    );
    
    INSERT INTO public.articulation_test_sessions (
      id, child_id, parent_id, status, submitted_at, test_version
    ) VALUES (
      session_id,
      child_id,
      parent_id,
      statuses[i],
      NOW() - ((11 - i) || ' days')::interval,
      'v1'
    );
    
    FOR j IN 1..20 LOOP
      FOR k IN 1..3 LOOP
        random_val := random();
        
        IF is_completed THEN
          IF random_val > 0.2 THEN
            current_rating := 'correct'::public.word_rating;
          ELSIF random_val > 0.05 THEN
            current_rating := 'partial'::public.word_rating;
          ELSE
            current_rating := 'incorrect'::public.word_rating;
          END IF;
        ELSE
          current_rating := 'unrated'::public.word_rating;
        END IF;
        
        INSERT INTO public.articulation_word_results (
          session_id,
          letter,
          position,
          target_word,
          transcribed_text,
          audio_url,
          ai_accepted,
          ai_confidence,
          ai_match_type,
          logopedist_rating
        ) VALUES (
          session_id,
          letters[j],
          positions[k],
          words[j][k],
          CASE 
            WHEN random() > 0.15 THEN words[j][k]
            ELSE words[j][k] || 'A'
          END,
          'audio-besede/Seja-' || session_num || '/' || letters[j] || '-' || k || '-' || words[j][k] || '.webm',
          random() > 0.15,
          0.75 + (random() * 0.25),
          CASE WHEN random() > 0.15 THEN 'exact' ELSE 'similarity' END,
          current_rating
        );
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

-- 4. Ponovno omogočimo triggerje
ALTER TABLE public.children ENABLE TRIGGER audit_children_insert;
ALTER TABLE public.children ENABLE TRIGGER audit_children_update;
ALTER TABLE public.children ENABLE TRIGGER audit_children_delete;

-- 5. Ponovno omogočimo FK constrainte (NOT VALID da ne preverjamo obstoječih podatkov)
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
NOT VALID;

ALTER TABLE public.children 
ADD CONSTRAINT children_parent_id_fkey 
FOREIGN KEY (parent_id) REFERENCES auth.users(id) ON DELETE CASCADE
NOT VALID;