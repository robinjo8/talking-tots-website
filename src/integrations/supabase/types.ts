export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_permissions: {
        Row: {
          expires_at: string | null
          granted_at: string
          granted_by: string
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["admin_role_type"]
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string
          granted_by: string
          id?: string
          is_active?: boolean
          role: Database["public"]["Enums"]["admin_role_type"]
          user_id: string
        }
        Update: {
          expires_at?: string | null
          granted_at?: string
          granted_by?: string
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["admin_role_type"]
          user_id?: string
        }
        Relationships: []
      }
      archived_children: {
        Row: {
          age: number | null
          archive_id: string | null
          birth_date: string | null
          gender: string | null
          id: string
          name: string | null
          original_child_id: string
          speech_development: Json | null
          speech_difficulties: string[] | null
          speech_difficulties_description: string | null
        }
        Insert: {
          age?: number | null
          archive_id?: string | null
          birth_date?: string | null
          gender?: string | null
          id?: string
          name?: string | null
          original_child_id: string
          speech_development?: Json | null
          speech_difficulties?: string[] | null
          speech_difficulties_description?: string | null
        }
        Update: {
          age?: number | null
          archive_id?: string | null
          birth_date?: string | null
          gender?: string | null
          id?: string
          name?: string | null
          original_child_id?: string
          speech_development?: Json | null
          speech_difficulties?: string[] | null
          speech_difficulties_description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "archived_children_archive_id_fkey"
            columns: ["archive_id"]
            isOneToOne: false
            referencedRelation: "archived_users"
            referencedColumns: ["id"]
          },
        ]
      }
      archived_test_sessions: {
        Row: {
          archive_id: string | null
          assigned_to: string | null
          child_name: string | null
          completed_at: string | null
          id: string
          original_child_id: string | null
          original_session_id: string
          status: string | null
          submitted_at: string | null
          test_data: Json | null
        }
        Insert: {
          archive_id?: string | null
          assigned_to?: string | null
          child_name?: string | null
          completed_at?: string | null
          id?: string
          original_child_id?: string | null
          original_session_id: string
          status?: string | null
          submitted_at?: string | null
          test_data?: Json | null
        }
        Update: {
          archive_id?: string | null
          assigned_to?: string | null
          child_name?: string | null
          completed_at?: string | null
          id?: string
          original_child_id?: string | null
          original_session_id?: string
          status?: string | null
          submitted_at?: string | null
          test_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "archived_test_sessions_archive_id_fkey"
            columns: ["archive_id"]
            isOneToOne: false
            referencedRelation: "archived_users"
            referencedColumns: ["id"]
          },
        ]
      }
      archived_users: {
        Row: {
          archived_at: string | null
          archived_by: string
          deletion_reason: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          original_user_id: string
          scheduled_deletion_at: string | null
          username: string | null
        }
        Insert: {
          archived_at?: string | null
          archived_by: string
          deletion_reason?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          original_user_id: string
          scheduled_deletion_at?: string | null
          username?: string | null
        }
        Update: {
          archived_at?: string | null
          archived_by?: string
          deletion_reason?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          original_user_id?: string
          scheduled_deletion_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      articulation_evaluations: {
        Row: {
          comment: string | null
          created_at: string | null
          evaluated_by: string | null
          id: string
          letter: string
          rating: number | null
          selected_options: string[] | null
          session_id: string
          updated_at: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          evaluated_by?: string | null
          id?: string
          letter: string
          rating?: number | null
          selected_options?: string[] | null
          session_id: string
          updated_at?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          evaluated_by?: string | null
          id?: string
          letter?: string
          rating?: number | null
          selected_options?: string[] | null
          session_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articulation_evaluations_evaluated_by_fkey"
            columns: ["evaluated_by"]
            isOneToOne: false
            referencedRelation: "logopedist_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articulation_evaluations_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "articulation_test_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      articulation_test_results: {
        Row: {
          child_id: string
          completed_at: string
          created_at: string
          id: string
        }
        Insert: {
          child_id: string
          completed_at?: string
          created_at?: string
          id?: string
        }
        Update: {
          child_id?: string
          completed_at?: string
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      articulation_test_sessions: {
        Row: {
          assigned_at: string | null
          assigned_to: string | null
          child_id: string | null
          completed_at: string | null
          created_at: string | null
          current_word_index: number | null
          id: string
          is_completed: boolean | null
          logopedist_child_id: string | null
          notes: string | null
          organization_id: string | null
          parent_id: string
          priority: string | null
          reviewed_at: string | null
          session_number: number | null
          source_type: string | null
          status: Database["public"]["Enums"]["test_session_status"] | null
          submitted_at: string | null
          test_version: string | null
          total_words: number | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_to?: string | null
          child_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          current_word_index?: number | null
          id?: string
          is_completed?: boolean | null
          logopedist_child_id?: string | null
          notes?: string | null
          organization_id?: string | null
          parent_id: string
          priority?: string | null
          reviewed_at?: string | null
          session_number?: number | null
          source_type?: string | null
          status?: Database["public"]["Enums"]["test_session_status"] | null
          submitted_at?: string | null
          test_version?: string | null
          total_words?: number | null
        }
        Update: {
          assigned_at?: string | null
          assigned_to?: string | null
          child_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          current_word_index?: number | null
          id?: string
          is_completed?: boolean | null
          logopedist_child_id?: string | null
          notes?: string | null
          organization_id?: string | null
          parent_id?: string
          priority?: string | null
          reviewed_at?: string | null
          session_number?: number | null
          source_type?: string | null
          status?: Database["public"]["Enums"]["test_session_status"] | null
          submitted_at?: string | null
          test_version?: string | null
          total_words?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "articulation_test_sessions_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "logopedist_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articulation_test_sessions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articulation_test_sessions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children_analytics"
            referencedColumns: ["child_id"]
          },
          {
            foreignKeyName: "articulation_test_sessions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children_analytics_admin"
            referencedColumns: ["child_id"]
          },
          {
            foreignKeyName: "articulation_test_sessions_logopedist_child_id_fkey"
            columns: ["logopedist_child_id"]
            isOneToOne: false
            referencedRelation: "logopedist_children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articulation_test_sessions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      articulation_word_results: {
        Row: {
          ai_accepted: boolean | null
          ai_confidence: number | null
          ai_match_type: string | null
          audio_url: string
          created_at: string | null
          error_type: string | null
          id: string
          letter: string
          logopedist_notes: string | null
          logopedist_rating: Database["public"]["Enums"]["word_rating"] | null
          position: string
          session_id: string
          target_word: string
          transcribed_text: string | null
        }
        Insert: {
          ai_accepted?: boolean | null
          ai_confidence?: number | null
          ai_match_type?: string | null
          audio_url: string
          created_at?: string | null
          error_type?: string | null
          id?: string
          letter: string
          logopedist_notes?: string | null
          logopedist_rating?: Database["public"]["Enums"]["word_rating"] | null
          position: string
          session_id: string
          target_word: string
          transcribed_text?: string | null
        }
        Update: {
          ai_accepted?: boolean | null
          ai_confidence?: number | null
          ai_match_type?: string | null
          audio_url?: string
          created_at?: string | null
          error_type?: string | null
          id?: string
          letter?: string
          logopedist_notes?: string | null
          logopedist_rating?: Database["public"]["Enums"]["word_rating"] | null
          position?: string
          session_id?: string
          target_word?: string
          transcribed_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articulation_word_results_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "articulation_test_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      artikulacijski_test: {
        Row: {
          created_at: string
          id: string
          image_path: string
          letter: string
          order_index: number | null
          word: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_path: string
          letter: string
          order_index?: number | null
          word: string
        }
        Update: {
          created_at?: string
          id?: string
          image_path?: string
          letter?: string
          order_index?: number | null
          word?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string
          actor_type: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
        }
        Insert: {
          action: string
          actor_id: string
          actor_type: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
        }
        Update: {
          action?: string
          actor_id?: string
          actor_type?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
        }
        Relationships: []
      }
      child_documents: {
        Row: {
          child_id: string
          created_at: string | null
          document_type: string
          file_size: number | null
          id: string
          original_filename: string | null
          storage_path: string
          uploaded_by: string
          virus_scan_result: Json | null
          virus_scan_status: string | null
        }
        Insert: {
          child_id: string
          created_at?: string | null
          document_type: string
          file_size?: number | null
          id?: string
          original_filename?: string | null
          storage_path: string
          uploaded_by: string
          virus_scan_result?: Json | null
          virus_scan_status?: string | null
        }
        Update: {
          child_id?: string
          created_at?: string | null
          document_type?: string
          file_size?: number | null
          id?: string
          original_filename?: string | null
          storage_path?: string
          uploaded_by?: string
          virus_scan_result?: Json | null
          virus_scan_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "child_documents_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_documents_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children_analytics"
            referencedColumns: ["child_id"]
          },
          {
            foreignKeyName: "child_documents_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children_analytics_admin"
            referencedColumns: ["child_id"]
          },
        ]
      }
      children: {
        Row: {
          age: number
          avatar_url: string | null
          birth_date: string | null
          created_at: string
          gender: string | null
          id: string
          name: string
          parent_id: string
          speech_development: Json | null
          speech_difficulties: string[] | null
          speech_difficulties_description: string | null
          updated_at: string | null
        }
        Insert: {
          age: number
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          name: string
          parent_id: string
          speech_development?: Json | null
          speech_difficulties?: string[] | null
          speech_difficulties_description?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: number
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          name?: string
          parent_id?: string
          speech_development?: Json | null
          speech_difficulties?: string[] | null
          speech_difficulties_description?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      children_access_log: {
        Row: {
          access_reason: string | null
          access_type: string
          accessed_by: string
          child_id: string
          created_at: string
          id: string
        }
        Insert: {
          access_reason?: string | null
          access_type: string
          accessed_by: string
          child_id: string
          created_at?: string
          id?: string
        }
        Update: {
          access_reason?: string | null
          access_type?: string
          accessed_by?: string
          child_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "children_access_log_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "children_access_log_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children_analytics"
            referencedColumns: ["child_id"]
          },
          {
            foreignKeyName: "children_access_log_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children_analytics_admin"
            referencedColumns: ["child_id"]
          },
        ]
      }
      exercises: {
        Row: {
          age_range_max: number
          age_range_min: number
          category: string
          created_at: string
          description: string
          difficulty_level: number
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          age_range_max: number
          age_range_min: number
          category: string
          created_at?: string
          description: string
          difficulty_level?: number
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          age_range_max?: number
          age_range_min?: number
          category?: string
          created_at?: string
          description?: string
          difficulty_level?: number
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      license_tiers: {
        Row: {
          created_at: string | null
          display_name: string
          features: Json | null
          id: string
          is_active: boolean | null
          max_children: number
          name: string
          price_eur: number
        }
        Insert: {
          created_at?: string | null
          display_name: string
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_children: number
          name: string
          price_eur: number
        }
        Update: {
          created_at?: string | null
          display_name?: string
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_children?: number
          name?: string
          price_eur?: number
        }
        Relationships: []
      }
      logopedist_children: {
        Row: {
          age: number
          avatar_url: string | null
          birth_date: string | null
          created_at: string | null
          external_id: string | null
          gender: string | null
          id: string
          is_active: boolean | null
          logopedist_id: string
          name: string
          notes: string | null
          speech_development: Json | null
          speech_difficulties: string[] | null
          speech_difficulties_description: string | null
          updated_at: string | null
        }
        Insert: {
          age: number
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string | null
          external_id?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean | null
          logopedist_id: string
          name: string
          notes?: string | null
          speech_development?: Json | null
          speech_difficulties?: string[] | null
          speech_difficulties_description?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: number
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string | null
          external_id?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean | null
          logopedist_id?: string
          name?: string
          notes?: string | null
          speech_development?: Json | null
          speech_difficulties?: string[] | null
          speech_difficulties_description?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logopedist_children_logopedist_id_fkey"
            columns: ["logopedist_id"]
            isOneToOne: false
            referencedRelation: "logopedist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      logopedist_licenses: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          license_tier_id: string
          logopedist_id: string
          status: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          license_tier_id: string
          logopedist_id: string
          status?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          license_tier_id?: string
          logopedist_id?: string
          status?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logopedist_licenses_license_tier_id_fkey"
            columns: ["license_tier_id"]
            isOneToOne: false
            referencedRelation: "license_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "logopedist_licenses_logopedist_id_fkey"
            columns: ["logopedist_id"]
            isOneToOne: true
            referencedRelation: "logopedist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      logopedist_profiles: {
        Row: {
          created_at: string | null
          first_name: string
          id: string
          is_verified: boolean | null
          last_name: string
          mfa_enabled: boolean | null
          organization_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          first_name: string
          id?: string
          is_verified?: boolean | null
          last_name: string
          mfa_enabled?: boolean | null
          organization_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          first_name?: string
          id?: string
          is_verified?: boolean | null
          last_name?: string
          mfa_enabled?: boolean | null
          organization_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "logopedist_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      logopedist_reports: {
        Row: {
          created_at: string | null
          findings: Json | null
          id: string
          logopedist_id: string
          next_steps: string | null
          pdf_url: string | null
          recommendations: string | null
          session_id: string | null
          status: Database["public"]["Enums"]["report_status"] | null
          submitted_at: string | null
          summary: string | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          findings?: Json | null
          id?: string
          logopedist_id: string
          next_steps?: string | null
          pdf_url?: string | null
          recommendations?: string | null
          session_id?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
          submitted_at?: string | null
          summary?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          findings?: Json | null
          id?: string
          logopedist_id?: string
          next_steps?: string | null
          pdf_url?: string | null
          recommendations?: string | null
          session_id?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
          submitted_at?: string | null
          summary?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "logopedist_reports_logopedist_id_fkey"
            columns: ["logopedist_id"]
            isOneToOne: false
            referencedRelation: "logopedist_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "logopedist_reports_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "articulation_test_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      media_files: {
        Row: {
          created_at: string
          exercise_id: string | null
          file_path: string
          file_type: string
          id: string
          name: string
          size: number
          word_id: string | null
        }
        Insert: {
          created_at?: string
          exercise_id?: string | null
          file_path: string
          file_type: string
          id?: string
          name: string
          size: number
          word_id?: string | null
        }
        Update: {
          created_at?: string
          exercise_id?: string | null
          file_path?: string
          file_type?: string
          id?: string
          name?: string
          size?: number
          word_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_files_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_files_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "words"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_cards: {
        Row: {
          audio_url: string | null
          id: string
          image_url: string | null
          word: string | null
        }
        Insert: {
          audio_url?: string | null
          id?: string
          image_url?: string | null
          word?: string | null
        }
        Update: {
          audio_url?: string | null
          id?: string
          image_url?: string | null
          word?: string | null
        }
        Relationships: []
      }
      memory_cards_c: {
        Row: {
          audio_url: string | null
          created_at: string
          id: string
          image_url: string | null
          word: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          word?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          word?: string | null
        }
        Relationships: []
      }
      memory_cards_Č: {
        Row: {
          audio_url: string | null
          created_at: string
          id: string
          image_url: string | null
          word: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          word?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          word?: string | null
        }
        Relationships: []
      }
      memory_cards_K: {
        Row: {
          audio_url: string | null
          id: string
          image_url: string | null
          word: string | null
        }
        Insert: {
          audio_url?: string | null
          id?: string
          image_url?: string | null
          word?: string | null
        }
        Update: {
          audio_url?: string | null
          id?: string
          image_url?: string | null
          word?: string | null
        }
        Relationships: []
      }
      memory_cards_l: {
        Row: {
          audio_url: string | null
          created_at: string
          id: string
          image_url: string | null
          word: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          word?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          word?: string | null
        }
        Relationships: []
      }
      memory_cards_r: {
        Row: {
          audio_url: string | null
          created_at: string
          id: string
          image_url: string | null
          word: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          word?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          word?: string | null
        }
        Relationships: []
      }
      memory_cards_S: {
        Row: {
          audio_url: string | null
          id: string
          image_url: string | null
          word: string | null
        }
        Insert: {
          audio_url?: string | null
          id?: string
          image_url?: string | null
          word?: string | null
        }
        Update: {
          audio_url?: string | null
          id?: string
          image_url?: string | null
          word?: string | null
        }
        Relationships: []
      }
      memory_cards_Š_duplicate: {
        Row: {
          audio_url: string | null
          id: string
          image_url: string | null
          word: string | null
        }
        Insert: {
          audio_url?: string | null
          id?: string
          image_url?: string | null
          word?: string | null
        }
        Update: {
          audio_url?: string | null
          id?: string
          image_url?: string | null
          word?: string | null
        }
        Relationships: []
      }
      memory_cards_z: {
        Row: {
          audio_url: string | null
          created_at: string
          id: string
          image_url: string | null
          word: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          word?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          word?: string | null
        }
        Relationships: []
      }
      memory_cards_Ž: {
        Row: {
          audio_url: string | null
          created_at: string
          id: string
          image_url: string | null
          word: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          word?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          word?: string | null
        }
        Relationships: []
      }
      notification_reads: {
        Row: {
          id: string
          notification_id: string
          read_at: string
          user_id: string
        }
        Insert: {
          id?: string
          notification_id: string
          read_at?: string
          user_id: string
        }
        Update: {
          id?: string
          notification_id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_reads_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          organization_id: string
          recipient_id: string | null
          related_session_id: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          organization_id: string
          recipient_id?: string | null
          related_session_id?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          organization_id?: string
          recipient_id?: string | null
          related_session_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_session_id_fkey"
            columns: ["related_session_id"]
            isOneToOne: false
            referencedRelation: "articulation_test_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          type: Database["public"]["Enums"]["organization_type"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type?: Database["public"]["Enums"]["organization_type"]
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: Database["public"]["Enums"]["organization_type"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          postal_code: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      progress: {
        Row: {
          activity_subtype: string | null
          activity_type: Database["public"]["Enums"]["activity_type"] | null
          child_id: string
          completed_at: string
          correct_answers: number
          duration: number
          exercise_id: string
          id: string
          logopedist_child_id: string | null
          score: number
          session_metadata: Json | null
          stars_earned: number | null
          total_questions: number
        }
        Insert: {
          activity_subtype?: string | null
          activity_type?: Database["public"]["Enums"]["activity_type"] | null
          child_id: string
          completed_at?: string
          correct_answers: number
          duration: number
          exercise_id: string
          id?: string
          logopedist_child_id?: string | null
          score: number
          session_metadata?: Json | null
          stars_earned?: number | null
          total_questions: number
        }
        Update: {
          activity_subtype?: string | null
          activity_type?: Database["public"]["Enums"]["activity_type"] | null
          child_id?: string
          completed_at?: string
          correct_answers?: number
          duration?: number
          exercise_id?: string
          id?: string
          logopedist_child_id?: string | null
          score?: number
          session_metadata?: Json | null
          stars_earned?: number | null
          total_questions?: number
        }
        Relationships: [
          {
            foreignKeyName: "progress_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children_analytics"
            referencedColumns: ["child_id"]
          },
          {
            foreignKeyName: "progress_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children_analytics_admin"
            referencedColumns: ["child_id"]
          },
          {
            foreignKeyName: "progress_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_logopedist_child_id_fkey"
            columns: ["logopedist_child_id"]
            isOneToOne: false
            referencedRelation: "logopedist_children"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string | null
          status: string
          stripe_customer_id: string | null
          stripe_product_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_product_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_product_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          role: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          name?: string | null
          role?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          role?: string
        }
        Relationships: []
      }
      words: {
        Row: {
          audio_url: string | null
          category: string | null
          created_at: string
          difficulty_level: number
          id: string
          image_url: string | null
          phonemes: string[]
          word: string
        }
        Insert: {
          audio_url?: string | null
          category?: string | null
          created_at?: string
          difficulty_level?: number
          id?: string
          image_url?: string | null
          phonemes: string[]
          word: string
        }
        Update: {
          audio_url?: string | null
          category?: string | null
          created_at?: string
          difficulty_level?: number
          id?: string
          image_url?: string | null
          phonemes?: string[]
          word?: string
        }
        Relationships: []
      }
    }
    Views: {
      children_analytics: {
        Row: {
          avg_score: number | null
          child_id: string | null
          child_name: string | null
          last_activity_at: string | null
          sessions_count: number | null
          stars_total: number | null
        }
        Relationships: []
      }
      children_analytics_admin: {
        Row: {
          avg_score: number | null
          child_id: string | null
          child_name: string | null
          last_activity_at: string | null
          sessions_count: number | null
          stars_total: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_auth_user_data: { Args: never; Returns: Json }
      get_child_activity_summary: {
        Args: { child_uuid: string }
        Returns: {
          activity_subtype: string
          activity_type: Database["public"]["Enums"]["activity_type"]
          completion_count: number
          total_stars: number
        }[]
      }
      get_child_daily_activities: {
        Args: { child_uuid: string }
        Returns: number
      }
      get_child_total_stars: { Args: { child_uuid: string }; Returns: number }
      get_children_analytics: {
        Args: never
        Returns: {
          avg_score: number
          child_id: string
          child_name: string
          last_activity_at: string
          sessions_count: number
          stars_total: number
        }[]
      }
      get_logopedist_license_stats: {
        Args: { p_user_id: string }
        Returns: {
          available_slots: number
          expires_at: string
          license_name: string
          max_children: number
          status: string
          used_slots: number
        }[]
      }
      get_parent_emails: {
        Args: { parent_ids: string[] }
        Returns: {
          display_name: string
          email: string
          user_id: string
        }[]
      }
      get_user_organization_id: { Args: { _user_id: string }; Returns: string }
      grant_admin_role: {
        Args: {
          p_expires_at?: string
          p_role: Database["public"]["Enums"]["admin_role_type"]
          p_user_id: string
        }
        Returns: undefined
      }
      has_admin_role: {
        Args: { p_role: Database["public"]["Enums"]["admin_role_type"] }
        Returns: boolean
      }
      has_role:
        | {
            Args: {
              _role: Database["public"]["Enums"]["user_role"]
              _user_id: string
            }
            Returns: boolean
          }
        | {
            Args: { role_name: Database["public"]["Enums"]["user_role"] }
            Returns: boolean
          }
      is_internal_logopedist: { Args: { _user_id: string }; Returns: boolean }
      is_logopedist: { Args: { _user_id: string }; Returns: boolean }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
      log_child_access: {
        Args: {
          p_access_reason?: string
          p_access_type: string
          p_child_id: string
        }
        Returns: undefined
      }
      log_security_event: {
        Args: {
          details?: Json
          event_type: string
          ip_address?: unknown
          user_id?: string
        }
        Returns: undefined
      }
      sync_children_from_metadata: { Args: never; Returns: undefined }
      validate_email_format: { Args: { email_input: string }; Returns: boolean }
      validate_password_strength: {
        Args: { password_input: string }
        Returns: Json
      }
    }
    Enums: {
      activity_type: "exercise" | "memory_game" | "puzzle"
      admin_role_type: "super_admin" | "support_admin" | "data_analyst"
      notification_type:
        | "new_test"
        | "assigned"
        | "reminder"
        | "completed_report"
        | "system"
      organization_type: "internal" | "school" | "kindergarten" | "private"
      report_status: "draft" | "submitted" | "revised"
      test_session_status: "pending" | "assigned" | "in_review" | "completed"
      user_role: "admin" | "user" | "logopedist"
      word_rating: "correct" | "partial" | "incorrect" | "unrated"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_type: ["exercise", "memory_game", "puzzle"],
      admin_role_type: ["super_admin", "support_admin", "data_analyst"],
      notification_type: [
        "new_test",
        "assigned",
        "reminder",
        "completed_report",
        "system",
      ],
      organization_type: ["internal", "school", "kindergarten", "private"],
      report_status: ["draft", "submitted", "revised"],
      test_session_status: ["pending", "assigned", "in_review", "completed"],
      user_role: ["admin", "user", "logopedist"],
      word_rating: ["correct", "partial", "incorrect", "unrated"],
    },
  },
} as const
