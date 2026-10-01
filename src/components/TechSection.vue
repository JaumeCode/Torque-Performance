<script setup>
import { computed } from 'vue'
import { useClutch } from '../composables/useClutch.js'
const { mu, F, D, d, cap } = useClutch()
// Efecto teórico de cada factor sobre la capacidad de par
const sens = computed(() => {
  const c = cap.value
  return [
    { n: 'Coeficiente de fricción μ +10 %', v: c * 0.1 },
    { n: 'Fuerza de apriete F +10 %', v: c * 0.1 },
    { n: 'Diámetro exterior +10 %', v: mu.value * F.value * 2 * ((D.value * 1.1 + d.value) / 4000) - c },
    { n: 'Superficies de fricción de 2 a 4 (multidisco)', v: c }
  ]
})
</script>

<template>
<section class="s" id="fundamento">
  <h2>Fundamento técnico del embrague</h2>
  <p class="lead">El embrague transmite el par del motor a la caja por rozamiento. El plato de presión aprieta el disco contra el volante, y mientras la fricción supere el par del motor no hay deslizamiento. <span class="chip c-ej">Teoría</span></p>
  <div class="grid">
    <div><h3>Orgánico</h3><p>Progresivo y cómodo, con tacto parecido al original. Es el material de los kits de uso diario de la tienda.</p></div>
    <div><h3>Sinterizado (metálico)</h3><p>Mayor coeficiente de fricción y más resistencia térmica, pero acopla de forma más brusca. Va mejor en circuito que en ciudad.</p></div>
    <div><h3>Causas del patinamiento</h3><p>Par superior a la capacidad, forro desgastado, aceite en el forro, plato de presión fatigado o muelle diafragma debilitado.</p></div>
  </div>
  <p class="lead" style="margin-top:36px">Cuánto cambia la capacidad con cada factor, partiendo del embrague configurado en el laboratorio de par. <span class="chip c-ej">Modelo teórico</span></p>
  <table>
    <tr><th>Cambio</th><th class="r">Efecto sobre la capacidad</th></tr>
    <tr v-for="r in sens" :key="r.n"><td>{{r.n}}</td><td>+{{Math.round(r.v)}} Nm</td></tr>
  </table>
  <p style="color:var(--mute);font-size:14px;margin-top:14px">Contrasta siempre el modelo con el dato que publica el fabricante del kit.</p>
</section>

<section class="s" id="ev">
  <h2>Eléctrico frente a combustión e híbrido</h2>
  <p class="lead">Por eso Torque Performance no trabaja con eléctricos puros: en general no llevan embrague de fricción. <span class="chip c-ej">Teoría</span></p>
  <table>
    <tr><th>Tipo</th><th>Cadena de transmisión</th><th>¿Embrague de fricción?</th></tr>
    <tr><td>Combustión</td><td>Motor, volante, embrague, caja manual de varias marchas</td><td>Sí</td></tr>
    <tr><td>Híbrido</td><td>Depende de la arquitectura; algunos llevan embrague entre el motor térmico y el eléctrico o en la caja</td><td>En algunos</td></tr>
    <tr><td>Eléctrico puro</td><td>Motor eléctrico y reductor, normalmente de una relación</td><td>Normalmente no</td></tr>
  </table>
</section>
</template>
