<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import OrganicNoiseBackground from './OrganicNoiseBackground.vue'

defineProps({
  light: { type: Boolean, default: false },
})

const scope = ref(null)
const visible = ref(false)
const enabled = ref(true)
let observer

onMounted(() => {
  enabled.value = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  observer = new IntersectionObserver(([entry]) => {
    visible.value = entry.isIntersecting
  }, { threshold: 0 })
  observer.observe(scope.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div ref="scope" class="section-noise" aria-hidden="true">
    <div class="section-noise__viewport">
      <OrganicNoiseBackground :enabled="enabled" :visible="visible" :light="light" :show-whispers="false" />
    </div>
  </div>
</template>
