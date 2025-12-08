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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          business_id: string
          contact_id: string | null
          created_at: string
          description: string | null
          end_time: string
          id: string
          lead_id: string | null
          location: string | null
          start_time: string
          status: Database["public"]["Enums"]["appointment_status"]
          title: string
          updated_at: string
        }
        Insert: {
          business_id: string
          contact_id?: string | null
          created_at?: string
          description?: string | null
          end_time: string
          id?: string
          lead_id?: string | null
          location?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["appointment_status"]
          title: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          contact_id?: string | null
          created_at?: string
          description?: string | null
          end_time?: string
          id?: string
          lead_id?: string | null
          location?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      automations: {
        Row: {
          action_config: Json | null
          active: boolean | null
          business_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          trigger_config: Json | null
          trigger_type: string
          updated_at: string
        }
        Insert: {
          action_config?: Json | null
          active?: boolean | null
          business_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          trigger_config?: Json | null
          trigger_type: string
          updated_at?: string
        }
        Update: {
          action_config?: Json | null
          active?: boolean | null
          business_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          trigger_config?: Json | null
          trigger_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "automations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          brand_voice: string | null
          created_at: string
          id: string
          industry: string | null
          name: string
          timezone: string | null
          updated_at: string
        }
        Insert: {
          brand_voice?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          name: string
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          brand_voice?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          name?: string
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          business_id: string
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string | null
          lifetime_value: number | null
          notes: string | null
          phone: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          last_name?: string | null
          lifetime_value?: number | null
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string | null
          lifetime_value?: number | null
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          business_id: string
          contact_id: string
          created_at: string
          id: string
          last_activity_at: string | null
          lead_source: string | null
          notes: string | null
          score: number | null
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
        }
        Insert: {
          business_id: string
          contact_id: string
          created_at?: string
          id?: string
          last_activity_at?: string | null
          lead_source?: string | null
          notes?: string | null
          score?: number | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Update: {
          business_id?: string
          contact_id?: string
          created_at?: string
          id?: string
          last_activity_at?: string | null
          lead_source?: string | null
          notes?: string | null
          score?: number | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          ai_generated: boolean | null
          business_id: string
          channel: Database["public"]["Enums"]["message_channel"]
          contact_id: string
          created_at: string
          direction: Database["public"]["Enums"]["message_direction"]
          id: string
          message_body: string
          read: boolean | null
          subject: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          business_id: string
          channel: Database["public"]["Enums"]["message_channel"]
          contact_id: string
          created_at?: string
          direction: Database["public"]["Enums"]["message_direction"]
          id?: string
          message_body: string
          read?: boolean | null
          subject?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          business_id?: string
          channel?: Database["public"]["Enums"]["message_channel"]
          contact_id?: string
          created_at?: string
          direction?: Database["public"]["Enums"]["message_direction"]
          id?: string
          message_body?: string
          read?: boolean | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          business_id: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          business_id?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          business_id?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          amount: number
          business_id: string
          contact_id: string | null
          content: Json | null
          created_at: string
          document_url: string | null
          id: string
          lead_id: string | null
          signed_at: string | null
          status: Database["public"]["Enums"]["proposal_status"]
          title: string
          updated_at: string
          viewed_at: string | null
        }
        Insert: {
          amount?: number
          business_id: string
          contact_id?: string | null
          content?: Json | null
          created_at?: string
          document_url?: string | null
          id?: string
          lead_id?: string | null
          signed_at?: string | null
          status?: Database["public"]["Enums"]["proposal_status"]
          title: string
          updated_at?: string
          viewed_at?: string | null
        }
        Update: {
          amount?: number
          business_id?: string
          contact_id?: string | null
          content?: Json | null
          created_at?: string
          document_url?: string | null
          id?: string
          lead_id?: string | null
          signed_at?: string | null
          status?: Database["public"]["Enums"]["proposal_status"]
          title?: string
          updated_at?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assignee_user_id: string | null
          business_id: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: Database["public"]["Enums"]["task_priority"]
          recurrence_pattern: string | null
          recurring: boolean | null
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assignee_user_id?: string | null
          business_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          recurrence_pattern?: string | null
          recurring?: boolean | null
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assignee_user_id?: string | null
          business_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          recurrence_pattern?: string | null
          recurring?: boolean | null
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          ai_categorized: boolean | null
          amount: number
          business_id: string
          category: string | null
          contact_id: string | null
          created_at: string
          date: string
          description: string | null
          id: string
          lead_id: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
        }
        Insert: {
          ai_categorized?: boolean | null
          amount: number
          business_id: string
          category?: string | null
          contact_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          lead_id?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Update: {
          ai_categorized?: boolean | null
          amount?: number
          business_id?: string
          category?: string | null
          contact_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          lead_id?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_business_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      user_belongs_to_business: {
        Args: { _business_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "owner" | "admin" | "team_member"
      appointment_status: "scheduled" | "completed" | "no_show" | "cancelled"
      lead_status: "new" | "contacted" | "qualified" | "won" | "lost"
      message_channel: "sms" | "email" | "instagram" | "facebook"
      message_direction: "sent" | "received"
      proposal_status: "draft" | "sent" | "viewed" | "accepted" | "rejected"
      task_priority: "low" | "medium" | "high"
      task_status: "open" | "in_progress" | "completed" | "blocked"
      transaction_type: "revenue" | "expense"
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
      app_role: ["owner", "admin", "team_member"],
      appointment_status: ["scheduled", "completed", "no_show", "cancelled"],
      lead_status: ["new", "contacted", "qualified", "won", "lost"],
      message_channel: ["sms", "email", "instagram", "facebook"],
      message_direction: ["sent", "received"],
      proposal_status: ["draft", "sent", "viewed", "accepted", "rejected"],
      task_priority: ["low", "medium", "high"],
      task_status: ["open", "in_progress", "completed", "blocked"],
      transaction_type: ["revenue", "expense"],
    },
  },
} as const
