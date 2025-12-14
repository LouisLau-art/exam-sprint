<template>
  <div id="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// Initialize theme on app mount
const colorMode = useColorMode()

// Apply theme class to document
watchEffect(() => {
  if (import.meta.client) {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    
    if (colorMode.preference === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.add(prefersDark ? 'dark' : 'light')
    } else {
      root.classList.add(colorMode.preference)
    }
  }
})
</script>
