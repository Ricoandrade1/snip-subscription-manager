export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      barbers: {
        Row: {
          bank_name: string
          birth_date: string
          commission_rate: number
          created_at: string | null
          email: string | null
          iban: string
          id: string
          name: string
          nickname: string | null
          nif: string
          phone: string
          schedule: Json | null
          specialties: string[]
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          bank_name: string
          birth_date: string
          commission_rate?: number
          created_at?: string | null
          email?: string | null
          iban: string
          id?: string
          name: string
          nickname?: string | null
          nif: string
          phone: string
          schedule?: Json | null
          specialties: string[]
          start_date: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          bank_name?: string
          birth_date?: string
          commission_rate?: number
          created_at?: string | null
          email?: string | null
          iban?: string
          id?: string
          name?: string
          nickname?: string | null
          nif?: string
          phone?: string
          schedule?: Json | null
          specialties?: string[]
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string
          barbers: string[] | null
          created_at: string
          email: string | null
          id: string
          name: string
          opening_hours: Json | null
          phone: string
          updated_at: string
        }
        Insert: {
          address: string
          barbers?: string[] | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          opening_hours?: Json | null
          phone: string
          updated_at?: string
        }
        Update: {
          address?: string
          barbers?: string[] | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          opening_hours?: Json | null
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      members: {
        Row: {
          created_at: string | null
          due_date: string | null
          id: string
          name: string
          nickname: string | null
          phone: string | null
          plan_id: number | null
        }
        Insert: {
          created_at?: string | null
          due_date?: string | null
          id?: string
          name: string
          nickname?: string | null
          phone?: string | null
          plan_id?: number | null
        }
        Update: {
          created_at?: string | null
          due_date?: string | null
          id?: string
          name?: string
          nickname?: string | null
          phone?: string | null
          plan_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "members_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          member_id: string | null
          payment_date: string
          receipt_url: string | null
          status: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          member_id?: string | null
          payment_date: string
          receipt_url?: string | null
          status: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          member_id?: string | null
          payment_date?: string
          receipt_url?: string | null
          status?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          features: string[] | null
          id: number
          price: number
          title: string
        }
        Insert: {
          features?: string[] | null
          id?: number
          price: number
          title: string
        }
        Update: {
          features?: string[] | null
          id?: number
          price?: number
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          username?: string | null
        }
        Relationships: []
      }
      visits: {
        Row: {
          barber: string
          created_at: string | null
          id: string
          member_id: string | null
          service: string
          visit_date: string
        }
        Insert: {
          barber: string
          created_at?: string | null
          id?: string
          member_id?: string | null
          service: string
          visit_date: string
        }
        Update: {
          barber?: string
          created_at?: string | null
          id?: string
          member_id?: string | null
          service?: string
          visit_date?: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
