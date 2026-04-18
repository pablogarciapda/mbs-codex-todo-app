<script setup lang="ts">
import { onMounted } from 'vue'
import { useTodoStore } from '~/stores/todo'

const todoStore = useTodoStore()

onMounted(() => {
  todoStore.hydrateTasks()
})

const handleAddTask = (text: string) => {
  todoStore.addTask(text)
}
</script>

<template>
  <main class="min-h-screen bg-gradient-to-br from-amber-50 via-white to-teal-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-3xl rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur sm:p-8">
      <header class="mb-8 space-y-2">
        <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
          Lista de Tareas
        </h1>
        <p class="text-slate-600">
          Organiza tu dia con una lista clara, rapida y enfocada.
        </p>
      </header>

      <section class="space-y-6">
        <TodoInput @add="handleAddTask" />
        <TodoList />
      </section>
    </div>
  </main>
</template>
