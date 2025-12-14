<template>
  <div class="relative">
    <button
      @click.stop="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 rounded-xl glass-subtle hover:bg-white/60 dark:hover:bg-slate-700/60 transition-all"
      :title="currentLocaleName"
    >
      <span class="i-carbon-translate text-lg text-slate-700 dark:text-slate-200" />
      <span class="text-sm font-medium text-slate-700 dark:text-slate-200">{{ currentLocaleShort }}</span>
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
        class="absolute right-0 top-full mt-2 w-36 glass-strong rounded-xl shadow-xl overflow-hidden z-50"
      >
        <button
          v-for="loc in availableLocales"
          :key="loc.code"
          @click="selectLocale(loc.code)"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors',
            'hover:bg-white/50 dark:hover:bg-slate-700/50',
            locale === loc.code ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-slate-700 dark:text-slate-200'
          ]"
        >
          <span>{{ loc.name }}</span>
          <span v-if="locale === loc.code" class="i-carbon-checkmark ml-auto" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale, locales } = useI18n()
const isOpen = ref(false)

const availableLocales = computed(() => 
  (locales.value as Array<{ code: string; name: string }>).map(l => ({
    code: l.code,
    name: l.name,
  }))
)

const currentLocaleName = computed(() => 
  availableLocales.value.find(l => l.code === locale.value)?.name || ''
)

const currentLocaleShort = computed(() => 
  locale.value === 'zh-CN' ? '中文' : 'EN'
)

const selectLocale = (code: string) => {
  setLocale(code)
  isOpen.value = false
}

// Close on click outside
onMounted(() => {
  const closeHandler = () => {
    if (isOpen.value) {
      isOpen.value = false
    }
  }
  
  setTimeout(() => {
    document.addEventListener('click', closeHandler)
  }, 100)
  
  onUnmounted(() => {
    document.removeEventListener('click', closeHandler)
  })
})
</script>
