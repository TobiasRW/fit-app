"use server";

import { checkAuthentication } from "@/utils/helpers/helpers";
import { UpcomingWorkout } from "../types";

export async function getNextWorkout(): Promise<UpcomingWorkout> {
  const { supabase, user } = await checkAuthentication();

  const { data, error } = await supabase.rpc("get_next_workout", {
    user_uuid: user.id,
  });

  if (error || !data || data.length === 0) {
    return null;
  }

  const workout = data[0];

  return {
    id: workout.workout_id,
    workoutName: workout.workout_name,
    workoutSlug: workout.workout_slug,
    planName: workout.plan_name,
    planSlug: workout.plan_slug,
    progress: `${workout.current_position} of ${workout.total_workouts}`,
  };
}
