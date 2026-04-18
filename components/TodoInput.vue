<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  add: [text: string]
}>()

const newTask = ref('')
const errorMessage = ref('')

const submitTask = () => {
  const trimmed = newTask.value.trim()

  if (!trimmed) {
    errorMessage.value = 'La tarea no puede estar vacia.'
    return
  }

  emit('add', trimmed)
  newTask.value = ''
  errorMessage.value = ''
}
</script>

<template>
  <form class="space-y-2" @submit.prevent="submitTask">
    <div class="flex flex-col gap-3 sm:flex-row">
      <input
        v-model="newTask"
        type="text"
        placeholder="Escribe una nueva tarea"
        class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
      >
      <button
        type="submit"
        class="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
      >
        Agregar
      </button>
    </div>

    <p v-if="errorMessage" class="text-sm text-red-600">
      {{ errorMessage }}
    </p>
  </form>
</template>
