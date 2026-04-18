<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Todo } from '~/stores/todo'

const props = defineProps<{
  task: Todo
}>()

const emit = defineEmits<{
  toggle: [id: string]
  remove: [id: string]
  edit: [payload: { id: string; text: string }]
}>()

const isEditing = ref(false)
const draftText = ref(props.task.text)
const errorMessage = ref('')

watch(
  () => props.task.text,
  (value) => {
    if (!isEditing.value) {
      draftText.value = value
    }
  }
)

const startEditing = () => {
  isEditing.value = true
  draftText.value = props.task.text
  errorMessage.value = ''
}

const cancelEditing = () => {
  isEditing.value = false
  draftText.value = props.task.text
  errorMessage.value = ''
}

const saveEditing = () => {
  const trimmed = draftText.value.trim()

  if (!trimmed) {
    errorMessage.value = 'La tarea no puede estar vacia.'
    return
  }

  emit('edit', { id: props.task.id, text: trimmed })
  isEditing.value = false
  errorMessage.value = ''
}
</script>

<template>
  <div class="space-y-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <div class="flex items-center justify-between gap-3">
      <label class="flex min-w-0 items-center gap-3">
      <input
        :checked="task.completed"
        type="checkbox"
        class="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
        @change="emit('toggle', task.id)"
      >
        <span
          v-if="!isEditing"
          class="truncate text-slate-800"
          :class="{ 'text-slate-400 line-through': task.completed }"
        >
          {{ task.text }}
        </span>
        <input
          v-else
          v-model="draftText"
          type="text"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          @keyup.enter="saveEditing"
          @keyup.esc="cancelEditing"
        >
      </label>

      <div class="flex items-center gap-2">
        <template v-if="isEditing">
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            @click="cancelEditing"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            @click="saveEditing"
          >
            Guardar
          </button>
        </template>

        <template v-else>
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            @click="startEditing"
          >
            Editar
          </button>
          <button
            type="button"
            class="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            @click="emit('remove', task.id)"
          >
            Eliminar
          </button>
        </template>
      </div>
    </div>

    <p v-if="errorMessage" class="text-sm text-red-600">
      {{ errorMessage }}
    </p>
  </div>
</template>
