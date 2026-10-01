<script setup>
import { ref, computed } from 'vue'
import { PRODUCTOS } from '../data/productos.js'
import { MOTORES as motores } from '../data/motores.js'
import { useClutch } from '../composables/useClutch.js'
import sachsKit from '../assets/de-kupplung-performance-kupplung-sachs-kupplungssatz-999715-999961-removebg-preview.png'
import apRacing from '../assets/AP_Racing_lug_assy-removebg-preview.png'
import apRacingCp7382 from '../assets/Twin (2) Plate - CP7382 Family..png'
import apRacingCp8732 from '../assets/Twin Plate - Paddle Type - CP8732.png'
import southBendDaily from '../assets/K70641-HD-O_1-removebg-preview.png'
import southBendEndurance from '../assets/south-bend-clutch-vw-mk5-mk6-tdi-stage-2-endurance-kit-k70657f-hd-oce_1_1024x1024.jpg-removebg-preview.png'
import genericClutch from '../assets/3090fd9e8ee2f9229be1324c3c685cfa.jpg-removebg-preview.png'
import exedyKit from '../assets/sachs-racing-clutch-kit-audi-ttrs-25tfsi-034-502-0016-1_2_1-removebg-preview.png'
import rcs140Twin from '../assets/de-rennsportkupplung-sachs-rcs-rcs140-rennsportkupplung-rcs2-140-h-s2-6-s-xx-removebg-preview.png'
import rcs140Triple from '../assets/de-rennsportkupplung-sachs-rcs-rcs140-rennsportkupplung-rcs3-140-h-s3-4-x-xx_1-removebg-preview.png'
import rcs184Single from '../assets/de-rennsportkupplung-sachs-rcs-rcs184-rennsportkupplung-rcs1-184-n-s2-6-s-49-removebg-preview.png'
import rcs184Triple from '../assets/de-rennsportkupplung-sachs-rcs-rcs184-rennsportkupplung-rcs3-184-n-s2-6-s-49_2-removebg-preview.png'
import pressurePlate from '../assets/br1079_2048x2048.jpg-removebg-preview.png'
const { engine, simular } = useClutch()
const mat = ref(''), sort = ref('up'), mot = ref(''), uso = ref(''), todos = ref(false)
const LIM = 9 // kits visibles antes de pulsar "Ver más"
const isComp = p => /^(RCS|CP)/.test(p.ref)
const imagenes = {
  '999715.999961': sachsKit,
  '999698.999954': sachsKit,
  '002352.999502': genericClutch,
  'K70468-HD-O': southBendDaily,
  'DXD Stage 2 Endurance': southBendEndurance,
  'SPC-001422.999505B': pressurePlate,
  'RCS1_184-N-S2.6-S-49': rcs184Single,
  'RCS2_184-N-S2.6-S-49': rcs140Twin,
  'RCS2_184-H-O7.8-S-4X': rcs140Twin,
  'RCS3_184-N-S2.6-S-49': rcs184Triple,
  EXE15951HD: exedyKit,
  'CP7372-NE90-SF': apRacing,
  CP2606ORA: apRacing,
  'CP8732-OH81-SF': apRacingCp8732,
  'CP7382-CH80-SF': apRacingCp7382,
  'RCS1_184-H-S7.8-S-4X': rcs184Single,
  'RCS 2/140': rcs140Twin,
  'RCS 3/140': rcs140Triple
}
const imagen = p => imagenes[p.ref] || genericClutch
const productos = computed(() => PRODUCTOS
  .filter(p => (!mat.value || p.mat === mat.value) && (!uso.value || (uso.value === 'comp') === isComp(p)))
  .sort((a, b) => sort.value === 'up' ? a.nm - b.nm : b.nm - a.nm))
const visibles = computed(() => todos.value ? productos.value : productos.value.slice(0, LIM))
const tag = p => {
  const f = p.nm / engine.value
  return f >= 1.2 ? { t: 'Margen ×' + f.toFixed(2) + ' · suficiente', c: 'var(--ok)' }
    : f >= 1 ? { t: 'Margen ×' + f.toFixed(2) + ' · justo', c: 'var(--amber)' }
    : { t: 'No llega a ' + engine.value + ' Nm', c: 'var(--red)' }
}
const setMot = () => { if (mot.value !== '') engine.value = motores[mot.value].nm }
</script>

<template>
<section class="s" id="tienda">
  <h2>Tienda: embragues reforzados reales</h2>
  <p class="lead">Kits de SACHS Performance y South Bend Clutch con la capacidad de par que publican. Indica el par de tu motor y la tienda marca cuáles dan margen suficiente.</p>
  <div class="tools">
    <div><label style="margin-top:0">Par del motor <span>{{engine}} Nm</span></label><input type="range" min="250" max="600" step="5" v-model.number="engine" aria-label="Par del motor"></div>
    <div><label style="margin-top:0">Motorización</label><select v-model="mot" @change="setMot"><option value="">Personalizado</option><option v-for="(m,i) in motores" :key="i" :value="i">{{m.n}} · {{m.nm}} Nm</option></select></div>
    <div><label style="margin-top:0">Uso</label><select v-model="uso"><option value="">Todos</option><option value="calle">Calle</option><option value="comp">Competición</option></select></div>
    <div><label style="margin-top:0">Material de fricción</label><select v-model="mat"><option value="">Todos</option><option>Orgánico</option><option>Sinterizado</option><option>Cerametálico</option></select></div>
    <div><label style="margin-top:0">Ordenar</label><select v-model="sort"><option value="up">Menor a mayor capacidad</option><option value="down">Mayor a menor capacidad</option></select></div>
  </div>
  <div class="shop">
    <article class="prod" v-for="p in visibles" :key="p.ref">
      <header>
        <img :src="imagen(p)" :alt="p.nombre" class="disc">
        <div><small>{{p.marca}}</small><h3>{{p.nombre}}</h3></div>
      </header>
      <div class="nm">{{p.nm}} Nm<small style="font-size:14px;font-weight:500;font-stretch:100%"> {{p.aprox?'≈ '+p.dato:'o más'}}</small></div>
      <div class="price" v-if="p.precio">{{p.precio}} <small>{{p.pvp?'PVP rec. '+p.pvp+' · ':''}}IVA incl.</small></div>
      <div class="price" v-else><small>Precio: consultar distribuidor</small></div>
      <span class="chip c-hip" v-if="isComp(p)">Competición</span><span class="tag" :style="{color:tag(p).c}">{{tag(p).t}}</span>
      <ul class="spec">
        <li>Material<b>{{p.mat}}</b></li>
        <li>Referencia<b>{{p.ref}}</b></li>
        <li v-for="e in p.extra" :key="e[0]">{{e[0]}}<b>{{e[1]}}</b></li>
      </ul>
      <p style="margin:0;font-size:14px;color:var(--mute)">{{p.uso}}</p>
      <div class="row"><button @click="simular(p)">Simular en el laboratorio</button><a :href="p.url" target="_blank" rel="noopener">Ficha del fabricante</a></div>
    </article>
    <p v-if="!productos.length" style="color:var(--mute)">Ningún kit coincide con esos filtros.</p>
  </div>
  <div style="text-align:center;margin-top:28px" v-if="productos.length>LIM"><button @click="todos=!todos">{{todos?'Ver menos':'Ver más kits ('+(productos.length-LIM)+' más)'}}</button></div>
  <p style="color:var(--mute);font-size:14px;margin-top:18px;max-width:80ch">Los kits Racing RCS de SACHS y el Exedy son de competición o para modelos concretos: comprueba la referencia y el volante de tu coche. Los conjuntos AP Racing se venden sin discos y hay que elegir los discos según el estriado de tu caja. Datos consultados en las fichas de SACHS Performance, AP Racing y en distribuidores de South Bend Clutch. Los valores en ft-lb se han convertido a Nm (×1,356) y los de South Bend son valores nominales del fabricante, no medidos aquí. Antes de montar, confirma la compatibilidad con la referencia OE de tu vehículo. Precios reales solo donde los publica el fabricante en su tienda española (SACHS Performance, IVA incluido, sin envío; el cojinete de desembrague ZF SACHS compatible cuesta 81,50 €); en el resto, consulta al distribuidor. Pares de las motorizaciones según fichas técnicas de zeperfs, auto-data, encyCARpedia, ultimatespecs, fastestlaps y el catálogo de Honda España. El 2.0 TDI de 150 CV pasó de 320 a 340 Nm en 2017, y el Focus RS entrega 440 Nm continuos con hasta 470 Nm puntuales por sobrealimentación transitoria.</p>
</section>
</template>
