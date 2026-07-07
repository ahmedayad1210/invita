// src/lib/supabase/types.ts

export type BookingStatus = "pending" | "confirmed" | "cancelled";
export type ServiceCategory = "iv-therapy" | "dna";

// ─────────────────────────────────────────────
// TABLE ROW TYPES
// ─────────────────────────────────────────────

export interface Profile {
  id:         string;
  full_name:  string;
  email:      string;
  phone:      string | null;
  created_at: string;
  updated_at: string;
  referral_code?:    string | null;
  referred_by?:      string | null;
  referral_credits?: number | null;
}

export interface Service {
  id:          string;
  name:        string;
  category:    ServiceCategory;
  duration:    number;
  price:       number;
  description: string | null;
  active:      boolean;
  created_at:  string;
  updated_at:  string;
}

export interface Stylist {
  id:          string;
  name:        string;
  bio:         string | null;
  photo_url:   string | null;
  specialties: string[];
  active:      boolean;
  created_at:  string;
  updated_at:  string;
}

export interface Booking {
  id:         string;
  user_id:    string;
  service_id: string;
  stylist_id: string;
  date:       string;
  time_slot:  string;
  status:     BookingStatus;
  notes:      string | null;
  created_at: string;
  updated_at: string;
  guest_name?: string | null;
  intake_goals?:       string | null;
  intake_allergies?:   string | null;
  intake_medications?: string | null;
  intake_conditions?:  string | null;
  intake_pregnant?:    boolean | null;
}

export interface Lead {
  id:         string;
  source:     string;
  name:       string | null;
  email:      string | null;
  phone:      string | null;
  message:    string | null;
  drip_slug:  string | null;
  locale:     string | null;
  created_at: string;
}

// ─────────────────────────────────────────────
// DATABASE TYPE
// Written to match the exact internal shape
// that @supabase/supabase-js expects
// ─────────────────────────────────────────────

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row:    Profile;
        Insert: {
          id:         string;
          full_name:  string;
          email:      string;
          phone?:     string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?:        string;
          full_name?: string;
          email?:     string;
          phone?:     string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row:    Service;
        Insert: {
          id?:          string;
          name:         string;
          category:     ServiceCategory;
          duration:     number;
          price:        number;
          description?: string | null;
          active?:      boolean;
          created_at?:  string;
          updated_at?:  string;
        };
        Update: {
          id?:          string;
          name?:        string;
          category?:    ServiceCategory;
          duration?:    number;
          price?:       number;
          description?: string | null;
          active?:      boolean;
          updated_at?:  string;
        };
        Relationships: [];
      };
      stylists: {
        Row:    Stylist;
        Insert: {
          id?:          string;
          name:         string;
          bio?:         string | null;
          photo_url?:   string | null;
          specialties?: string[];
          active?:      boolean;
          created_at?:  string;
          updated_at?:  string;
        };
        Update: {
          id?:          string;
          name?:        string;
          bio?:         string | null;
          photo_url?:   string | null;
          specialties?: string[];
          active?:      boolean;
          updated_at?:  string;
        };
        Relationships: [];
      };
      bookings: {
        Row:    Booking;
        Insert: {
          id?:        string;
          user_id:    string;
          service_id: string;
          stylist_id: string;
          date:       string;
          time_slot:  string;
          status?:    BookingStatus;
          notes?:     string | null;
          guest_name?: string | null;
          intake_goals?:       string | null;
          intake_allergies?:   string | null;
          intake_medications?: string | null;
          intake_conditions?:  string | null;
          intake_pregnant?:    boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?:        string;
          user_id?:   string;
          service_id?: string;
          stylist_id?: string;
          date?:      string;
          time_slot?: string;
          status?:    BookingStatus;
          notes?:     string | null;
          guest_name?: string | null;
          intake_goals?:       string | null;
          intake_allergies?:   string | null;
          intake_medications?: string | null;
          intake_conditions?:  string | null;
          intake_pregnant?:    boolean | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      leads: {
        Row:    Lead;
        Insert: {
          id?:         string;
          source:      string;
          name?:       string | null;
          email?:      string | null;
          phone?:      string | null;
          message?:    string | null;
          drip_slug?:  string | null;
          locale?:     string | null;
          created_at?: string;
        };
        Update: {
          source?:    string;
          name?:      string | null;
          email?:     string | null;
          phone?:     string | null;
          message?:   string | null;
          drip_slug?: string | null;
          locale?:    string | null;
        };
        Relationships: [];
      };
    };
    Views:     Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      booking_status:   BookingStatus;
      service_category: ServiceCategory;
    };
    CompositeTypes: Record<string, never>;
  };
};

// ─────────────────────────────────────────────
// JOINED TYPES
// ─────────────────────────────────────────────

export interface BookingWithDetails extends Booking {
  service: Pick<Service, "id" | "name" | "category" | "duration" | "price">;
  stylist: Pick<Stylist, "id" | "name" | "specialties">;
  profile?: Pick<Profile, "full_name" | "email" | "phone">;
  guest_name?: string | null;
}

// ─────────────────────────────────────────────
// FORM TYPES
// ─────────────────────────────────────────────

export interface RegisterFormData {
  full_name:       string;
  email:           string;
  password:        string;
  confirmPassword: string;
  phone?:          string;
}

export interface LoginFormData {
  email:    string;
  password: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ClinicalIntake {
  goals: string;
  allergies: string;
  medications: string;
  conditions: string;
  pregnant: boolean;
}

export interface BookingFormData {
  service_id: string;
  stylist_id: string;
  date:       string;
  time_slot:  string;
  notes?:     string;
  service_duration?: number;
  intake?:    ClinicalIntake;
  sms_reminder?: boolean;
}

export type DnaOrderStatus = "ordered" | "collected" | "processing" | "ready" | "delivered";

export interface DnaOrder {
  id:         string;
  user_id:    string;
  panel_slug: string;
  panel_name: string;
  status:     DnaOrderStatus;
  result_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceFormData {
  name:        string;
  category:    ServiceCategory;
  duration:    number;
  price:       number;
  description: string;
  active:      boolean;
}

export interface StylistFormData {
  name:        string;
  bio:         string;
  specialties: string;
  active:      boolean;
}

export interface ContactFormData {
  name:    string;
  email:   string;
  phone?:  string;
  message: string;
}

// ─────────────────────────────────────────────
// API RESPONSE TYPES
// ─────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true;
  data:    T;
  message?: string;
}

export interface ApiError {
  success: false;
  error:   string;
  code?:   string;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// ─────────────────────────────────────────────
// AVAILABILITY TYPES
// ─────────────────────────────────────────────

export interface AvailabilityRequest {
  stylist_id:       string;
  date:             string;
  service_duration: number;
}

export interface AvailabilityResponse {
  date:            string;
  stylist_id:      string;
  booked_slots:    string[];
  available_slots: string[];
}

// ─────────────────────────────────────────────
// ADMIN TYPES
// ─────────────────────────────────────────────

// AdminSession is now managed server-side via signed JWT cookies.
// This type is retained for any legacy references but is no longer
// stored in localStorage or used for client-side auth checks.
export interface AdminSession {
  username: string;
}

export interface DashboardStats {
  bookings_today:      number;
  bookings_this_week:  number;
  bookings_this_month: number;
  revenue_this_month:  number;
}

// ─────────────────────────────────────────────
// EMAILJS PAYLOAD
// ─────────────────────────────────────────────

export interface EmailConfirmationPayload {
  to_name:       string;
  to_email:      string;
  service_name:  string;
  stylist_name:  string;
  booking_date:  string;
  booking_time:  string;
  booking_id:    string;
  salon_address: string;
  salon_phone:   string;
}