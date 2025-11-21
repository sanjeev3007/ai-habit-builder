import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface DailyTask {
  id: string
  day: number
  title: string
  description: string
  completed: boolean
  completedAt?: Date
  notes?: string
}

export interface WeeklyCheckpoint {
  week: number
  title: string
  description: string
  milestones: string[]
}

export interface HabitPlan {
  id: string
  goal: string
  reason: string
  difficulty: 'easy' | 'medium' | 'hard'
  duration: 7 | 14 | 30
  preferredTime: string
  dailyTasks: DailyTask[]
  weeklyCheckpoints: WeeklyCheckpoint[]
  motivationalMessages: { day: number; message: string }[]
  createdAt: Date
  currentDay: number
}

export interface Progress {
  currentStreak: number
  longestStreak: number
  totalCompleted: number
  consistencyPercentage: number
  habitStrengthScore: number
  completionHistory: { day: number; date: Date; completed: boolean }[]
}

interface HabitStore {
  habitPlan: HabitPlan | null
  progress: Progress
  currentDay: number
  isGenerating: boolean

  // Actions
  setHabitPlan: (plan: HabitPlan) => void
  updateDailyTask: (day: number, updates: Partial<DailyTask>) => void
  completeTask: (day: number) => void
  updateProgress: () => void
  setCurrentDay: (day: number) => void
  setIsGenerating: (isGenerating: boolean) => void
  reset: () => void
}

const initialProgress: Progress = {
  currentStreak: 0,
  longestStreak: 0,
  totalCompleted: 0,
  consistencyPercentage: 0,
  habitStrengthScore: 0,
  completionHistory: [],
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habitPlan: null,
      progress: initialProgress,
      currentDay: 1,
      isGenerating: false,

      setHabitPlan: (plan) => set({ habitPlan: plan, currentDay: 1 }),

      updateDailyTask: (day, updates) =>
        set((state) => {
          if (!state.habitPlan) return state
          const tasks = state.habitPlan.dailyTasks.map((task) =>
            task.day === day ? { ...task, ...updates } : task
          )
          return {
            habitPlan: { ...state.habitPlan, dailyTasks: tasks },
          }
        }),

      completeTask: (day) => {
        set((state) => {
          if (!state.habitPlan) return state

          const tasks = state.habitPlan.dailyTasks.map((task) =>
            task.day === day
              ? { ...task, completed: true, completedAt: new Date() }
              : task
          )

          return {
            habitPlan: { ...state.habitPlan, dailyTasks: tasks },
          }
        })

        get().updateProgress()
      },

      updateProgress: () =>
        set((state) => {
          if (!state.habitPlan) return state

          const completedTasks = state.habitPlan.dailyTasks.filter((t) => t.completed)
          const totalTasks = state.habitPlan.dailyTasks.length

          // Calculate current streak
          let currentStreak = 0
          const sortedTasks = [...state.habitPlan.dailyTasks].sort((a, b) => b.day - a.day)
          for (const task of sortedTasks) {
            if (task.completed) {
              currentStreak++
            } else {
              break
            }
          }

          // Calculate longest streak
          let longestStreak = 0
          let tempStreak = 0
          for (const task of state.habitPlan.dailyTasks) {
            if (task.completed) {
              tempStreak++
              longestStreak = Math.max(longestStreak, tempStreak)
            } else {
              tempStreak = 0
            }
          }

          const consistencyPercentage = Math.round(
            (completedTasks.length / totalTasks) * 100
          )

          // Calculate habit strength score (0-100)
          const streakScore = Math.min((currentStreak / totalTasks) * 50, 50)
          const completionScore = consistencyPercentage * 0.5
          const habitStrengthScore = Math.round(streakScore + completionScore)

          const completionHistory = state.habitPlan.dailyTasks.map((task) => ({
            day: task.day,
            date: task.completedAt || new Date(),
            completed: task.completed,
          }))

          return {
            progress: {
              currentStreak,
              longestStreak,
              totalCompleted: completedTasks.length,
              consistencyPercentage,
              habitStrengthScore,
              completionHistory,
            },
          }
        }),

      setCurrentDay: (day) => set({ currentDay: day }),

      setIsGenerating: (isGenerating) => set({ isGenerating }),

      reset: () =>
        set({
          habitPlan: null,
          progress: initialProgress,
          currentDay: 1,
          isGenerating: false,
        }),
    }),
    {
      name: 'habit-storage',
    }
  )
)
