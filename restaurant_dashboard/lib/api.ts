// API client configuration and base functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    throw new ApiError(response.status, `API Error: ${response.statusText}`)
  }

  return response.json()
}

// Types declaration
type Recipe = {
  id: string
  // other recipe properties
}

type Session = {
  id: string
  // other session properties
}

type Problem = {
  id: string
  // other problem properties
}

type Employee = {
  id: string
  // other employee properties
}

// Recipe API functions
export const recipeApi = {
  getAll: () => apiRequest<Recipe[]>("/recipes"),
  getById: (id: string) => apiRequest<Recipe>(`/recipes/${id}`),
  create: (recipe: Omit<Recipe, "id">) =>
    apiRequest<Recipe>("/recipes", {
      method: "POST",
      body: JSON.stringify(recipe),
    }),
  update: (id: string, recipe: Partial<Recipe>) =>
    apiRequest<Recipe>(`/recipes/${id}`, {
      method: "PUT",
      body: JSON.stringify(recipe),
    }),
  delete: (id: string) => apiRequest<void>(`/recipes/${id}`, { method: "DELETE" }),
}

// Session API functions
export const sessionApi = {
  getAll: () => apiRequest<Session[]>("/sessions"),
  getById: (id: string) => apiRequest<Session>(`/sessions/${id}`),
  create: (session: Omit<Session, "id">) =>
    apiRequest<Session>("/sessions", {
      method: "POST",
      body: JSON.stringify(session),
    }),
  update: (id: string, session: Partial<Session>) =>
    apiRequest<Session>(`/sessions/${id}`, {
      method: "PUT",
      body: JSON.stringify(session),
    }),
  requestValidation: (id: string) =>
    apiRequest<void>(`/sessions/${id}/request-validation`, {
      method: "POST",
    }),
}

// Problem API functions
export const problemApi = {
  create: (problem: Omit<Problem, "id">) =>
    apiRequest<Problem>("/problems", {
      method: "POST",
      body: JSON.stringify(problem),
    }),
  getAll: () => apiRequest<Problem[]>("/problems"),
  resolve: (id: string, resolution: string) =>
    apiRequest<Problem>(`/problems/${id}/resolve`, {
      method: "POST",
      body: JSON.stringify({ resolution }),
    }),
}

// Employee API functions
export const employeeApi = {
  getAll: () => apiRequest<Employee[]>("/employees"),
  getById: (id: string) => apiRequest<Employee>(`/employees/${id}`),
  getSessions: (id: string) => apiRequest<Session[]>(`/employees/${id}/sessions`),
}
