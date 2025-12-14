<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="btn-ghost p-2 rounded-lg"
      :title="t(`theme.${currentTheme}`)"
    >
      <span :class="themeIcon" class="text-xl" />
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
        class="absolute right-0 top-full mt-2 w-40 glass rounded-xl shadow-xl overflow-hidden z-50"
        v-click-outside="() => isOpen = false"
      >
        <button
          v-for="option in themeOptions"
          :key="option.value"
          @click="selectTheme(option.value)"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors',
            'hover:bg-white/50 dark:hover:bg-slate-700/50',
            currentTheme === option.value ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300'
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
  
  // Apply theme class immediately
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.add(prefersDark ? 'dark' : 'light')
  } else {
    root.classList.add(theme)
  }
}

// Click outside directive
const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el._clickOutside = (event: MouseEvent) => {
      if (!el.contains(event.target as Node)) {
        binding.value()
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el._clickOutside)
  },
}
</script>
