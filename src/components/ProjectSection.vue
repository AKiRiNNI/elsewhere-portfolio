<script setup>
import ScrambleText from './ScrambleText.vue'

const letters = 'PROJECT'.split('')
</script>

<template>
  <section id="projects" class="projects" aria-labelledby="projects-title">
    <h2 id="projects-title" class="sr-only">Projects</h2>

    <div class="project-word" aria-label="PROJECT">
      <span
        v-for="(letter, index) in letters"
        :key="`${letter}-${index}`"
        class="project-letter"
      >
        <span class="project-letter__hanger">
          <ScrambleText
            :text="letter"
            tag="span"
            class="project-letter__glyph"
            :duration="500 + index * 28"
            repeat
          />
        </span>
      </span>
    </div>

    <div class="project-browser" tabindex="0" aria-label="Scrollable project experience">
      <header>
        <span>SELECTED WORK / 2026</span>
        <span>03 PROJECTS</span>
      </header>

      <article class="project-entry">
        <span>001 / COMPUTER VISION</span>
        <ScrambleText text="JEWELRY SKU\nCLASSIFIER." repeat />
        <p>An image-classification pipeline for recognizing handmade jewelry from product photos when barcode information is unavailable, evaluated across lighting, reflections, camera angles, and visually similar products.</p>
        <small>2026 — PYTHON / PYTORCH / COMPUTER VISION</small>
      </article>

      <article class="project-entry project-entry--dark">
        <span>002 / GAME DEVELOPMENT</span>
        <ScrambleText text="AFTER HOURS:\nMUSEUM SHIFT." :duration="720" repeat />
        <p>A first-person survival-horror prototype set inside a multi-room museum, featuring randomized exhibit tasks, interaction systems, tablet UI, flashlight controls, and anomaly-driven gameplay.</p>
        <small>2026 — UNREAL ENGINE 5 / BLUEPRINTS / GAMEPLAY AI</small>
      </article>

      <article class="project-entry">
        <span>003 / AI SYSTEMS</span>
        <ScrambleText text="AI SUPPORT\nOPERATIONS AGENT." :duration="580" repeat />
        <p>An evaluated LLM workflow coordinating knowledge search, booking lookup, and human escalation through structured function calling, tested against a 60-case benchmark.</p>
        <small>2026 — PYTHON / OPENAI API / FUNCTION CALLING / PYTEST</small>
      </article>
    </div>
  </section>
</template>
