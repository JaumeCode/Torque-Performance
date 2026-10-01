<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { useClutch } from '../composables/useClutch.js'
const { pedal, mu, F, D, d, engine, preset, rm, cap, sf, slip, setP } = useClutch()
const fly = ref(null), disc = ref(null)
let tick
onMounted(() => {
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches
  gsap.set([fly.value, disc.value], { transformOrigin: '200px 200px' })
  let a = 0, b = 0
  const spd = reduce ? 0 : 5
  tick = () => {
    a += spd; b += spd * (1 - pedal.value / 100)
    gsap.set(fly.value, { rotation: a })
    gsap.set(disc.value, { rotation: pedal.value >= 100 ? b : (slip.value ? b * 0.4 + a * 0.6 : b) })
  }
  gsap.ticker.add(tick)
})
onBeforeUnmount(() => gsap.ticker.remove(tick))
</script>

<template>
<section class="s" id="lab">
  <h2>Laboratorio de par</h2>
  <p class="lead">Pisa el pedal y observa cómo el disco pierde velocidad respecto al volante. Después, ajusta el conjunto y comprueba si transmite el par del motor.</p>
  <div class="lab">
    <div class="panel">
      <svg class="rot" viewBox="0 0 400 400" aria-label="Vista frontal del embrague girando">
        <g ref="fly"><circle cx="200" cy="200" r="190" fill="var(--steel2)"/><circle cx="200" cy="200" r="190" fill="none" stroke="var(--steel)" stroke-width="6" stroke-dasharray="3 9"/></g>
        <g ref="disc">
          <circle cx="200" cy="200" r="150" :fill="slip?'var(--red)':'var(--amber)'" style="transition:fill .3s"/>
          <circle cx="200" cy="200" r="100" fill="var(--steel)"/>
          <g v-for="a in 6" :key="a" :transform="`rotate(${a*60} 200 200)`"><rect x="190" y="96" width="20" height="48" rx="4" fill="var(--ink)" opacity=".85"/></g>
          <circle cx="200" cy="200" r="34" fill="var(--bg)"/><circle cx="200" cy="200" r="16" fill="var(--ink)"/>
        </g>
      </svg>
      <label>Pedal de embrague <span>{{pedal===0?'Suelto (transmite)':pedal===100?'A fondo (desacopla)':pedal+' %'}}</span></label>
      <input type="range" min="0" max="100" v-model.number="pedal" aria-label="Pedal">
    </div>
    <div class="panel">
      <div class="presets">
        <button :class="{on:preset==='o'}" @click="setP('o')">Embrague original</button>
        <button :class="{on:preset==='r'}" @click="setP('r')">Embrague reforzado</button>
      </div>
      <p class="eq">T = μ · F · n · Rm</p>
      <label>Coeficiente de fricción μ <span>{{mu.toFixed(2)}}</span></label><input type="range" min=".2" max=".5" step=".01" v-model.number="mu" @input="preset=''">
      <label>Fuerza de apriete F <span>{{F}} N</span></label><input type="range" min="3000" max="12000" step="50" v-model.number="F" @input="preset=''">
      <label>Diámetro exterior <span>{{D}} mm</span></label><input type="range" min="190" max="280" step="1" v-model.number="D" @input="preset=''">
      <label>Diámetro interior <span>{{d}} mm</span></label><input type="range" min="110" max="180" step="1" v-model.number="d" @input="preset=''">
      <label>Par del motor tras reprogramar <span>{{engine}} Nm</span></label><input type="range" min="250" max="600" step="5" v-model.number="engine">
      <div class="res"><span class="big">{{Math.round(cap)}} Nm</span><span style="color:var(--mute)">capacidad · 2 caras de fricción · Rm {{(rm*1000).toFixed(0)}} mm</span></div>
      <div class="bar"><i :style="{width:Math.min(100,cap/700*100)+'%',background:slip?'var(--red)':'var(--ok)'}"></i><u :style="{left:engine/700*100+'%'}"></u></div>
      <div class="verd" :style="{color:slip?'var(--red)':'var(--ok)'}">{{slip?'Patina: la capacidad no llega al par del motor.':'Margen de seguridad ×'+sf.toFixed(2)+(sf<1.2?' (justo, se recomienda ≥ 1,2)':'')}}</div>
    </div>
  </div>
</section>
</template>
