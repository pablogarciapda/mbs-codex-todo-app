import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTodoStore } from '../stores/todo'

describe('useTodoStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('adds a task with trimmed text and ignores empty values', () => {
    const store = useTodoStore()
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('task-1')

    store.addTask('   estudiar Nuxt   ')
    store.addTask('   ')

    expect(store.tasks).toHaveLength(1)
    expect(store.tasks[0]).toMatchObject({
      id: 'task-1',
      text: 'estudiar Nuxt',
      completed: false
    })
  })

  it('toggles and removes a task', () => {
    const store = useTodoStore()
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('task-2')

    store.addTask('hacer tests')
    store.toggleTask('task-2')

    expect(store.tasks[0].completed).toBe(true)

    store.removeTask('task-2')
    expect(store.tasks).toHaveLength(0)
  })

  it('updates task text inline with validation', () => {
    const store = useTodoStore()
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('task-3')

    store.addTask('texto inicial')

    const emptyResult = store.updateTaskText('task-3', '   ')
    expect(emptyResult).toBe(false)
    expect(store.tasks[0].text).toBe('texto inicial')

    const updateResult = store.updateTaskText('task-3', '  texto editado  ')
    expect(updateResult).toBe(true)
    expect(store.tasks[0].text).toBe('texto editado')
  })

  it('filters tasks and clears completed', () => {
    const store = useTodoStore()

    vi.spyOn(crypto, 'randomUUID')
      .mockReturnValueOnce('task-4')
      .mockReturnValueOnce('task-5')
      .mockReturnValueOnce('task-6')

    store.addTask('pendiente 1')
    store.addTask('pendiente 2')
    store.addTask('completada 1')

    store.toggleTask('task-6')

    expect(store.totalTasks).toBe(3)
    expect(store.pendingTasks).toBe(2)
    expect(store.completedTasks).toBe(1)

    store.setFilter('completed')
    expect(store.filteredTasks.map((task) => task.id)).toEqual(['task-6'])

    store.clearCompleted()
    expect(store.tasks.map((task) => task.id)).toEqual(['task-5', 'task-4'])
    expect(store.completedTasks).toBe(0)
  })
})
