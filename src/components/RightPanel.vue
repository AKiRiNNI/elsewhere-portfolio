<script setup>
import { onBeforeUnmount } from 'vue'

let activeDrag = null

const windows = [
  { id: '01', kind: 'player', title: 'NOW PLAYING', heading: 'UNTITLED SIGNAL', note: 'PLAYER PLACEHOLDER' },
  { id: '02', kind: 'note', title: 'DREAM.LOG', heading: 'MIDNIGHT NOTE', note: 'ARCHIVE MESSAGE' },
  { id: '03', kind: 'status', title: 'STATUS.EXE', heading: 'STILL DREAMING', note: 'CONNECTION STABLE' },
]

function onPointerMove(event) {
  if (!activeDrag) return
  const x = activeDrag.originX + event.clientX - activeDrag.startX
  const y = activeDrag.originY + event.clientY - activeDrag.startY
  activeDrag.element.dataset.dragX = x
  activeDrag.element.dataset.dragY = y
  activeDrag.element.style.translate = `${x}px ${y}px`
}

function endDrag() {
  activeDrag?.element.classList.remove('is-dragging')
  activeDrag = null
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', endDrag)
}

function startDrag(event) {
  const element = event.currentTarget.closest('.popup-window')
  activeDrag = {
    element,
    startX: event.clientX,
    startY: event.clientY,
    originX: Number(element.dataset.dragX || 0),
    originY: Number(element.dataset.dragY || 0),
  }
  element.classList.add('is-dragging')
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', endDrag, { once: true })
}

function resetPositions() {
  document.querySelectorAll('.popup-window').forEach((element) => {
    element.dataset.dragX = 0
    element.dataset.dragY = 0
    element.style.translate = '0px 0px'
  })
}

defineExpose({ resetPositions })
onBeforeUnmount(endDrag)
</script>

<template>
  <div class="popup-cluster" aria-label="Draggable popup placeholders">
    <section v-for="item in windows" :key="item.id" class="popup-window" :class="`popup-window--${item.kind}`">
      <header class="popup-window__bar" @pointerdown="startDrag">
        <span>{{ item.title }}</span>
        <span class="popup-window__controls">— □ ×</span>
      </header>
      <div class="popup-window__body">
        <div class="popup-window__heading">
          <span class="popup-window__index">{{ item.id }}</span>
          <strong>{{ item.heading }}</strong>
          <small>{{ item.note }}</small>
        </div>
        <div v-if="item.kind === 'player'" class="popup-window__visual player-visual">
          <i></i><span></span><span></span><span></span>
        </div>
        <div v-else-if="item.kind === 'note'" class="popup-window__visual note-visual">
          <p>THINGS SEEN BETWEEN<br />SLEEP &amp; STATIC.</p><span></span><span></span><span></span>
        </div>
        <div v-else class="popup-window__visual status-visual">
          <span>ONLINE</span><b>87%</b><i></i><small>SIGNAL / DREAM</small>
        </div>
      </div>
    </section>
  </div>
</template>
