<template>
  <div class="space-y-1">
    <label v-if="label" :for="id" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
      {{ label }}
    </label>
    <div class="relative">
      <span v-if="icon" :class="[icon, 'absolute left-3 top-1/2 -translate-y-1/2 text-slate-400']" />
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'input',
          icon && 'pl-10',
          error && 'ring-2 ring-red-500/50'
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur', $event)"
      />
    </div>
    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
    <p v-else-if="hint" class="text-sm text-slate-500 dark:text-slate-400">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number
  label?: string
  type?: string
  placeholder?: string
  icon?: string
  disabled?: boolean
  error?: string
  hint?: string
  id?: string
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
})

defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
}>()
</script>
