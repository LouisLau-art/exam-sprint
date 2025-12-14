<template>
  <UDropdownMenu :items="themeItems">
    <UButton color="neutral" variant="ghost" icon="i-lucide-monitor">
      {{ currentThemeLabel }}
    </UButton>
  </UDropdownMenu>
</template>

<script setup lang="ts">
const { t } = useI18n()
const colorMode = useColorMode()

const currentThemeLabel = computed(() => {
  switch (colorMode.preference) {
    case 'light': return t('theme.light')
    case 'dark': return t('theme.dark')
    default: return t('theme.system')
  }
})

const themeItems = computed(() => [
  [
    {
      label: t('theme.light'),
      icon: 'i-lucide-sun',
      onSelect: () => { colorMode.preference = 'light' }
    },
    {
      label: t('theme.dark'),
      icon: 'i-lucide-moon',
      onSelect: () => { colorMode.preference = 'dark' }
    },
    {
      label: t('theme.system'),
      icon: 'i-lucide-monitor',
      onSelect: () => { colorMode.preference = 'system' }
    },
  ]
])
</script>
