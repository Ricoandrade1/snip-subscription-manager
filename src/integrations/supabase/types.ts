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
          image_url: string | null
          name: string
          nickname: string | null
          nif: string
          phone: string
          roles: Database["public"]["Enums"]["user_authority"][] | null
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
          image_url?: string | null
          name: string
          nickname?: string | null
          nif: string
          phone: string
          roles?: Database["public"]["Enums"]["user_authority"][] | null
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
          image_url?: string | null
          name?: string
          nickname?: string | null
          nif?: string
          phone?: string
          roles?: Database["public"]["Enums"]["user_authority"][] | null
          schedule?: Json | null
          specialties?: string[]
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      brands: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
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
          bank_name: string | null
          created_at: string | null
          due_date: string | null
          iban: string | null
          id: string
          last_plan_change: string | null
          name: string
          nickname: string | null
          nif: string | null
          payment_date: string | null
          phone: string | null
          plan_id: number | null
          status: string
        }
        Insert: {
          bank_name?: string | null
          created_at?: string | null
          due_date?: string | null
          iban?: string | null
          id?: string
          last_plan_change?: string | null
          name: string
          nickname?: string | null
          nif?: string | null
          payment_date?: string | null
          phone?: string | null
          plan_id?: number | null
          status?: string
        }
        Update: {
          bank_name?: string | null
          created_at?: string | null
          due_date?: string | null
          iban?: string | null
          id?: string
          last_plan_change?: string | null
          name?: string
          nickname?: string | null
          nif?: string | null
          payment_date?: string | null
          phone?: string | null
          plan_id?: number | null
          status?: string
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
        Relationships: [
          {
            foreignKeyName: "payments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
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
      products: {
        Row: {
          allowed_users: string[] | null
          available_stores: string[] | null
          brand_id: string | null
          category_id: string | null
          commission_rates: Json | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_service: boolean | null
          name: string
          price: number
          stock: number
          updated_at: string
          vat_included: boolean | null
          vat_rate: number | null
        }
        Insert: {
          allowed_users?: string[] | null
          available_stores?: string[] | null
          brand_id?: string | null
          category_id?: string | null
          commission_rates?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_service?: boolean | null
          name: string
          price: number
          stock?: number
          updated_at?: string
          vat_included?: boolean | null
          vat_rate?: number | null
        }
        Update: {
          allowed_users?: string[] | null
          available_stores?: string[] | null
          brand_id?: string | null
          category_id?: string | null
          commission_rates?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_service?: boolean | null
          name?: string
          price?: number
          stock?: number
          updated_at?: string
          vat_included?: boolean | null
          vat_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
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
      sale_items: {
        Row: {
          created_at: string
          id: string
          price: number
          product_id: string
          quantity: number
          sale_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          price: number
          product_id: string
          quantity: number
          sale_id: string
        }
        Update: {
          created_at?: string
          id?: string
          price?: number
          product_id?: string
          quantity?: number
          sale_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          created_at: string
          discount_percentage: number | null
          id: string
          is_plan_change: boolean | null
          payment_method: string
          sellers: Json | null
          status: string
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          discount_percentage?: number | null
          id?: string
          is_plan_change?: boolean | null
          payment_method: string
          sellers?: Json | null
          status?: string
          total: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          discount_percentage?: number | null
          id?: string
          is_plan_change?: boolean | null
          payment_method?: string
          sellers?: Json | null
          status?: string
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          created_at: string
          id: string
          permissions: Json
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          permissions?: Json
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          permissions?: Json
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
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
      decrement: {
        Args: {
          x: number
        }
        Returns: number
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      user_authority: "admin" | "seller" | "manager" | "barber" | "owner"
      user_role: "admin" | "owner" | "barber" | "cashier" | "manager"
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
