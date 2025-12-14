<template>
  <UDropdownMenu :items="localeItems">
    <UButton color="neutral" variant="ghost" icon="i-lucide-languages">
      {{ currentLocaleShort }}
    </UButton>
  </UDropdownMenu>
</template>

<script setup lang="ts">
const { locale, setLocale, locales } = useI18n()

const currentLocaleShort = computed(() => 
  locale.value === 'zh-CN' ? '中文' : 'EN'
)

const localeItems = computed(() => [
  (locales.value as Array<{ code: string; name: string }>).map(l => ({
    label: l.name,
    onSelect: () => setLocale(l.code)
  }))
])
</script>
