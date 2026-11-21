<script setup>
const portraitUrl = `${import.meta.env.BASE_URL}images/oc-id-photo.jpg`
</script>

<template>
  <section id="about" class="about" aria-labelledby="about-title">
    <div class="about__layout">
      <header class="about__intro">
        <span>CHAPTER 01 / ABOUT</span>
        <div class="about__portrait">
          <img :src="portraitUrl" alt="Ziyue Lin's original character portrait" />
        </div>
        <h2 id="about-title" class="about__name">ZIYUE LIN</h2>
        <p>COMPUTER SCIENCE / AI SYSTEMS / GAME DEVELOPMENT</p>
        <nav class="about__links" aria-label="Contact links">
          <a href="mailto:Ziyue8@illinois.edu" aria-label="Email Ziyue Lin" title="Email"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 5h20v14H2V5Zm2 2v.4l8 5.2 8-5.2V7H4Zm16 10V9.8L12 15 4 9.8V17h16Z" /></svg></a>
          <a href="https://github.com/AKiRiNNI" target="_blank" rel="noreferrer" aria-label="Ziyue Lin on GitHub" title="GitHub"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.82a9.6 9.6 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg></a>
          <a href="https://www.linkedin.com/in/ziyue-lin-749902250" target="_blank" rel="noreferrer" aria-label="Ziyue Lin on LinkedIn" title="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.34 3.5A2.34 2.34 0 1 1 5.33 8.2a2.34 2.34 0 0 1 0-4.68ZM3.3 9.9h4.08V21H3.3V9.9Zm6.62 0h3.91v1.52h.06c.54-1.03 1.87-2.12 3.86-2.12 4.13 0 4.9 2.72 4.9 6.26V21h-4.08v-4.82c0-1.15-.02-2.63-1.6-2.63-1.61 0-1.86 1.25-1.86 2.55V21h-4.08V9.9Z" /></svg></a>
        </nav>
        <a class="about__scroll" href="#about-details">SCROLL TO READ <b>↓</b></a>
      </header>

      <div id="about-details" class="about__cards">
        <article class="about-card">
          <span>01 / EDUCATION</span>
          <div>
            <h3 class="about-card__school">UNIVERSITY OF ILLINOIS<br />AT URBANA-CHAMPAIGN</h3>
            <div class="about-card__education">
              <section>
                <strong>MASTER OF COMPUTER SCIENCE</strong>
                <span>EXPECTED MAY 2028</span>
              </section>
              <section>
                <strong>B.S. COMPUTER SCIENCE + ECONOMICS</strong>
                <span>MINOR IN THEATRE / MAY 2026</span>
              </section>
            </div>
          </div>
          <small>CHAMPAIGN, ILLINOIS</small>
        </article>

        <article class="about-card about-card--dark">
          <span>02 / PERSONAL TAGS</span>
          <div>
            <h3>THINGS I<br />KEEP RETURNING TO.</h3>
            <ul>
              <li>HUMAN × AI</li>
              <li>MACHINE VISION</li>
              <li>GAMEPLAY SYSTEMS</li>
              <li>INTERACTIVE STORIES</li>
              <li>STRANGE LITTLE WORLDS</li>
            </ul>
          </div>
          <small>RESEARCHER / BUILDER / THEATRE KID</small>
        </article>

        <article class="about-card">
          <span>03 / CURRENT SIGNAL</span>
          <div>
            <h3>CURRENTLY<br />WORKING ON...</h3>
            <div class="about-card__details">
              <p><b>RESEARCH</b><br />HUMAN–LLM DISAGREEMENT</p>
              <p><b>GAME</b><br />AFTER HOURS: MUSEUM SHIFT</p>
              <p><b>VISION</b><br />JEWELRY SKU CLASSIFIER</p>
              <p><b>BASED IN</b><br />CHAMPAIGN, ILLINOIS</p>
            </div>
          </div>
          <small>THE NEXT PROJECT IS ALREADY FORMING.</small>
        </article>
      </div>
    </div>
  </section>
</template>
