<script setup>
import { ref } from 'vue'
import torqueLogo from '../assets/logo_marca/torque-performance-logo-fondo-oscuro.png'

const menuOpen = ref(false)
</script>

<template>
<nav @keydown.esc="menuOpen = false">
  <a class="nav-brand" href="#inicio" aria-label="Torque Performance, inicio" @click="menuOpen = false">
    <img :src="torqueLogo" alt="Torque Performance">
  </a>
  <button
    class="nav-toggle"
    type="button"
    aria-controls="primary-navigation"
    :aria-expanded="menuOpen"
    :aria-label="menuOpen ? 'Cerrar menú' : 'Abrir menú'"
    @click="menuOpen = !menuOpen"
  >
    <span></span><span></span><span></span>
  </button>
  <div id="primary-navigation" class="nav-links" :class="{ 'is-open': menuOpen }">
    <a href="#mercado" @click="menuOpen = false">Taller</a>
    <a href="#lab" @click="menuOpen = false">Laboratorio</a>
    <a href="#caso" @click="menuOpen = false">Caso práctico</a>
    <a href="#tienda" @click="menuOpen = false">Tienda</a>
    <a href="#frenada" @click="menuOpen = false">Frenada</a>
    <a href="#fundamento" @click="menuOpen = false">Fundamento</a>
    <a href="#presupuesto" @click="menuOpen = false">Presupuesto</a>
    <a href="#proyecto" @click="menuOpen = false">Proyecto</a>
  </div>
</nav>
</template>
