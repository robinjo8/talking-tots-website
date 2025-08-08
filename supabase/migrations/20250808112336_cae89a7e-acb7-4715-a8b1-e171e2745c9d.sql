-- Fix the word ČOKLA to COKLA in memory_cards_c table
UPDATE memory_cards_c 
SET word = 'COKLA' 
WHERE word = 'ČOKLA';