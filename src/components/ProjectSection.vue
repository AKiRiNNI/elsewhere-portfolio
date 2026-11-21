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
        <div class="project-entry__resume">
          <span class="project-entry__index">001 / COMPUTER VISION</span>
          <div class="project-entry__title-row">
            <ScrambleText text="JEWELRY SKU CLASSIFIER" repeat />
            <time>SEP. 2026 — PRESENT</time>
          </div>
          <p class="project-entry__stack">PYTHON / PYTORCH / COMPUTER VISION</p>
          <ul class="project-entry__bullets">
            <li>Designing an image-classification pipeline to identify handmade jewelry SKUs when barcode information is unavailable, targeting both <strong>Top-1 and Top-3</strong> prediction performance.</li>
            <li>Defined a baseline using <strong>1-NN over pretrained visual features</strong> and a primary approach using a pretrained image encoder with a linear classifier.</li>
            <li>Evaluating robustness across lighting variation, camera angle, reflections, and visually similar product classes.</li>
          </ul>
        </div>
      </article>

      <article class="project-entry project-entry--dark">
        <div class="project-entry__resume">
          <span class="project-entry__index">002 / GAME DEVELOPMENT</span>
          <div class="project-entry__title-row">
            <ScrambleText text="AFTER HOURS: MUSEUM SHIFT" :duration="720" repeat />
            <time>OCT. 2026 — PRESENT</time>
          </div>
          <p class="project-entry__stack">UNREAL ENGINE 5 / BLUEPRINTS / GAMEPLAY AI / GIT</p>
          <ul class="project-entry__bullets">
            <li>Built a playable <strong>first-person survival-horror prototype</strong> with systems for artifact interaction, task progression, tablet UI, flashlight controls, and player feedback.</li>
            <li>Designed a scalable randomized task system that generates non-repeating exhibit objectives and updates a context-sensitive tablet interface.</li>
            <li>Integrated player, environment, and anomaly-AI systems into a unified Alpha build across a four-person GitHub workflow.</li>
          </ul>
        </div>
      </article>

      <article class="project-entry">
        <div class="project-entry__resume">
          <span class="project-entry__index">003 / AI SYSTEMS</span>
          <div class="project-entry__title-row">
            <ScrambleText text="AI SUPPORT OPERATIONS AGENT" :duration="580" repeat />
            <time>SEP. 2026 — PRESENT</time>
          </div>
          <p class="project-entry__stack">PYTHON / OPENAI API / FUNCTION CALLING / PYTEST</p>
          <ul class="project-entry__bullets">
            <li>Built an LLM-powered workflow coordinating knowledge search, booking lookup, and human escalation across <strong>five request categories</strong>.</li>
            <li>Designed a <strong>60-case evaluation benchmark</strong> covering category accuracy, escalation, tool selection, runtime reliability, and end-to-end performance.</li>
            <li>Improved end-to-end performance from <strong>65.0% to 75.0%</strong> and escalation accuracy from <strong>93.3% to 98.3%</strong>.</li>
          </ul>
        </div>
      </article>
    </div>
  </section>
</template>
