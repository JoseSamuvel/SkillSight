import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      districts: {
        Row: {
          id: string
          name: string
          state: string
          state_code: string
          district_code: string
          lat: number
          lng: number
          population: number
          workforce: number
          created_at: string
        }
      }
      occupations: {
        Row: {
          id: string
          nco_code: string
          title: string
          sector: string
          sub_sector: string
          nsqf_level: number
          description: string
          created_at: string
        }
      }
      skill_gaps: {
        Row: {
          id: string
          district_id: string
          occupation_id: string
          demand: number
          effective_supply: number
          gap: number
          gap_index: number
          confidence: number
          forecast_demand: number
          forecast_supply: number
          forecast_gap: number
          risk_level: string
          data_quality: number
          created_at: string
          updated_at: string
        }
      }
      training_centres: {
        Row: {
          id: string
          name: string
          district_id: string
          capacity: number
          current_enrollment: number
          sectors: string[]
          lat: number
          lng: number
          utilization_rate: number
          placement_rate: number
          created_at: string
        }
      }
      forecasts: {
        Row: {
          id: string
          district_id: string
          occupation_id: string
          period: string
          demand_forecast: number
          supply_forecast: number
          gap_forecast: number
          confidence_lower: number
          confidence_upper: number
          confidence_level: number
          model_version: string
          created_at: string
        }
      }
      policy_recommendations: {
        Row: {
          id: string
          district_id: string
          occupation_id: string
          recommendation_type: string
          priority: string
          title: string
          description: string
          evidence: string[]
          confidence: number
          impact_score: number
          cost_estimate: number
          status: string
          created_at: string
        }
      }
    }
  }
}
