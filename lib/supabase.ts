import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          goal: string
          level: string
          restrictions: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      workouts: {
        Row: {
          id: string
          user_id: string
          plan: string
          week: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['workouts']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['workouts']['Insert']>
      }
      diet_plans: {
        Row: {
          id: string
          user_id: string
          plan: string
          calories: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['diet_plans']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['diet_plans']['Insert']>
      }
      progress: {
        Row: {
          id: string
          user_id: string
          weight: number
          note: string
          date: string
        }
        Insert: Omit<Database['public']['Tables']['progress']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['progress']['Insert']>
      }
    }
  }
}
