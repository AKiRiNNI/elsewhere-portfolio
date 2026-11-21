<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ORGANIC_NOISE_CONFIG } from '../config/organicNoise.js'

const props = defineProps({
  enabled: { type: Boolean, default: true },
  visible: { type: Boolean, default: true },
  boosted: { type: Boolean, default: false },
  showWhispers: { type: Boolean, default: true },
  light: { type: Boolean, default: false },
})

const canvas = ref(null)
const whisperLayer = ref(null)
let gl
let program
let buffer
let resizeObserver
let frame
let startTime = 0
let previousPointer
let lastPointerTime = 0
let velocityTarget = 0
let velocitySmoothed = 0
let whisperProximity = Array(6).fill(0)
let whisperOpacity = Array(6).fill(0)
let pointer = { x: 0.5, y: 0.5 }
let trail = { x: 0.5, y: 0.5 }
let uniforms = {}

const vertexSource = `
  attribute vec2 aPosition;
  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`

const fragmentSource = `
  precision mediump float;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform vec2 uTrail;
  uniform float uTime;
  uniform float uScale;
  uniform float uContrast;
  uniform float uOpacity;
  uniform float uBaseOpacity;
  uniform float uRadius;
  uniform float uBoost;
  uniform float uTone;

  vec2 hash22(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float gradientNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash22(i), f), dot(hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(hash22(i + vec2(1.0, 1.0)), f - 1.0), u.x),
      u.y
    ) * 0.5 + 0.5;
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.55;
    mat2 rotation = mat2(0.82, -0.57, 0.57, 0.82);
    for (int i = 0; i < 5; i++) {
      value += amplitude * gradientNoise(p);
      p = rotation * p * 2.03 + 7.17;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 p = uv * aspect * uScale;
    float t = uTime;
    float field = fbm(p + vec2(t * 0.42, -t * 0.25));
    field += 0.32 * fbm(p * 1.7 + vec2(-t * 0.18, t * 0.31));
    field /= 1.32;

    float organic = smoothstep(0.48 - 0.15 / uContrast, 0.48 + 0.15 / uContrast, field);
    float sharpBand = smoothstep(0.61, 0.625, field) * 0.42;

    vec2 cursorDelta = (uv - uPointer) * aspect;
    vec2 trailDelta = (uv - uTrail) * aspect;
    float cursorReveal = 1.0 - smoothstep(uRadius * 0.28, uRadius, length(cursorDelta));
    float trailReveal = (1.0 - smoothstep(uRadius * 0.18, uRadius * 1.18, length(trailDelta))) * 0.36;
    float reveal = clamp(cursorReveal + trailReveal, 0.0, 1.0);
    float alpha = organic * uBaseOpacity;
    alpha += (organic * 0.72 + sharpBand) * uOpacity * reveal;
    alpha = min(alpha + uBoost * organic * 0.085, 0.34);
    gl_FragColor = vec4(vec3(uTone), alpha);
  }
`

function createShader(type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`Organic noise shader failed: ${message}`)
  }
  return shader
}

function resize() {
  if (!gl || !canvas.value) return
  const bounds = canvas.value.getBoundingClientRect()
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1) * ORGANIC_NOISE_CONFIG.renderScale
  const width = Math.max(1, Math.round(bounds.width * pixelRatio))
  const height = Math.max(1, Math.round(bounds.height * pixelRatio))
  if (canvas.value.width !== width || canvas.value.height !== height) {
    canvas.value.width = width
    canvas.value.height = height
    gl.viewport(0, 0, width, height)
  }
}

function onPointerMove(event) {
  if (!props.enabled || !props.visible || event.pointerType === 'touch' || !document.body.classList.contains('intro-complete')) return
  const bounds = canvas.value?.getBoundingClientRect()
  if (!bounds) return
  const now = performance.now()
  const dt = Math.max(now - (previousPointer?.time || now), 1)
  const dx = event.clientX - (previousPointer?.x ?? event.clientX)
  const dy = event.clientY - (previousPointer?.y ?? event.clientY)
  const velocity = Math.hypot(dx, dy) / dt * 1000
  velocityTarget = Math.min(velocity * ORGANIC_NOISE_CONFIG.velocitySensitivity, 1)
  pointer.x = Math.min(Math.max((event.clientX - bounds.left) / bounds.width, 0), 1)
  pointer.y = 1 - Math.min(Math.max((event.clientY - bounds.top) / bounds.height, 0), 1)
  const whisperItems = props.showWhispers ? (whisperLayer.value?.children || []) : []
  Array.from(whisperItems).forEach((item, index) => {
    const itemBounds = item.getBoundingClientRect()
    const centerX = itemBounds.left + itemBounds.width * 0.5
    const centerY = itemBounds.top + itemBounds.height * 0.5
    const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY)
    whisperProximity[index] = Math.max(0, 1 - distance / Math.max(220, itemBounds.width * 1.15))
  })
  previousPointer = { x: event.clientX, y: event.clientY, time: now }
  lastPointerTime = now
}

function render(now) {
  if (!gl || !props.enabled || !props.visible) {
    frame = null
    return
  }

  const delta = Math.min(now - (lastPointerTime || now), ORGANIC_NOISE_CONFIG.fadeOutDuration)
  if (delta > 34) velocityTarget *= Math.max(0, 1 - delta / ORGANIC_NOISE_CONFIG.fadeOutDuration)
  velocitySmoothed += (velocityTarget - velocitySmoothed) * 0.09
  const whisperItems = props.showWhispers ? (whisperLayer.value?.children || []) : []
  Array.from(whisperItems).forEach((item, index) => {
    const whisperTarget = (whisperProximity[index] ?? 0) * Math.min(0.55, velocitySmoothed * 0.7)
    whisperOpacity[index] = (whisperOpacity[index] ?? 0) + (whisperTarget - (whisperOpacity[index] ?? 0)) * 0.1
    item.style.opacity = whisperOpacity[index].toFixed(3)
  })
  trail.x += (pointer.x - trail.x) * 0.055
  trail.y += (pointer.y - trail.y) * 0.055

  const opacity = velocitySmoothed * (ORGANIC_NOISE_CONFIG.maxOpacity - ORGANIC_NOISE_CONFIG.baseOpacity)

  gl.useProgram(program)
  gl.uniform2f(uniforms.resolution, canvas.value.width, canvas.value.height)
  gl.uniform2f(uniforms.pointer, pointer.x, pointer.y)
  gl.uniform2f(uniforms.trail, trail.x, trail.y)
  gl.uniform1f(uniforms.time, ((now - startTime) / 1000) * ORGANIC_NOISE_CONFIG.noiseSpeed)
  gl.uniform1f(uniforms.scale, ORGANIC_NOISE_CONFIG.noiseScale)
  gl.uniform1f(uniforms.contrast, ORGANIC_NOISE_CONFIG.noiseContrast)
  gl.uniform1f(uniforms.opacity, opacity)
  gl.uniform1f(uniforms.baseOpacity, ORGANIC_NOISE_CONFIG.baseOpacity)
  gl.uniform1f(uniforms.radius, ORGANIC_NOISE_CONFIG.revealRadius)
  gl.uniform1f(uniforms.boost, props.boosted ? 1 : 0)
  gl.uniform1f(uniforms.tone, props.light ? 1 : 0)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
  frame = requestAnimationFrame(render)
}

function syncRendering() {
  if (props.enabled && props.visible && gl && !frame) {
    startTime = performance.now()
    frame = requestAnimationFrame(render)
  } else if ((!props.enabled || !props.visible) && frame) {
    cancelAnimationFrame(frame)
    frame = null
    velocityTarget = 0
    velocitySmoothed = 0
    whisperOpacity = Array(6).fill(0)
    Array.from(whisperLayer.value?.children || []).forEach((item) => { item.style.opacity = '0' })
  }
}

onMounted(() => {
  gl = canvas.value.getContext('webgl', { alpha: true, antialias: false, depth: false, powerPreference: 'low-power' })
  if (!gl) return

  const vertexShader = createShader(gl.VERTEX_SHADER, vertexSource)
  const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentSource)
  program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(`Organic noise program failed: ${gl.getProgramInfoLog(program)}`)

  buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const position = gl.getAttribLocation(program, 'aPosition')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
  uniforms = {
    resolution: gl.getUniformLocation(program, 'uResolution'),
    pointer: gl.getUniformLocation(program, 'uPointer'),
    trail: gl.getUniformLocation(program, 'uTrail'),
    time: gl.getUniformLocation(program, 'uTime'),
    scale: gl.getUniformLocation(program, 'uScale'),
    contrast: gl.getUniformLocation(program, 'uContrast'),
    opacity: gl.getUniformLocation(program, 'uOpacity'),
    baseOpacity: gl.getUniformLocation(program, 'uBaseOpacity'),
    radius: gl.getUniformLocation(program, 'uRadius'),
    boost: gl.getUniformLocation(program, 'uBoost'),
    tone: gl.getUniformLocation(program, 'uTone'),
  }
  gl.clearColor(0, 0, 0, 0)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas.value)
  resize()
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  syncRendering()
})

watch(() => [props.enabled, props.visible], syncRendering)

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  resizeObserver?.disconnect()
  window.removeEventListener('pointermove', onPointerMove)
  if (gl) {
    if (buffer) gl.deleteBuffer(buffer)
    if (program) gl.deleteProgram(program)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
})
</script>

<template>
  <canvas ref="canvas" class="organic-noise-canvas" aria-hidden="true"></canvas>
  <div v-show="showWhispers" ref="whisperLayer" class="noise-whispers" aria-hidden="true">
    <span class="noise-whisper noise-whisper--name">ZIYUE LIN</span>
    <span class="noise-whisper noise-whisper--portfolio">PORTFOLIO</span>
    <span class="noise-whisper noise-whisper--scroll">SCROLL</span>
    <span class="noise-whisper noise-whisper--down">DOWN</span>
    <span class="noise-whisper noise-whisper--question">Why Are You Still Here?</span>
    <span class="noise-whisper noise-whisper--code">298142</span>
  </div>
</template>
