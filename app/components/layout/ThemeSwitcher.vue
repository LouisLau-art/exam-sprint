<template>
  <div class="relative">
    <button
      @click.stop="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 rounded-xl glass-subtle hover:bg-white/60 dark:hover:bg-slate-700/60 transition-all"
      :title="t(`theme.${currentTheme}`)"
    >
      <span :class="themeIcon" class="text-lg text-slate-700 dark:text-slate-200" />
      <span class="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:inline">
        {{ t(`theme.${currentTheme}`) }}
      </span>
    </button>
    
    <!-- Dropdown -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 top-full mt-2 w-40 glass-strong rounded-xl shadow-xl overflow-hidden z-50"
      >
        <button
          v-for="option in themeOptions"
          :key="option.value"
          @click="selectTheme(option.value)"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors',
            'hover:bg-white/50 dark:hover:bg-slate-700/50',
            currentTheme === option.value ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-slate-700 dark:text-slate-200'
          ]"
        >
          <span :class="option.icon" class="text-lg" />
          <span>{{ t(`theme.${option.value}`) }}</span>
          <span v-if="currentTheme === option.value" class="i-carbon-checkmark ml-auto" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const colorMode = useColorMode()
const isOpen = ref(false)

const themeOptions = [
  { value: 'light', icon: 'i-carbon-sun' },
  { value: 'dark', icon: 'i-carbon-moon' },
  { value: 'system', icon: 'i-carbon-laptop' },
] as const

const currentTheme = computed(() => colorMode.preference)

const themeIcon = computed(() => {
  switch (colorMode.preference) {
    case 'light': return 'i-carbon-sun'
    case 'dark': return 'i-carbon-moon'
    default: return 'i-carbon-laptop'
  }
})

const selectTheme = (theme: 'light' | 'dark' | 'system') => {
  colorMode.preference = theme
  isOpen.value = false
  applyTheme(theme)
}

const applyTheme = (theme: string) => {
  if (!import.meta.client) return
  
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.add(prefersDark ? 'dark' : 'light')
  } else {
    root.classList.add(theme)
  }
}

// Close on click outside
onMounted(() => {
  const closeHandler = (e: MouseEvent) => {
    if (isOpen.value) {
      isOpen.value = false
    }
  }
  
  // Delay to avoid immediate close
  setTimeout(() => {
    document.addEventListener('click', closeHandler)
  }, 100)
  
  onUnmounted(() => {
    document.removeEventListener('click', closeHandler)
  })
})
</script>
