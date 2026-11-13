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
        <span>SELECTED WORK / PLACEHOLDERS</span>
        <span>SCROLL INSIDE ↓</span>
      </header>

      <article class="project-entry">
        <span>001 / INTERACTIVE</span>
        <ScrambleText text="PROJECT TITLE\nGOES HERE." repeat />
        <p>Short project description placeholder. Add the idea, your role, and what made the work interesting.</p>
        <small>YEAR — ROLE — MEDIUM</small>
      </article>

      <article class="project-entry project-entry--dark">
        <span>002 / VISUAL STORY</span>
        <ScrambleText text="ANOTHER\nSTRANGE WORLD." :duration="720" repeat />
        <p>A second placeholder for a visual experiment, motion piece, illustration series, or personal story.</p>
        <small>YEAR — ROLE — MEDIUM</small>
      </article>

      <article class="project-entry">
        <span>003 / ARCHIVE</span>
        <ScrambleText text="ONE MORE\nFOR THE LOG." :duration="580" repeat />
        <p>Keep scrolling inside this window without leaving the Project chapter.</p>
        <small>REPLACE WITH REAL WORK ↗</small>
      </article>
    </div>
  </section>
</template>
