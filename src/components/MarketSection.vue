<script setup>
import { SERVICIOS as servicios } from '../data/contenido.js'
</script>

<template>
<section class="s" id="mercado">
  <h2>El embrague de serie tiene un límite de par</h2>
  <p class="lead">Un motor reprogramado empuja más de lo que el conjunto original puede transmitir. Diagnosticamos el patinamiento, calculamos la capacidad real y montamos el embrague que da margen suficiente.</p>
  <div class="grid">
    <div v-for="s in servicios" :key="s.t"><h3>{{s.t}}</h3><p>{{s.d}}</p></div>
  </div>
  <div class="ev"><h3 style="margin:0">Sobre los vehículos eléctricos</h3><p>Un eléctrico puro normalmente no usa un embrague convencional, así que no lo incluimos como especialidad. Trabajamos con vehículos de combustión, híbridos con embrague y vehículos modificados.</p><p style="color:var(--mute)">El proyecto incluye una comparativa entre la transmisión de un eléctrico y la de un vehículo convencional o híbrido.</p></div>
</section>
</template>
