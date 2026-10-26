<script setup>
import torqueLogo from '../assets/logo_marca/torque-performance-logo-fondo-oscuro.png'
</script>

<template>
<footer>
  <a class="footer-logo" href="#inicio" aria-label="Torque Performance, volver al inicio">
    <img :src="torqueLogo" alt="Torque Performance">
  </a>
  <p>Proyecto realizado por Jose Vicente Vanacloig, estudiante de 2.º de Mantenimiento de Vehículos de FP en el IES Politècnic de Castelló, en colaboración con Jaume Vanacloig, programador de este software. Taller ficticio; los datos deben contrastarse con fabricantes.</p>
</footer>
</template>

<style scoped>
.footer-logo{display:block;width:min(100%,420px);margin-bottom:24px;padding:12px;background:#10151c}
.footer-logo img{display:block;width:100%;height:auto}
footer p{max-width:90ch;margin:0}
</style>
