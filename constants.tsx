
import React from 'react';
import { WorkoutType } from './types';

export const WORKOUT_TYPES: { value: WorkoutType; label: string; icon: string }[] = [
  { value: 'Running', label: '跑步', icon: '🏃‍♂️' },
  { value: 'Cycling', label: '骑行', icon: '🚴‍♀️' },
  { value: 'Swimming', label: '游泳', icon: '🏊‍♂️' },
  { value: 'Strength', label: '力量训练', icon: '💪' },
  { value: 'Yoga', label: '瑜伽', icon: '🧘‍♀️' },
  { value: 'Other', label: '其他', icon: '🔥' },
];

export const STORAGE_KEY = 'fitpulse_workouts_v1';
