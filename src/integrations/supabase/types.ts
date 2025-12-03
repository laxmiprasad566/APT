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
      locations: {
        Row: {
          created_at: string | null
          id: string
          latitude: number | null
          location_type: Database["public"]["Enums"]["location_type"]
          longitude: number | null
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          latitude?: number | null
          location_type: Database["public"]["Enums"]["location_type"]
          longitude?: number | null
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          latitude?: number | null
          location_type?: Database["public"]["Enums"]["location_type"]
          longitude?: number | null
          name?: string
        }
        Relationships: []
      }
      routes: {
        Row: {
          base_cost: number | null
          created_at: string | null
          destination_id: string
          distance_km: number | null
          duration_minutes: number | null
          frequency_per_day: number | null
          id: string
          origin_id: string
          transport_mode: Database["public"]["Enums"]["transport_mode"]
        }
        Insert: {
          base_cost?: number | null
          created_at?: string | null
          destination_id: string
          distance_km?: number | null
          duration_minutes?: number | null
          frequency_per_day?: number | null
          id?: string
          origin_id: string
          transport_mode: Database["public"]["Enums"]["transport_mode"]
        }
        Update: {
          base_cost?: number | null
          created_at?: string | null
          destination_id?: string
          distance_km?: number | null
          duration_minutes?: number | null
          frequency_per_day?: number | null
          id?: string
          origin_id?: string
          transport_mode?: Database["public"]["Enums"]["transport_mode"]
        }
        Relationships: [
          {
            foreignKeyName: "routes_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routes_origin_id_fkey"
            columns: ["origin_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_plans: {
        Row: {
          created_at: string | null
          destination_id: string
          destination_name: string | null
          id: string
          occasion: Database["public"]["Enums"]["occasion_type"] | null
          origin_id: string
          origin_name: string | null
          route_details: Json | null
          total_cost: number | null
          total_duration: number | null
          travel_date: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          destination_id: string
          destination_name?: string | null
          id?: string
          occasion?: Database["public"]["Enums"]["occasion_type"] | null
          origin_id: string
          origin_name?: string | null
          route_details?: Json | null
          total_cost?: number | null
          total_duration?: number | null
          travel_date: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          destination_id?: string
          destination_name?: string | null
          id?: string
          occasion?: Database["public"]["Enums"]["occasion_type"] | null
          origin_id?: string
          origin_name?: string | null
          route_details?: Json | null
          total_cost?: number | null
          total_duration?: number | null
          travel_date?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_plans_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_plans_origin_id_fkey"
            columns: ["origin_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      service_alerts: {
        Row: {
          affected_locations: string[] | null
          affected_modes: Database["public"]["Enums"]["transport_mode"][]
          created_at: string
          description: string
          id: string
          severity: Database["public"]["Enums"]["alert_severity"]
          title: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          affected_locations?: string[] | null
          affected_modes?: Database["public"]["Enums"]["transport_mode"][]
          created_at?: string
          description: string
          id?: string
          severity: Database["public"]["Enums"]["alert_severity"]
          title: string
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          affected_locations?: string[] | null
          affected_modes?: Database["public"]["Enums"]["transport_mode"][]
          created_at?: string
          description?: string
          id?: string
          severity?: Database["public"]["Enums"]["alert_severity"]
          title?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_trip_plan_metrics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
    }
    Enums: {
      alert_severity: "low" | "medium" | "high"
      location_type: "mega_city" | "city" | "town" | "village"
      occasion_type:
        | "exam"
        | "business"
        | "leisure"
        | "emergency"
        | "wedding"
        | "medical"
      transport_mode:
        | "train"
        | "bus"
        | "metro"
        | "air"
        | "water"
        | "shared_taxi"
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
      location_type: ["mega_city", "city", "town", "village"],
      occasion_type: [
        "exam",
        "business",
        "leisure",
        "emergency",
        "wedding",
        "medical",
      ],
      transport_mode: ["train", "bus", "metro", "air", "water", "shared_taxi"],
    },
  },
} as const
