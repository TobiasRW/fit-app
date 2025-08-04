// Type for the initial state for actions
export type InitialState = {
  error?: string;
  success?: boolean | string;
};

// Type for a workout exercise
export type WorkoutExercise = {
  id: string;
  order_index: number;
  exercises: {
    id: string;
    name: string;
  };
  sets: {
    id: string;
    set_number: number;
    target_reps: number;
  }[];
};
