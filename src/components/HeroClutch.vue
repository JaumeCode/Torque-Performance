<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
const stage = ref(null)
onMounted(() => {
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches
  const parts = gsap.utils.toArray('.part')
  if (reduce) { parts.forEach(p => gsap.set(p, { x: +p.dataset.x })); return }
  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, scrollTrigger: { trigger: stage.value, start: 'top top', end: () => `+=${Math.round(window.innerHeight * (window.innerWidth <= 860 ? 1.1 : 1.8))}`, scrub: 0.8, pin: true, invalidateOnRefresh: true } })
  parts.forEach(p => {
    tl.to(p, { x: +p.dataset.x, duration: 1 }, 0)
    tl.fromTo(p.querySelector('.lb'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.6)
  })
  gsap.from('.stage h1', { yPercent: 40, opacity: 0, duration: 1.2, ease: 'expo.out' })
})
</script>

<template>
<header class="stage" ref="stage">
  <div class="txt">
    <h1>Torque<br>Performance</h1>
    <p>Taller especializado en embragues reforzados y transmisión para vehículos con más par del que salió de fábrica.</p>
  </div>
  <div class="hint">Desplázate para despiezar<br>el conjunto de embrague</div>
  <svg viewBox="0 0 1000 380" preserveAspectRatio="xMidYMid meet" aria-label="Vista despiezada de un embrague">
    <line x1="40" y1="190" x2="960" y2="190" stroke="var(--steel)" stroke-dasharray="10 6" stroke-width="1.5"/>
    <g class="part" data-x="-170"><rect x="150" y="60" width="64" height="260" fill="var(--steel)"/><rect x="214" y="110" width="14" height="160" fill="var(--steel2)"/><circle cx="182" cy="190" r="22" fill="var(--bg)"/><text class="lb" x="182" y="356">Volante motor</text></g>
    <g class="part" data-x="-70"><rect x="300" y="72" width="8" height="236" fill="var(--amber)"/><rect x="308" y="76" width="6" height="228" fill="var(--steel2)"/><rect x="314" y="72" width="8" height="236" fill="var(--amber)"/><rect x="290" y="150" width="46" height="80" fill="var(--steel)"/><text class="lb" x="314" y="356">Disco de fricción</text></g>
    <g class="part" data-x="20"><rect x="380" y="68" width="34" height="244" fill="var(--steel)"/><rect x="368" y="130" width="12" height="120" fill="var(--steel2)"/><text class="lb" x="392" y="356">Plato de presión</text></g>
    <g class="part" data-x="110"><polygon points="460,80 500,190 460,300 476,300 516,190 476,80" fill="var(--ink)"/><text class="lb" x="488" y="356">Diafragma</text></g>
    <g class="part" data-x="200"><path d="M540 50 H580 V90 H556 V290 H580 V330 H540 Z" fill="var(--steel)"/><text class="lb" x="560" y="356">Carcasa</text></g>
    <g class="part" data-x="290"><rect x="620" y="152" width="44" height="76" fill="var(--red)"/><rect x="664" y="168" width="52" height="44" fill="var(--steel2)"/><text class="lb" x="650" y="356">Cojinete</text></g>
  </svg>
</header>
</template>
