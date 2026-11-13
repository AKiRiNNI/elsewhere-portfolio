<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  tag: { type: String, default: 'h3' },
  duration: { type: Number, default: 650 },
  repeat: { type: Boolean, default: false },
})

const root = ref(null)
const displayText = ref(props.text)
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+-=?@'

let observer
let animationFrame
let hasAnimated = false
let isVisible = false

function randomCharacter() {
  return characters[Math.floor(Math.random() * characters.length)]
}

function startScramble() {
  if (hasAnimated || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  hasAnimated = true
  const start = performance.now()
  const target = [...props.text]

  function update(now) {
    const progress = Math.min((now - start) / props.duration, 1)
    displayText.value = target.map((character, index) => {
      if (/\s/.test(character)) return character
      const resolveAt = 0.16 + (index / Math.max(target.length - 1, 1)) * 0.68
      return progress >= resolveAt ? character : randomCharacter()
    }).join('')

    if (progress < 1) animationFrame = requestAnimationFrame(update)
    else displayText.value = props.text
  }

  animationFrame = requestAnimationFrame(update)
}

onMounted(() => {
  observer = new IntersectionObserver(([entry]) => {
    const nextVisible = entry.isIntersecting && entry.intersectionRatio >= 0.35
    if (nextVisible && !isVisible) {
      startScramble()
      if (!props.repeat) observer?.disconnect()
    } else if (!nextVisible && isVisible && props.repeat) {
      cancelAnimationFrame(animationFrame)
      displayText.value = props.text
      hasAnimated = false
    }
    isVisible = nextVisible
  }, { threshold: [0, 0.35] })
  observer.observe(root.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  cancelAnimationFrame(animationFrame)
})
</script>

<template>
  <component :is="tag" ref="root" class="scramble-text" :aria-label="text.replace(/\n/g, ' ')">
    <span class="scramble-text__original" aria-hidden="true">{{ text }}</span>
    <span class="scramble-text__visual" aria-hidden="true">{{ displayText }}</span>
  </component>
</template>
