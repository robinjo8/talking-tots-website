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
    PostgrestVersion: "12.2.3 (519615d)"
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
        Relationships: []
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
      user_role: "admin" | "user"
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
      user_role: ["admin", "user"],
    },
  },
} as const
