<script setup>
import { ref, computed } from 'vue'
const hMO = ref(6), tarifa = ref(45)
const eur = n => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
// Precios de piezas reales (IVA 19 % incluido en origen) + hipótesis de mano de obra
const lineas = computed(() => [
  { c: 'Kit SACHS Performance 999698.999954', v: 665.09 / 1.19, real: true },
  { c: 'Cojinete de desembrague ZF SACHS', v: 81.5 / 1.19, real: true },
  { c: 'Mano de obra (' + hMO.value + ' h)', v: hMO.value * tarifa.value, real: false },
  { c: 'Consumibles', v: 20, real: false }
])
const base = computed(() => lineas.value.reduce((a, l) => a + l.v, 0))
</script>

<template>
<section class="s" id="presupuesto">
  <h2>Presupuesto de ejemplo</h2>
  <p class="lead">Kit SACHS Performance 999698.999954 y cojinete ZF SACHS. Las piezas llevan precio real y el resto son hipótesis que puedes cambiar.</p>
  <div class="panel" style="margin-top:28px">
    <label style="margin-top:0">Horas de mano de obra <span>{{hMO}} h</span></label><input type="range" min="3" max="10" step=".5" v-model.number="hMO">
    <label>Tarifa por hora <span>{{tarifa}} €</span></label><input type="range" min="30" max="70" step="1" v-model.number="tarifa">
    <table>
      <tr><th>Concepto</th><th>Tipo</th><th class="r">Sin IVA</th></tr>
      <tr v-for="l in lineas" :key="l.c"><td>{{l.c}}</td><td><span class="chip" :class="l.real?'c-real':'c-hip'">{{l.real?'Dato real':'Hipótesis'}}</span></td><td>{{eur(l.v)}}</td></tr>
      <tr><td>Base imponible</td><td></td><td>{{eur(base)}}</td></tr>
      <tr><td>IVA 21 %</td><td></td><td>{{eur(base*.21)}}</td></tr>
    </table>
    <div class="res"><span class="big">{{eur(base*1.21)}}</span><span style="color:var(--mute)">precio final para el cliente</span></div>
  </div>
  <p style="color:var(--mute);font-size:14px;margin-top:14px;max-width:80ch">Los precios de las piezas (665,09 € y 81,50 €) son los de la tienda SACHS Performance, publicados con IVA del 19 %; aquí se les quita ese IVA y se aplica el 21 % español para llegar al precio final.</p>
</section>
</template>
