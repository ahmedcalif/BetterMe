// Season types
export type SeasonName = "winter" | "spring" | "summer" | "fall";

export interface Season {
  name: SeasonName;
  year: number;
  label: string;
}

// Goal types
export type GoalStatus = "active" | "completed" | "archived";

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  season: string;
  status: GoalStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
  steps?: Step[];
}

export interface Step {
  id: string;
  goalId: string;
  title: string;
  isCompleted: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}

export interface GoalWithSteps extends Goal {
  steps: Step[];
  progress: number;
}

// Input types for server actions
export interface CreateGoalInput {
  title: string;
  description?: string | null;
  season?: string;
}

export interface UpdateGoalInput {
  title?: string;
  description?: string | null;
  status?: GoalStatus;
}

export interface CreateStepInput {
  goalId: string;
  title: string;
  order?: number;
}

export interface UpdateStepInput {
  title?: string;
  isCompleted?: boolean;
  order?: number;
}

// API Response types
export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Auth user type
export interface AuthUser {
  id: string;
  kindeId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  picture: string | null;
}
