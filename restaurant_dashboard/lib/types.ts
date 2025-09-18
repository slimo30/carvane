// Type definitions for the Chef Mode application

export interface Recipe {
  id: string
  name: string
  description?: string
  image?: string
  estimatedTime: number // in minutes
  allergens: string[]
  ingredients: Ingredient[]
  steps: RecipeStep[]
  createdAt: Date
  updatedAt: Date
}

export interface Ingredient {
  id: string
  name: string
  quantity: string
  unit?: string
}

export interface RecipeStep {
  id: string
  index: number
  instruction: string
  timeSec?: number // optional timer in seconds
  image?: string
  completed?: boolean
}

export interface Session {
  id: string
  employeeId: string
  recipeId: string
  status: "in_progress" | "completed" | "pending_validation" | "validated" | "rejected"
  startedAt: Date
  completedAt?: Date
  actualDuration?: number // in minutes
  steps: SessionStep[]
  problems: Problem[]
  validationNote?: string
}

export interface SessionStep {
  stepId: string
  startedAt: Date
  completedAt?: Date
  actualDuration?: number // in seconds
  interrupted?: boolean
}

export interface Problem {
  id: string
  sessionId: string
  stepId?: string
  type: "ingredient_missing" | "equipment_issue" | "temperature_problem" | "other"
  description: string
  reportedAt: Date
  resolved?: boolean
  resolution?: string
  assignedTo?: string
}

export interface Employee {
  id: string
  name: string
  email: string
  role: "worker" | "admin"
  onboardingProgress: number // percentage
  createdAt: Date
  lastActivity?: Date
}

export interface ValidationRequest {
  id: string
  sessionId: string
  employeeId: string
  requestedAt: Date
  status: "pending" | "approved" | "rejected"
  reviewedBy?: string
  reviewedAt?: Date
  note?: string
}

// Voice control types
export interface VoiceCommand {
  command: string
  action: "next" | "previous" | "repeat" | "start_timer" | "stop_timer" | "help"
}

// Timer types
export interface Timer {
  id: string
  duration: number // in seconds
  remaining: number
  isActive: boolean
  stepId?: string
}
