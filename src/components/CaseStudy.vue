<script setup>
import { TABLA as tabla } from '../data/contenido.js'
</script>

<template>
<section class="s" id="caso">
  <h2>Caso práctico: patinamiento bajo carga</h2>
  <p class="lead">Un turbodiésel de 150 CV se reprograma y sube a 190 CV. El embrague original empieza a patinar en aceleración fuerte.</p>
  <div class="cmp">
    <div><span>Antes</span><b>320 Nm</b>150 CV · embrague original 350 Nm</div>
    <div><span>Después</span><b>420 Nm</b>190 CV · el original patina</div>
    <div><span>Solución</span><b>500 Nm</b>embrague reforzado · margen ×1,19</div>
  </div>
  <table>
    <tr><th>Parámetro</th><th>Valor de ejemplo</th></tr>
    <tr v-for="r in tabla" :key="r[0]"><td>{{r[0]}}</td><td>{{r[1]}}</td></tr>
  </table>
  <p style="color:var(--mute);font-size:14px;margin-top:14px">Valores de ejemplo académico. Con un vehículo concreto se sustituyen por datos reales del fabricante.</p>
</section>
</template>
