<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ScrambleText from './ScrambleText.vue'

const letters = 'PROJECT'.split('')
const selectedProject = ref(null)
const closeButton = ref(null)
const projects = [
  { index: '001', category: 'COMPUTER VISION', title: 'JEWELRY SKU CLASSIFIER', date: 'SEP. 2026 — PRESENT', summary: 'An image-classification pipeline for recognizing handmade jewelry when barcode information is unavailable, built for visually difficult product conditions.', stack: ['Python', 'PyTorch', 'Computer Vision', '1-NN', 'Model Evaluation', 'Image Classification'], details: ['Designed a pipeline targeting both Top-1 and Top-3 SKU prediction performance.', 'Established a 1-NN baseline over pretrained visual features and a linear-classifier primary approach.', 'Structured evaluation around lighting, camera angle, reflections, and visually similar product classes.'], outcome: 'A robust evaluation-first approach that compares model behavior beyond aggregate accuracy.' },
  { index: '002', category: 'GAME DEVELOPMENT', title: 'AFTER HOURS: MUSEUM SHIFT', date: 'OCT. 2026 — PRESENT', summary: 'A first-person survival-horror prototype set inside a museum, combining randomized exhibit tasks with a responsive tablet interface and anomaly systems.', stack: ['Unreal Engine 5', 'Blueprints', 'Gameplay AI', 'UI / HUD', 'Git', 'Systems Design'], details: ['Built artifact interaction, task progression, tablet UI, flashlight controls, and player feedback systems.', 'Designed randomized non-repeating exhibit objectives with context-sensitive interface updates.', 'Integrated player, environment, and anomaly-AI systems across a four-person GitHub workflow.'], outcome: 'A unified playable Alpha focused on scalable systems and readable moment-to-moment feedback.' },
  { index: '003', category: 'AI SYSTEMS', title: 'AI SUPPORT OPERATIONS AGENT', date: 'SEP. 2026 — PRESENT', summary: 'An LLM-powered support workflow coordinating knowledge search, booking lookup, and human escalation across five request categories.', stack: ['Python', 'OpenAI API', 'Function Calling', 'pytest', 'Evaluation', 'Integration Testing'], details: ['Built a 60-case benchmark covering category accuracy, escalation, tool selection, and runtime reliability.', 'Added deterministic tool-routing tests and end-to-end evaluation for the complete support flow.', 'Improved end-to-end performance from 65.0% to 75.0% and escalation accuracy from 93.3% to 98.3%.'], outcome: 'A measurable, testable agent workflow with stronger routing and escalation reliability.' },
]

function openCaseStudy(project) { selectedProject.value = project; nextTick(() => closeButton.value?.focus()) }
function closeCaseStudy() { selectedProject.value = null }
function handleKeydown(event) { if (event.key === 'Escape' && selectedProject.value) closeCaseStudy() }
watch(selectedProject, (project) => { document.body.style.overflow = project ? 'hidden' : '' })
onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => { window.removeEventListener('keydown', handleKeydown); document.body.style.overflow = '' })
</script>

<template>
  <section id="projects" class="projects" aria-labelledby="projects-title">
    <h2 id="projects-title" class="sr-only">Projects</h2>
    <div class="project-word" aria-label="PROJECT">
      <span v-for="(letter, index) in letters" :key="`${letter}-${index}`" class="project-letter"><span class="project-letter__hanger"><ScrambleText :text="letter" tag="span" class="project-letter__glyph" :duration="500 + index * 28" repeat /></span></span>
    </div>
    <div class="project-browser" tabindex="0" aria-label="Scrollable project overview">
      <header><span>SELECTED WORK / 2026</span><span>03 PROJECTS</span></header>
      <article v-for="(project, index) in projects" :key="project.index" class="project-entry" :class="{ 'project-entry--dark': index % 2 === 1 }">
        <div class="project-overview">
          <div class="project-overview__meta"><span>{{ project.index }} / {{ project.category }}</span><time>{{ project.date }}</time></div>
          <ScrambleText :text="project.title" tag="h3" :duration="650" repeat />
          <p class="project-overview__summary">{{ project.summary }}</p>
          <div class="project-overview__lower">
            <div class="project-stack"><h4>STACK</h4><ul><li v-for="item in project.stack" :key="item">{{ item }}</li></ul></div>
            <button type="button" class="project-open" @click="openCaseStudy(project)">OPEN CASE STUDY</button>
          </div>
        </div>
      </article>
    </div>
    <Teleport to="body">
      <section v-if="selectedProject" class="case-study" role="dialog" aria-modal="true" :aria-labelledby="`case-study-${selectedProject.index}`">
        <header class="case-study__bar"><span>ELSEWHERE / CASE STUDY {{ selectedProject.index }}</span><button ref="closeButton" type="button" @click="closeCaseStudy">CLOSE</button></header>
        <div class="case-study__content">
          <div class="case-study__hero"><div><span>{{ selectedProject.category }}</span><h2 :id="`case-study-${selectedProject.index}`">{{ selectedProject.title }}</h2></div><time>{{ selectedProject.date }}</time></div>
          <div class="case-study__grid">
            <section><h3>OVERVIEW</h3><p>{{ selectedProject.summary }}</p></section>
            <section class="case-study__stack"><h3>STACK</h3><ul><li v-for="item in selectedProject.stack" :key="item">{{ item }}</li></ul></section>
            <section class="case-study__contributions"><h3>CONTRIBUTIONS</h3><ol><li v-for="detail in selectedProject.details" :key="detail">{{ detail }}</li></ol></section>
            <section class="case-study__outcome"><h3>OUTCOME</h3><p>{{ selectedProject.outcome }}</p></section>
          </div>
        </div>
      </section>
    </Teleport>
  </section>
</template>
