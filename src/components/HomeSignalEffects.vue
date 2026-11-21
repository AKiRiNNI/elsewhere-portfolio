<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { createShakeDetector, SHAKE_CONFIG } from '../composables/useMouseShake.js'
import OrganicNoiseBackground from './OrganicNoiseBackground.vue'

const scope = ref(null)
const enabled = ref(true)
const active = ref(false)
const homeVisible = ref(false)
const reducedMotion = ref(false)

let observer
let effectTimer

function stopEffect() {
  clearTimeout(effectTimer)
  active.value = false
}

function triggerEffect() {
  if (!enabled.value || reducedMotion.value || !homeVisible.value || !document.body.classList.contains('intro-complete')) return
  stopEffect()
  active.value = true
  effectTimer = window.setTimeout(stopEffect, SHAKE_CONFIG.effectDurationMs)
}

const detector = createShakeDetector(triggerEffect)

function onPointerMove(event) {
  if (!enabled.value || !homeVisible.value || !document.body.classList.contains('intro-complete') || event.pointerType === 'touch') return
  detector.push({
    x: event.clientX,
    y: event.clientY,
    time: performance.now(),
    pointerType: event.pointerType || 'mouse',
  })
}

watch(enabled, (isEnabled) => {
  detector.reset()
  if (!isEnabled) {
    stopEffect()
  }
})

onMounted(() => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducedMotion.value) enabled.value = false

  observer = new IntersectionObserver(([entry]) => {
    homeVisible.value = entry.isIntersecting && entry.intersectionRatio >= 0.45
    if (!homeVisible.value) {
      detector.reset()
    }
  }, { threshold: [0.45] })
  const home = document.querySelector('#home')
  if (home) observer.observe(home)

  if (!reducedMotion.value) window.addEventListener('pointermove', onPointerMove, { passive: true })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('pointermove', onPointerMove)
  stopEffect()
})
</script>

<template>
  <div ref="scope" class="home-signal-scope">
    <OrganicNoiseBackground :enabled="enabled && !reducedMotion" visible :boosted="active" :show-whispers="homeVisible" />
    <div class="crt-interference" :class="{ 'is-active': active }" aria-hidden="true">
      <div class="crt-static"></div>
      <div class="crt-scanlines"></div>
      <i class="crt-band crt-band--one"></i>
      <i class="crt-band crt-band--two"></i>
      <i class="crt-band crt-band--three"></i>
    </div>
    <button
      class="signal-toggle"
      type="button"
      :disabled="reducedMotion"
      :aria-pressed="enabled"
      @click="enabled = !enabled"
    >
      SIGNAL FX: {{ reducedMotion ? 'OFF / REDUCED MOTION' : (enabled ? 'ON' : 'OFF') }}
    </button>
  </div>
</template>
