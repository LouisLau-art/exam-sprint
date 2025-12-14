<template>
  <div :class="['card', hoverEffect && 'card-hover', className]">
    <div v-if="title || $slots.header" class="mb-4 flex-between">
      <h3 v-if="title" class="text-lg font-semibold text-slate-800 dark:text-slate-100">
        {{ title }}
      </h3>
      <slot name="header" />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  hoverEffect?: boolean
  className?: string
}

withDefaults(defineProps<Props>(), {
  hoverEffect: false,
  className: '',
})
</script>
