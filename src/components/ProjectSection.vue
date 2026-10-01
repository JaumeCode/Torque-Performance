<script setup>
import { APARTADOS as apartados } from '../data/contenido.js'
</script>

<template>
<section class="s" id="proyecto">
  <h2>Estructura del proyecto intermodular</h2>
  <p class="lead">Cada apartado integra contenidos de varios módulos del ciclo y explica las decisiones técnicas, no solo las enumera.</p>
  <ol class="steps">
    <li v-for="p in apartados" :key="p[0]"><div><b>{{p[0]}}</b><span>{{p[1]}}</span></div></li>
  </ol>
</section>
</template>
