
export type WorkoutType = 'Running' | 'Cycling' | 'Swimming' | 'Strength' | 'Yoga' | 'Other';

export interface Workout {
  id: string;
  type: WorkoutType;
  duration: number; // in minutes
  calories: number;
  date: string;
  intensity: 'Low' | 'Medium' | 'High';
  notes: string;
}

export interface UserStats {
  totalWorkouts: number;
  totalDuration: number;
  totalCalories: number;
  streak: number;
}
