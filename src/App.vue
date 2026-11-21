<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import AboutMe from './components/AboutMe.vue'
import EyeCutIn from './components/EyeCutIn.vue'
import HomeSignalEffects from './components/HomeSignalEffects.vue'
import ProjectSection from './components/ProjectSection.vue'
import RightPanel from './components/RightPanel.vue'
import SiteNav from './components/SiteNav.vue'
import SpinningCD from './components/SpinningCD.vue'

const publicBase = import.meta.env.BASE_URL

// Edit these values to retime the whole intro without touching the timeline.
const TIMING = {
  load: 2.4,
  completionHold: 0,
  wavePop: 0.42,
  waveStagger: 0.065,
  seesawLift: 0.26,
  airtime: 0.22,
  seesawRebound: 0.5,
  titleFall: 1.05,
  curtainExit: 1.55,
  eyeExpand: 0.28,
  gazeUpRight: 0.25,
  gazeRight: 0.22,
  gazeLeft: 0.3,
  eyeCollapse: 0.24,
  afterEyePause: 0.1,
  cdEntrance: 0.52,
  popupExpand: 0.4,
  popupStagger: 0.14,
}

const MOTION = {
  waveScale: 1.22,
  waveSpread: 8,
  seesawAngle: -11,
  bounceIntensity: 1.7,
  titleFallDistance: '56vh',
  cdSpinDuration: 9.5,
}

const root = ref(null)
const intro = ref(null)
const progressFill = ref(null)
const progressNumber = ref(null)
const title = ref(null)
const waves = ref([])
const replayButton = ref(null)
const eyeCutIn = ref(null)
const spinningCD = ref(null)
const rightPanel = ref(null)
const soundtrack = ref(null)
const introStarted = ref(false)

let introTimeline
let ambientContext
let cdSpinTween

const rememberWave = (el) => el && !waves.value.includes(el) && waves.value.push(el)

function reducedMotionEnabled() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function setProgress(value) {
  if (progressNumber.value) progressNumber.value.textContent = String(Math.round(value)).padStart(3, '0')
}

function startAmbientMotion() {
  ambientContext?.revert()
  if (reducedMotionEnabled()) return

  ambientContext = gsap.context(() => {
    gsap.to('.float-slow', { y: -12, rotation: 3, duration: 3.8, ease: 'sine.inOut', repeat: -1, yoyo: true })
    gsap.to('.float-fast', { y: 10, x: 5, rotation: -4, duration: 2.7, ease: 'sine.inOut', repeat: -1, yoyo: true })
    gsap.to('.orb', { scale: 1.08, duration: 3.2, ease: 'sine.inOut', repeat: -1, yoyo: true })
  }, root.value)
}

function stopCDSpin() {
  cdSpinTween?.kill()
  cdSpinTween = null
  const rotator = spinningCD.value?.$el?.querySelector('.cd-rotator')
  if (rotator) gsap.set(rotator, { rotation: 0 })
}

function startCDSpin() {
  stopCDSpin()
  const rotator = spinningCD.value?.$el?.querySelector('.cd-rotator')
  if (!rotator || reducedMotionEnabled()) return
  cdSpinTween = gsap.to(rotator, {
    rotation: 360,
    duration: MOTION.cdSpinDuration,
    repeat: -1,
    ease: 'none',
  })
}

function stopMusic() {
  if (!soundtrack.value) return
  soundtrack.value.pause()
  soundtrack.value.currentTime = 0
}

function startMusic() {
  if (!soundtrack.value) return
  soundtrack.value.currentTime = 0
  soundtrack.value.volume = 1
  const playRequest = soundtrack.value.play()
  playRequest?.catch(() => {
    // Audible autoplay can be blocked until the visitor interacts with the page.
  })
}

async function unlockMusic() {
  if (!soundtrack.value) return false
  soundtrack.value.currentTime = 0
  soundtrack.value.volume = 0
  try {
    await soundtrack.value.play()
    return true
  } catch {
    return false
  }
}

function prepareIntroGate() {
  document.body.classList.remove('intro-complete')
  gsap.set(intro.value, { display: 'grid', yPercent: 0 })
  gsap.set(progressFill.value, { scaleX: 0 })
  gsap.set(waves.value, { scaleX: 0.35, scaleY: 0, transformOrigin: 'center bottom' })
  gsap.set(replayButton.value, { autoAlpha: 0, y: 12 })
  gsap.set(eyeCutIn.value?.$el, { display: 'none' })
  setProgress(0)
}

async function beginIntro() {
  if (introStarted.value) return
  introStarted.value = true
  const audioUnlocked = await unlockMusic()
  playIntro({ preserveAudio: audioUnlocked })
}

async function replayIntro() {
  const audioUnlocked = await unlockMusic()
  playIntro({ preserveAudio: audioUnlocked })
}

function showReducedMotionVersion() {
  stopCDSpin()
  stopMusic()
  gsap.set(intro.value, { display: 'none' })
  gsap.set(replayButton.value, { autoAlpha: 1, y: 0 })
  gsap.set(eyeCutIn.value?.$el, { display: 'none' })
  gsap.set(spinningCD.value?.$el, { x: 0, autoAlpha: 1 })
  rightPanel.value?.resetPositions()
  gsap.set(rightPanel.value?.$el?.querySelectorAll('.popup-window'), { scaleX: 1, scaleY: 1, autoAlpha: 1 })
  document.body.classList.add('intro-complete')
  setProgress(100)
}

async function playIntro({ preserveAudio = false } = {}) {
  await nextTick()
  introTimeline?.kill()
  ambientContext?.revert()
  stopCDSpin()
  if (!preserveAudio) stopMusic()
  document.body.classList.remove('intro-complete')
  window.scrollTo({ top: 0 })

  if (reducedMotionEnabled()) {
    showReducedMotionVersion()
    return
  }

  const counter = { value: 0 }
  const eyeRoot = eyeCutIn.value.$el
  const eyeFrame = eyeRoot.querySelector('.eye-frame')
  const eyeContent = eyeRoot.querySelector('.eye-placeholder')
  const gazeIndicator = eyeRoot.querySelector('.gaze-indicator')
  const gazeLabel = eyeRoot.querySelector('.gaze-label')
  const cdRoot = spinningCD.value.$el
  const popupRoot = rightPanel.value.$el
  const popupWindows = popupRoot.querySelectorAll('.popup-window')
  gsap.set(intro.value, { display: 'grid', yPercent: 0 })
  gsap.set(progressFill.value, { scaleX: 0 })
  gsap.set(title.value, { y: 0, rotation: 0, transformOrigin: 'left center' })
  gsap.set(waves.value, { x: 0, y: 0, scaleX: 0.35, scaleY: 0, transformOrigin: 'center bottom' })
  gsap.set(replayButton.value, { autoAlpha: 0, y: 12 })
  gsap.set(eyeRoot, { display: 'grid' })
  gsap.set(eyeFrame, { scaleX: 0.015, scaleY: 0.04, transformOrigin: 'center center' })
  gsap.set(eyeContent, { clipPath: 'inset(50% 50% 50% 50%)' })
  gsap.set(gazeIndicator, { x: 0, y: 0 })
  gazeLabel.textContent = 'GAZE —'
  gsap.set(cdRoot, { x: -window.innerWidth * 0.45 - 220, autoAlpha: 1 })
  rightPanel.value.resetPositions()
  gsap.set(popupWindows, { scaleX: 0.18, scaleY: 0.035, autoAlpha: 0, transformOrigin: 'center center' })
  setProgress(0)

  introTimeline = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      startAmbientMotion()
      document.body.classList.add('intro-complete')
    },
  })
    .to(progressFill.value, { scaleX: 1, duration: TIMING.load, ease: 'power1.inOut' }, 0)
    .to(counter, { value: 100, duration: TIMING.load, ease: 'power1.inOut', onUpdate: () => setProgress(counter.value) }, 0)
    .addLabel('soundHit', `+=${TIMING.completionHold}`)
    .to(waves.value, {
      x: (index) => (index - 1) * MOTION.waveSpread,
      y: (index) => index === 1 ? -9 : -5,
      scaleX: MOTION.waveScale,
      scaleY: MOTION.waveScale,
      duration: TIMING.wavePop,
      stagger: TIMING.waveStagger,
      ease: 'back.out(2.2)',
    }, 'soundHit')
    .to(title.value, { rotation: MOTION.seesawAngle, duration: TIMING.seesawLift, ease: 'power3.out' }, 'soundHit+=0.06')
    .addLabel('soundSettle', `soundHit+=${TIMING.wavePop + TIMING.airtime}`)
    .addLabel('curtainExit', 'soundSettle')
    .to(waves.value, { y: 0, scaleX: 1, scaleY: 1, duration: TIMING.seesawRebound, stagger: 0.025, ease: 'power2.out' }, 'soundSettle')
    .to(title.value, { rotation: 0, duration: TIMING.seesawRebound, ease: `back.out(${MOTION.bounceIntensity})` }, 'soundSettle')
    .to(title.value, { y: MOTION.titleFallDistance, duration: TIMING.titleFall, ease: 'power2.in' }, 'curtainExit')
    .to(intro.value, { yPercent: 112, duration: TIMING.curtainExit, ease: 'power4.inOut' }, 'curtainExit')
    .set(intro.value, { display: 'none' }, `curtainExit+=${TIMING.curtainExit}`)
    .addLabel('eyeOpen', `curtainExit+=${TIMING.curtainExit}`)
    .call(startMusic, [], 'eyeOpen')
    .to(eyeFrame, { scaleX: 1, scaleY: 1, duration: TIMING.eyeExpand, ease: 'back.out(1.35)' }, 'eyeOpen')
    .to(eyeContent, { clipPath: 'inset(0% 0% 0% 0%)', duration: TIMING.eyeExpand * 0.8, ease: 'power3.out' }, 'eyeOpen+=0.04')
    .addLabel('gazeUpRight')
    .call(() => { gazeLabel.textContent = 'GAZE ↗' }, [], 'gazeUpRight')
    .to(gazeIndicator, { x: 18, y: -7, duration: TIMING.gazeUpRight, ease: 'power2.inOut' }, 'gazeUpRight')
    .addLabel('gazeRight')
    .call(() => { gazeLabel.textContent = 'GAZE →' }, [], 'gazeRight')
    .to(gazeIndicator, { x: 22, y: 0, duration: TIMING.gazeRight, ease: 'power2.inOut' }, 'gazeRight')
    .addLabel('gazeLeft')
    .call(() => { gazeLabel.textContent = 'GAZE ←' }, [], 'gazeLeft')
    .to(gazeIndicator, { x: -22, y: 0, duration: TIMING.gazeLeft, ease: 'power2.inOut' }, 'gazeLeft')
    .addLabel('eyeClose')
    .to(eyeContent, { clipPath: 'inset(50% 50% 50% 50%)', duration: TIMING.eyeCollapse * 0.72, ease: 'power3.in' }, 'eyeClose')
    .to(eyeFrame, { scaleX: 0.015, scaleY: 0.04, duration: TIMING.eyeCollapse, ease: 'power3.in' }, 'eyeClose')
    .set(eyeRoot, { display: 'none' })
    .addLabel('cdEntrance', `+=${TIMING.afterEyePause}`)
    .call(startCDSpin, [], 'cdEntrance')
    .to(cdRoot, { x: 0, duration: TIMING.cdEntrance, ease: 'back.out(1.45)' }, 'cdEntrance')
    .addLabel('popupOpen', `cdEntrance+=${TIMING.cdEntrance}`)
    .to(popupWindows, { scaleX: 1, scaleY: 1, autoAlpha: 1, duration: TIMING.popupExpand, stagger: TIMING.popupStagger, ease: 'back.out(1.25)' }, 'popupOpen')
    .to(replayButton.value, { autoAlpha: 1, y: 0, duration: 0.5 }, 'popupOpen+=0.08')
}

onMounted(() => {
  if (reducedMotionEnabled()) showReducedMotionVersion()
  else prepareIntroGate()
})
onBeforeUnmount(() => {
  introTimeline?.kill()
  ambientContext?.revert()
  stopCDSpin()
  stopMusic()
  document.body.classList.remove('intro-complete')
})
</script>

<template>
  <main ref="root" class="experience">
    <audio ref="soundtrack" :src="`${publicBase}audio/brainrot-feat-kasane-teto.mp3`" preload="auto" loop></audio>
    <SiteNav />
    <section id="home" class="home" aria-label="Portfolio preview">
      <HomeSignalEffects />
      <span class="spark spark-one float-fast" aria-hidden="true">✦</span>
      <span class="spark spark-two float-slow" aria-hidden="true">✧</span>
      <div class="orb float-slow" aria-hidden="true"></div>
      <div class="moon float-fast" aria-hidden="true"><span></span></div>
      <div class="music-stage">
        <SpinningCD ref="spinningCD" />
        <RightPanel ref="rightPanel" />
      </div>

      <footer>
        <span>BEST VIEWED AFTER MIDNIGHT</span>
        <button ref="replayButton" class="replay" type="button" @click="replayIntro">
          <span>↻</span> REPLAY INTRO
        </button>
        <span>© 2026 — SOMEWHERE ONLINE</span>
      </footer>
    </section>

    <AboutMe />
    <ProjectSection />

    <EyeCutIn ref="eyeCutIn" />

    <section ref="intro" class="intro" aria-label="Loading introduction" aria-live="polite">
      <div class="intro-grain" aria-hidden="true"></div>
      <div class="loading-card">
        <button ref="title" class="sound-title" type="button" :disabled="introStarted" @click="beginIntro">
          <span class="headphones" aria-hidden="true">◖ ◗</span>
          <h2>TURN UP<br /><i>SOUND</i></h2>
          <div class="waves" aria-hidden="true">
            <span v-for="n in 3" :key="n" :ref="rememberWave"></span>
          </div>
        </button>
        <p class="sound-prompt" :class="{ 'is-attention': !introStarted }">{{ introStarted ? 'Sound enabled — entering dream.' : 'Click the title to begin with sound.' }}</p>
        <div class="progress-wrap">
          <div class="progress-meta"><span>LOADING A DREAM</span><strong ref="progressNumber">000</strong></div>
          <div class="progress-track"><span ref="progressFill"></span></div>
        </div>
      </div>
    </section>
  </main>
</template>
