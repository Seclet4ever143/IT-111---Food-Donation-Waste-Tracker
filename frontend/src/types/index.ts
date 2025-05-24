export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: "admin" | "donor" | "charity"
  phone_number?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  organization_name?: string
  organization_description?: string
  is_verified: boolean
  date_joined: string
}

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface FoodCategory {
  id: number
  name: string
  description?: string
}

export interface WasteCategory {
  id: number
  name: string
  description?: string
}

export interface Donation {
  id: number
  donor: number
  donor_details?: {
    id: number
    email: string
    first_name: string
    last_name: string
    phone_number?: string
    city?: string
    state?: string
  }
  charity?: number
  charity_details?: {
    id: number
    email: string
    organization_name?: string
    phone_number?: string
    city?: string
    state?: string
  }
  food_name: string
  description: string
  quantity: string
  category: number
  category_name?: string
  expiry_date: string
  pickup_address: string
  pickup_city: string
  pickup_state: string
  pickup_zip: string
  pickup_instructions?: string
  status: "available" | "claimed" | "received" | "expired"
  created_at: string
  updated_at: string
  claimed_at?: string
  received_at?: string
  latitude?: number
  longitude?: number
}

export interface DonationClaim {
  id: number
  donation: number
  donation_details?: Donation
  charity: number
  charity_details?: {
    id: number
    email: string
    organization_name?: string
    phone_number?: string
    city?: string
    state?: string
  }
  claimed_at: string
  pickup_time?: string
  notes?: string
  is_received: boolean
  received_at?: string
}

export interface WasteLog {
  id: number
  user: number
  food_name: string
  description?: string
  quantity: string
  waste_type: "spoiled" | "expired" | "leftovers" | "other"
  waste_category?: number
  waste_category_name?: string
  food_category?: number
  food_category_name?: string
  date: string
  created_at: string
  updated_at: string
  notes?: string
}

export interface WasteReduction {
  id: number
  user: number
  title: string
  description: string
  amount_saved?: string
  date: string
  created_at: string
}