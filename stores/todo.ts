import { defineStore } from 'pinia'

export type TodoFilter = 'all' | 'pending' | 'completed'

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

interface TodoState {
  tasks: Todo[]
  filter: TodoFilter
}

const STORAGE_KEY = 'mbs-todo-tasks'

export const useTodoStore = defineStore('todo', {
  state: (): TodoState => ({
    tasks: [],
    filter: 'all'
  }),

  getters: {
    filteredTasks: (state): Todo[] => {
      if (state.filter === 'pending') {
        return state.tasks.filter((task) => !task.completed)
      }

      if (state.filter === 'completed') {
        return state.tasks.filter((task) => task.completed)
      }

      return state.tasks
    },

    totalTasks: (state): number => state.tasks.length,
    pendingTasks: (state): number => state.tasks.filter((task) => !task.completed).length,
    completedTasks: (state): number => state.tasks.filter((task) => task.completed).length
  },

  actions: {
    addTask(text: string) {
      const trimmedText = text.trim()

      if (!trimmedText) {
        return
      }

      this.tasks.unshift({
        id: crypto.randomUUID(),
        text: trimmedText,
        completed: false,
        createdAt: Date.now()
      })

      this.persistTasks()
    },

    updateTaskText(id: string, text: string): boolean {
      const trimmedText = text.trim()

      if (!trimmedText) {
        return false
      }

      const task = this.tasks.find((item) => item.id === id)

      if (!task) {
        return false
      }

      task.text = trimmedText
      this.persistTasks()

      return true
    },

    removeTask(id: string) {
      this.tasks = this.tasks.filter((task) => task.id !== id)
      this.persistTasks()
    },

    toggleTask(id: string) {
      const task = this.tasks.find((item) => item.id === id)

      if (!task) {
        return
      }

      task.completed = !task.completed
      this.persistTasks()
    },

    setFilter(filter: TodoFilter) {
      this.filter = filter
    },

    clearCompleted() {
      this.tasks = this.tasks.filter((task) => !task.completed)
      this.persistTasks()
    },

    hydrateTasks() {
      if (typeof window === 'undefined') {
        return
      }

      const saved = localStorage.getItem(STORAGE_KEY)

      if (!saved) {
        return
      }

      try {
        const parsed = JSON.parse(saved) as Todo[]
        this.tasks = Array.isArray(parsed) ? parsed : []
      } catch {
        this.tasks = []
      }
    },

    persistTasks() {
      if (typeof window === 'undefined') {
        return
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks))
    }
  }
})
