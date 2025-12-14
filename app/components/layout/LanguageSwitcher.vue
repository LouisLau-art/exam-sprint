<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="btn-ghost p-2 rounded-lg flex items-center gap-2"
      :title="currentLocaleName"
    >
      <span class="i-carbon-translate text-xl" />
      <span class="hidden sm:inline text-sm font-medium">{{ currentLocaleShort }}</span>
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
        class="absolute right-0 top-full mt-2 w-36 glass rounded-xl shadow-xl overflow-hidden z-50"
        v-click-outside="() => isOpen = false"
      >
        <button
          v-for="loc in availableLocales"
          :key="loc.code"
          @click="selectLocale(loc.code)"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors',
            'hover:bg-white/50 dark:hover:bg-slate-700/50',
            locale === loc.code ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300'
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
  locale.value === 'zh-CN' ? '中' : 'EN'
)

const selectLocale = (code: string) => {
  setLocale(code)
  isOpen.value = false
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
