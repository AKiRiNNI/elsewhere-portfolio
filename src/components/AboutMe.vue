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
          <a href="mailto:Ziyue8@illinois.edu">EMAIL</a>
          <a href="https://github.com/AKiRiNNI" target="_blank" rel="noreferrer">GITHUB</a>
          <a href="https://www.linkedin.com/in/ziyue-lin-749902250" target="_blank" rel="noreferrer">LINKEDIN</a>
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
