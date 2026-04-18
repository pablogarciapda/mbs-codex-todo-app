<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTodoStore, type TodoFilter } from '~/stores/todo'

const todoStore = useTodoStore()
const { filteredTasks, totalTasks, pendingTasks, completedTasks, filter } = storeToRefs(todoStore)

const filters: Array<{ label: string; value: TodoFilter }> = [
  { label: 'Todas', value: 'all' },
  { label: 'Pendientes', value: 'pending' },
  { label: 'Completadas', value: 'completed' }
]

const handleEditTask = (payload: { id: string; text: string }) => {
  todoStore.updateTaskText(payload.id, payload.text)
}
</script>

<template>
  <section class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in filters"
          :key="item.value"
          type="button"
          class="rounded-full px-4 py-2 text-sm font-medium transition"
          :class="
            filter === item.value
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          "
          @click="todoStore.setFilter(item.value)"
        >
          {{ item.label }}
        </button>
      </div>

      <div class="flex items-center gap-3">
        <div class="text-sm text-slate-600">
          Total: {{ totalTasks }} | Pendientes: {{ pendingTasks }} | Completadas: {{ completedTasks }}
        </div>
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="completedTasks === 0"
          @click="todoStore.clearCompleted"
        >
          Limpiar completadas
        </button>
      </div>
    </div>

    <ul v-if="filteredTasks.length" class="space-y-3">
      <li v-for="task in filteredTasks" :key="task.id">
        <TodoItem
          :task="task"
          @toggle="todoStore.toggleTask"
          @remove="todoStore.removeTask"
          @edit="handleEditTask"
        />
      </li>
    </ul>

    <div
      v-else
      class="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500"
    >
      No hay tareas para mostrar.
    </div>
  </section>
</template>
