export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          id: string
          message: string
          severity: string | null
          timestamp: string | null
        }
        Insert: {
          id?: string
          message: string
          severity?: string | null
          timestamp?: string | null
        }
        Update: {
          id?: string
          message?: string
          severity?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          donor_id: string
          id: string
          notes: string | null
          status: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          donor_id: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          donor_id?: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      blood_inventory: {
        Row: {
          blood_type: string
          capacity: number | null
          id: number
          quantity: number
          updated_at: string | null
        }
        Insert: {
          blood_type: string
          capacity?: number | null
          id?: number
          quantity: number
          updated_at?: string | null
        }
        Update: {
          blood_type?: string
          capacity?: number | null
          id?: number
          quantity?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      blood_requests: {
        Row: {
          blood_type: string
          created_at: string | null
          id: number
          quantity: number
          status: string | null
          user_id: string | null
        }
        Insert: {
          blood_type: string
          created_at?: string | null
          id?: number
          quantity: number
          status?: string | null
          user_id?: string | null
        }
        Update: {
          blood_type?: string
          created_at?: string | null
          id?: number
          quantity?: number
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      donations: {
        Row: {
          blood_type: string | null
          donation_date: string | null
          donor_id: string | null
          id: number
          units: number | null
        }
        Insert: {
          blood_type?: string | null
          donation_date?: string | null
          donor_id?: string | null
          id?: number
          units?: number | null
        }
        Update: {
          blood_type?: string | null
          donation_date?: string | null
          donor_id?: string | null
          id?: number
          units?: number | null
        }
        Relationships: []
      }
      donors: {
        Row: {
          address: string
          blood_group: string
          contact: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          address: string
          blood_group: string
          contact: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          address?: string
          blood_group?: string
          contact?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      emergency_requests: {
        Row: {
          blood_type: string
          contact: string
          created_at: string | null
          id: string
          location: string
          name: string
          notes: string | null
          units: number
          urgency: string
        }
        Insert: {
          blood_type: string
          contact: string
          created_at?: string | null
          id?: string
          location: string
          name: string
          notes?: string | null
          units: number
          urgency: string
        }
        Update: {
          blood_type?: string
          contact?: string
          created_at?: string | null
          id?: string
          location?: string
          name?: string
          notes?: string | null
          units?: number
          urgency?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          blood_type: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: number
          phone: string | null
          role: string
          user_id: string | null
        }
        Insert: {
          blood_type?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: number
          phone?: string | null
          role: string
          user_id?: string | null
        }
        Update: {
          blood_type?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: number
          phone?: string | null
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
