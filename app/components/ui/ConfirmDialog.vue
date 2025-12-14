<template>
  <UModal v-model:open="isOpen">
    <template #title>{{ title }}</template>
    <template #description>{{ message }}</template>
    <template #footer>
      <UButton variant="outline" @click="onCancel">{{ cancelText }}</UButton>
      <UButton :color="type === 'danger' ? 'error' : 'primary'" @click="onConfirm">{{ confirmText }}</UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  message?: string
  type?: 'warning' | 'danger' | 'info'
  confirmText?: string
  cancelText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '确认',
  message: '确定要执行此操作吗？',
  type: 'warning',
  confirmText: '确认',
  cancelText: '取消',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': []
  'cancel': []
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const onConfirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}

const onCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>
