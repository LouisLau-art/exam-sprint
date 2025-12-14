<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-50 flex-center p-4">
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          @click="closeOnBackdrop && close()"
        />
        
        <!-- Modal Content -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div 
            v-if="modelValue"
            :class="[
              'relative glass-strong rounded-2xl shadow-2xl max-h-[90vh] overflow-auto',
              sizeClasses
            ]"
          >
            <!-- Header -->
            <div v-if="title || $slots.header" class="flex-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
              <h2 class="text-xl font-semibold text-slate-800 dark:text-slate-100">
                {{ title }}
              </h2>
              <button
                v-if="showClose"
                @click="close"
                class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
              >
                <span class="i-carbon-close text-xl" />
              </button>
            </div>
            
            <!-- Body -->
            <div class="p-6">
              <slot />
            </div>
            
            <!-- Footer -->
            <div v-if="$slots.footer" class="p-6 pt-0 flex justify-end gap-3">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showClose?: boolean
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showClose: true,
  closeOnBackdrop: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const close = () => {
  emit('update:modelValue', false)
}

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-full max-w-sm'
    case 'lg':
      return 'w-full max-w-2xl'
    case 'xl':
      return 'w-full max-w-4xl'
    default:
      return 'w-full max-w-lg'
  }
})

// Close on escape
onMounted(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.modelValue) {
      close()
    }
  }
  window.addEventListener('keydown', handler)
  onUnmounted(() => window.removeEventListener('keydown', handler))
})
</script>
