// Type for the initial state for actions
export type InitialState = {
  error?: string;
  success?: boolean | string;
};

//_________________ WORKOUT TYPES ________________________

export type WorkoutExercise = {
  id: string;
  order_index: number;
  exercises: {
    id: string;
    name: string;
    slug?: string;
  };
  sets: {
    id: string;
    set_number: number;
    target_reps: number;
  }[];
};

export type UpcomingWorkout =
  | {
      id: string;
      workoutName: string;
      workoutSlug: string;
      planName: string;
      planSlug: string;
      progress: string;
      completed: boolean;
    }
  | null
  | { error: string };

export type Exercise = {
  id: string;
  name: string;
  slug: string;
  primary_muscles: string[];
  secondary_muscles: string[];
  type: "compound" | "isolation" | "plyometric";
  description: string;
};

export type WorkoutSet = {
  id: string;
  set_number: number;
  target_reps: number;
  lastReps?: number;
  lastWeight?: number;
};

export type LastPerformance = {
  notes: string | null;
  sets: CompletedSet[];
};

export type ExerciseWithPerformance = {
  workoutExerciseId: string;
  orderIndex: number;
  exercise: Exercise;
  sets: WorkoutSet[];
  lastPerformance: LastPerformance | null;
  lastPerformanceNotes?: string | null;
  currentSessionData?: {
    notes?: string;
    saved_at?: string;
    sets: Array<{ set_number: number; reps: number; weight: number }>;
  };
};

export type CurrentWorkout = {
  id: string;
  name: string;
  slug: string;
  planName: string;
  planSlug: string;
  exercises: ExerciseWithPerformance[];
  lastCompletedAt: string | null;
  completed: boolean;
};

// Create a specific type for the workout exercises in completed workouts
export type CompletedSet = {
  id: string;
  set_number: number;
  reps: number;
  weight: number;
};

export type CompletedExercise = {
  id: string;
  exercise_id: string;
  notes: string | null;
  saved_at: string;
  exercises: {
    id: string;
    name: string;
    slug: string;
  };
  completed_sets: CompletedSet[];
};

export type CompletedWorkout = {
  id: string;
  user_id: string;
  workout_id: string;
  completed_at: string;
  completed_date: string;
  workouts: {
    id: string;
    name: string;
    slug: string;
    workout_plans?: {
      id: string;
      name: string;
      slug: string;
    };
  };
  completed_exercises: CompletedExercise[];
};

export type UserGoal = {
  workout_goal_per_week: number;
};

export type Streak = {
  error?: string | undefined;
  streak?: number | undefined;
  goal?: UserGoal | undefined;
};

export type WorkoutTimeStat = {
  workout_start_time: string;
  completed_at: string;
};
