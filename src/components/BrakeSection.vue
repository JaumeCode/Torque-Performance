<script setup>
import { computed, reactive, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import torqueMark from '../assets/logo_marca/torque-performance-icono-fondo-oscuro.png'

/* ---------- Productos (catálogo orientativo con enlaces a fabricante) ---------- */
const products = [
  { brand: 'Brembo', name: 'GT · kit de freno', type: 'Kits', use: 'Calle y circuito', description: 'Conjunto delantero con pinzas, discos, pastillas y latiguillos. Aplicación específica por vehículo.', url: 'https://www.brembo.com/en/solutions/for-your-car/gran-turismo-brake-kits' },
  { brand: 'EBC Brakes', name: 'Yellowstuff · pastillas', type: 'Pastillas', use: 'Calle y circuito', description: 'Compuesto de alto rendimiento para conducción exigente. Comprueba la aplicación y el compuesto exactos.', url: 'https://www.ebcbrakes.com/products/yellowstuff-brake-pads/' },
  { brand: 'Brembo', name: 'Disco de freno ventilado', type: 'Discos', use: 'Calle', description: 'Recambio de disco para aplicaciones concretas. Diámetro, espesor y campana dependen del vehículo.', url: 'https://www.bremboparts.com/europe/en/catalogue' },
  { brand: 'Goodridge', name: 'Latiguillos de freno mallados', type: 'Latiguillos', use: 'Calle y circuito', description: 'Líneas de freno de sustitución. Verifica longitud, terminales y homologación para tu modelo.', url: 'https://www.goodridge.co.uk/collections/brake-hose-kits' },
  { brand: 'Motul', name: 'RBF 600 Factory Line · líquido', type: 'Líquidos', use: 'Circuito', description: 'Líquido de frenos para uso exigente. Respeta la especificación del fabricante y el intervalo de cambio.', url: 'https://www.motul.com/en/products/rbf-600-factory-line' },
  { brand: 'Ferodo', name: 'DS Performance · pastillas', type: 'Pastillas', use: 'Calle', description: 'Pastilla de alto rendimiento para uso en carretera. Consulta la referencia compatible con tu vehículo.', url: 'https://www.ferodo.com/en-gb/products/passenger-car/brake-pads.html' },
  { brand: 'AP Racing', name: 'Radi-CAL · kit de freno', type: 'Kits', use: 'Circuito', description: 'Sistema de pinza y disco para aplicaciones de competición. Selección y montaje por especialista.', url: 'https://apracing.com/race-car/brake-calipers' }
]
const category = ref('')
const use = ref('')
const filteredProducts = computed(() => products.filter(pr =>
  (!category.value || pr.type === category.value) &&
  (!use.value || pr.use.includes(use.value))
))

/* ---------- Laboratorio ---------- */
const PRESETS = {
  utilitario: { label: 'Utilitario', speed: 100, mass: 1200, pressure: 35, pistons: 1, pistonD: 54, padMu: 0.35, discR: 100, tireMu: 0.85, tireR: 305, discMass: 5 },
  deportivo:  { label: 'Deportivo',  speed: 100, mass: 1450, pressure: 50, pistons: 2, pistonD: 36, padMu: 0.40, discR: 130, tireMu: 0.95, tireR: 330, discMass: 9 },
  circuito:   { label: 'Circuito',   speed: 160, mass: 1150, pressure: 40, pistons: 2, pistonD: 38, padMu: 0.45, discR: 140, tireMu: 1.15, tireR: 320, discMass: 11 }
}
const p = reactive({ ...PRESETS.deportivo })
const preset = ref('deportivo')
const setPreset = k => { preset.value = k; Object.assign(p, PRESETS[k]) }

const G = 9.81            // m/s²
const CP_DISC = 460       // J/(kg·K), fundición gris
const FRONT_BIAS = 0.7    // parte de la energía que absorbe el eje delantero
const DISC_EFF = 0.5      // fracción de la masa del disco que participa en el calentamiento

const v0 = computed(() => p.speed / 3.6)                                          // m/s
const pistonArea = computed(() => p.pistons * Math.PI * (p.pistonD / 2000) ** 2)  // m² por lado de pinza
const clampForce = computed(() => p.pressure * 1e5 * pistonArea.value)            // N por pastilla
const wheelTorque = computed(() => 2 * p.padMu * clampForce.value * (p.discR / 1000)) // Nm por rueda
const brakeTorque = computed(() => 4 * wheelTorque.value)                         // Nm, cuatro ruedas iguales
const brakeDecel = computed(() => brakeTorque.value / (p.tireR / 1000) / p.mass)  // m/s² que da el freno
const gripDecel = computed(() => p.tireMu * G)                                    // m/s² que da el neumático
const decel = computed(() => Math.min(brakeDecel.value, gripDecel.value))
const distance = computed(() => v0.value ** 2 / (2 * decel.value))
const stoppingTime = computed(() => v0.value / decel.value)
const brakeForce = computed(() => p.mass * decel.value)                           // N
const energy = computed(() => 0.5 * p.mass * v0.value ** 2)                       // J
const peakPower = computed(() => brakeForce.value * v0.value)                     // W
const tempRise = computed(() => FRONT_BIAS * energy.value / 2 / (DISC_EFF * p.discMass * CP_DISC))
const wheelRpm = computed(() => v0.value / (p.tireR / 1000) * 60 / (2 * Math.PI))
const limitRatio = computed(() => brakeDecel.value / gripDecel.value)
const torqueLimited = computed(() => limitRatio.value < 1)

const fmt = (n, d = 1) => n.toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d })
const results = computed(() => [
  { l: 'Distancia de frenado', v: fmt(distance.value) + ' m' },
  { l: 'Tiempo de frenado', v: fmt(stoppingTime.value, 2) + ' s' },
  { l: 'Desaceleración', v: fmt(decel.value, 2) + ' m/s² · ' + fmt(decel.value / G, 2) + ' g' },
  { l: 'Fuerza de frenado', v: fmt(brakeForce.value / 1000) + ' kN' },
  { l: 'Par de freno disponible', v: Math.round(brakeTorque.value).toLocaleString('es-ES') + ' Nm' },
  { l: 'Energía cinética', v: fmt(energy.value / 1000, 0) + ' kJ' },
  { l: 'Potencia pico de frenado', v: fmt(peakPower.value / 1000, 0) + ' kW' },
  { l: 'Subida de temperatura del disco', v: '+' + fmt(tempRise.value, 0) + ' K' },
  { l: 'Giro de la rueda al inicio', v: Math.round(wheelRpm.value).toLocaleString('es-ES') + ' rpm' },
  { l: 'Freno frente a adherencia', v: Math.round(limitRatio.value * 100) + ' %' }
])

/* ---------- Animación: el disco gira según la velocidad ---------- */
const sim = reactive({ mode: 'idle', v: 0, d: 0, t: 0 }) // idle | braking | stopped
const rotorEl = ref(null)
const heatEl = ref(null)
const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion:reduce)').matches
const VIS = reduce ? 0.015 : 0.07 // la velocidad de giro se escala para que se pueda ver
let raf = 0, last = 0, angle = 0, omega = 0, heat = 0

const startBraking = () => { Object.assign(sim, { mode: 'braking', v: v0.value, d: 0, t: 0 }) }
const rollAgain = () => { sim.mode = 'idle' }

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000)
  last = now
  if (sim.mode === 'braking') {
    sim.t += dt
    sim.d += sim.v * dt - 0.5 * decel.value * dt * dt
    sim.v = Math.max(0, sim.v - decel.value * dt)
    if (sim.v <= 0) Object.assign(sim, { mode: 'stopped', v: 0, d: distance.value, t: stoppingTime.value })
  }
  const target = sim.mode === 'braking' ? sim.v : sim.mode === 'stopped' ? 0 : v0.value
  const w = target / (p.tireR / 1000) // rad/s reales
  omega += (w - omega) * (1 - Math.exp(-dt * (sim.mode === 'braking' ? 30 : 5)))
  angle = (angle + omega * VIS * (180 / Math.PI) * dt) % 360
  rotorEl.value?.setAttribute('transform', `rotate(${angle.toFixed(2)} 200 200)`)
  if (sim.mode === 'braking') heat = Math.min(1, tempRise.value * (1 - (sim.v / v0.value) ** 2) / 200)
  else heat *= Math.exp(-dt * (sim.mode === 'stopped' ? 0.15 : 0.6))
  heatEl.value?.setAttribute('opacity', (heat * 0.75).toFixed(3))
  raf = requestAnimationFrame(frame)
}
onMounted(() => { last = performance.now(); raf = requestAnimationFrame(frame) })
onBeforeUnmount(() => cancelAnimationFrame(raf))
// Si cambias un parámetro, la simulación vuelve a empezar desde cero.
watch(p, () => { if (sim.mode !== 'idle') sim.mode = 'idle' }, { deep: true })
</script>

<template>
  <section class="s brake-section" id="frenada">
    <div class="brake-title">
      <span class="brake-brand-mark" aria-hidden="true"><img :src="torqueMark" alt=""></span>
      <h2>Frenada: del pedal al asfalto</h2>
    </div>
    <p class="lead">Dimensiona discos, pinzas y pastillas y comprueba si el freno o el neumático marcan el límite. El disco gira a la velocidad que elijas.</p>

    <div class="brake-lab" id="laboratorio-frenada">
      <div class="panel brake-visual">
        <svg viewBox="0 0 400 400" role="img" aria-label="Disco de freno ventilado girando con su pinza">
          <g ref="rotorEl">
            <circle cx="200" cy="200" r="158" fill="var(--steel2)" stroke="var(--steel)" stroke-width="8" />
            <circle cx="200" cy="200" r="124" fill="var(--card)" stroke="var(--steel)" stroke-width="5" />
            <circle cx="200" cy="200" r="91" fill="var(--steel2)" stroke="var(--steel)" stroke-width="5" />
            <circle cx="200" cy="200" r="46" fill="var(--card)" stroke="var(--steel)" stroke-width="5" />
            <circle ref="heatEl" cx="200" cy="200" r="141" fill="none" stroke="var(--red)" stroke-width="34" opacity="0" />
            <g v-for="hole in 12" :key="hole" :transform="`rotate(${hole * 30} 200 200)`">
              <circle cx="200" cy="81" r="6" fill="var(--bg)" />
              <circle cx="200" cy="142" r="5" fill="var(--bg)" />
            </g>
            <g v-for="bolt in 5" :key="`bolt-${bolt}`" :transform="`rotate(${bolt * 72} 200 200)`">
              <circle cx="200" cy="65" r="4" fill="var(--ink)" />
            </g>
            <circle cx="200" cy="100" r="5" fill="var(--amber)" />
          </g>
          <path d="M286 74h55q19 0 19 20v95q0 20-19 20h-39l-18-20v-95z" fill="var(--red)" stroke="var(--ink)" stroke-width="5" />
          <path d="M286 103h20v78h-20z" fill="var(--amber)" />
          <circle cx="325" cy="115" r="8" fill="var(--card)" />
          <circle cx="325" cy="166" r="8" fill="var(--card)" />
        </svg>
        <div class="brake-visual-caption"><span>Disco ventilado · {{ Math.round(wheelRpm).toLocaleString('es-ES') }} rpm a {{ p.speed }} km/h</span><span>Pinza · pastilla</span></div>
        <div class="sim-readout" aria-hidden="true">
          <div><span>Velocidad</span><strong>{{ fmt(sim.mode === 'idle' ? p.speed : sim.v * 3.6, 0) }} km/h</strong></div>
          <div><span>Recorrido</span><strong>{{ fmt(sim.mode === 'idle' ? 0 : sim.d) }} m</strong></div>
          <div><span>Tiempo</span><strong>{{ fmt(sim.mode === 'idle' ? 0 : sim.t, 2) }} s</strong></div>
        </div>
        <div class="sim-buttons">
          <button type="button" class="on" @click="startBraking">{{ sim.mode === 'braking' ? 'Reiniciar frenada' : 'Simular frenada' }}</button>
          <button type="button" v-if="sim.mode !== 'idle'" @click="rollAgain">Volver a rodar</button>
        </div>
        <p class="brake-note" style="margin-top:12px">El giro en pantalla se muestra al {{ Math.round(VIS * 100) }} % de la velocidad real para poder verlo. Las rpm indicadas son las reales.</p>
      </div>

      <div class="panel">
        <div class="brake-controls-heading"><h3>Parámetros</h3><span>Modelo simplificado</span></div>
        <div class="presets" style="margin-top:12px">
          <button v-for="(pr, k) in PRESETS" :key="k" type="button" :class="{ on: preset === k }" @click="setPreset(k)">{{ pr.label }}</button>
        </div>

        <h4 class="brake-group">Vehículo</h4>
        <label>Velocidad inicial <span>{{ p.speed }} km/h</span></label>
        <input v-model.number="p.speed" type="range" min="30" max="250" step="5" aria-label="Velocidad inicial">
        <label>Masa del vehículo <span>{{ p.mass.toLocaleString('es-ES') }} kg</span></label>
        <input v-model.number="p.mass" type="range" min="800" max="2400" step="25" aria-label="Masa del vehículo">

        <h4 class="brake-group">Sistema de frenos (por rueda)</h4>
        <label>Presión hidráulica <span>{{ p.pressure }} bar</span></label>
        <input v-model.number="p.pressure" type="range" min="10" max="120" step="1" aria-label="Presión hidráulica">
        <label>Pistones por lado de pinza <span>{{ p.pistons }}</span></label>
        <input v-model.number="p.pistons" type="range" min="1" max="6" step="1" aria-label="Pistones por lado">
        <label>Diámetro de cada pistón <span>{{ p.pistonD }} mm</span></label>
        <input v-model.number="p.pistonD" type="range" min="25" max="60" step="1" aria-label="Diámetro de pistón">
        <label>Coeficiente de fricción de pastilla <span>{{ p.padMu.toFixed(2) }}</span></label>
        <input v-model.number="p.padMu" type="range" min="0.2" max="0.65" step="0.01" aria-label="Coeficiente de fricción de pastilla">
        <label>Radio efectivo del disco <span>{{ p.discR }} mm</span></label>
        <input v-model.number="p.discR" type="range" min="80" max="180" step="1" aria-label="Radio efectivo del disco">
        <label>Masa del disco <span>{{ p.discMass }} kg</span></label>
        <input v-model.number="p.discMass" type="range" min="3" max="16" step="0.5" aria-label="Masa del disco">

        <h4 class="brake-group">Neumático</h4>
        <label>Adherencia del neumático <span>μ {{ p.tireMu.toFixed(2) }}</span></label>
        <input v-model.number="p.tireMu" type="range" min="0.3" max="1.3" step="0.01" aria-label="Adherencia del neumático">
        <label>Radio de rueda <span>{{ p.tireR }} mm</span></label>
        <input v-model.number="p.tireR" type="range" min="260" max="380" step="1" aria-label="Radio de rueda">

        <div class="brake-results" aria-live="polite">
          <div v-for="r in results" :key="r.l"><span>{{ r.l }}</span><strong>{{ r.v }}</strong></div>
        </div>
        <div class="bar"><i :style="{ width: Math.min(100, limitRatio / 1.5 * 100) + '%', background: torqueLimited ? 'var(--amber)' : 'var(--ok)' }"></i><u style="left:66.67%"></u></div>
        <p class="brake-verdict" :class="{ limited: torqueLimited }">
          {{ torqueLimited
            ? 'Límite del freno: entrega el ' + Math.round(limitRatio * 100) + ' % de lo que el neumático permitiría. Hay margen de adherencia sin usar.'
            : 'Límite del neumático: el freno supera la adherencia y el ABS regula la presión. La frenada queda en ' + fmt(gripDecel / G, 2) + ' g.' }}
        </p>
      </div>
    </div>
    <p class="brake-note">Modelo idealizado en suelo plano: cuatro ruedas con el mismo freno, desaceleración constante y adherencia constante. La temperatura supone que el eje delantero absorbe el 70 % de la energía, sin refrigeración y con la mitad de la masa del disco participando. No incluye tiempo de reacción, pendiente, resistencia del aire, transferencia de carga ni el desgaste de las pastillas. No sustituye el cálculo ni la revisión de un profesional.</p>

    <div class="brake-shop" id="tienda-frenada">
      <div class="brake-shop-heading">
        <div><h3>Tienda de frenada</h3><p>Referencias de fabricante para kits y componentes. La compatibilidad depende de la versión exacta del vehículo.</p></div>
        <div class="brake-filters">
          <label>Elemento<select v-model="category" aria-label="Filtrar por elemento"><option value="">Todos</option><option>Kits</option><option>Discos</option><option>Pastillas</option><option>Latiguillos</option><option>Líquidos</option></select></label>
          <label>Uso<select v-model="use" aria-label="Filtrar por uso"><option value="">Todos</option><option value="Calle">Calle</option><option value="Circuito">Circuito</option></select></label>
        </div>
      </div>
      <div class="brake-products">
        <article v-for="product in filteredProducts" :key="product.brand + product.name" class="brake-product">
          <div class="brake-product-top"><small>{{ product.brand }}</small><span>{{ product.type }}</span></div>
          <h4>{{ product.name }}</h4>
          <p>{{ product.description }}</p>
          <div class="brake-product-foot"><span>{{ product.use }}</span><a :href="product.url" target="_blank" rel="noopener noreferrer">Ver fabricante ↗</a></div>
        </article>
        <p v-if="!filteredProducts.length" class="brake-empty">No hay componentes para esos filtros.</p>
      </div>
      <p class="brake-note">Catálogo orientativo con enlaces a fabricantes. Antes de comprar, confirma la referencia, homologación y compatibilidad, y consulta el precio y disponibilidad vigentes.</p>
    </div>
  </section>
</template>

<style scoped>
.brake-lab{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:28px;margin-top:36px;align-items:start}
.brake-title{display:flex;align-items:center;gap:18px}
.brake-title h2{margin-bottom:0}
.brake-brand-mark{display:grid;place-items:center;flex:0 0 72px;width:72px;height:72px;padding:4px;border:1px solid var(--line);border-radius:50%;background:#e8eaec}
.brake-brand-mark img{display:block;width:100%;height:100%;object-fit:contain}
.brake-visual{position:sticky;top:90px}
.brake-visual svg{display:block;width:min(100%,400px);margin:0 auto}
.brake-visual-caption{display:flex;justify-content:space-between;gap:12px;padding-top:10px;border-top:1px solid var(--line);font-size:13px;color:var(--mute)}
.sim-readout{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line);margin-top:14px}
.sim-readout div{background:var(--bg);padding:10px 12px;display:flex;flex-direction:column}
.sim-readout span{font-size:12px;color:var(--mute)}
.sim-readout strong{font-size:20px;font-variant-numeric:tabular-nums}
.sim-buttons{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}
.brake-controls-heading{display:flex;align-items:baseline;justify-content:space-between;gap:12px}
.brake-controls-heading h3,.brake-shop-heading h3{margin:0;font-size:23px}
.brake-controls-heading span{font-size:12px;color:var(--mute)}
.brake-group{margin:22px 0 0;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);border-bottom:1px solid var(--line);padding-bottom:4px}
.brake-results{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line);margin-top:24px}
.brake-results div{display:flex;flex-direction:column;gap:2px;background:var(--bg);padding:12px}
.brake-results span{font-size:12px;color:var(--mute)}
.brake-results strong{font-size:18px;font-variant-numeric:tabular-nums}
.brake-verdict{margin:12px 0 0;color:var(--ok);font-weight:700}
.brake-verdict.limited{color:var(--amber)}
.brake-note{max-width:90ch;margin:18px 0 0;color:var(--mute);font-size:13px}
.brake-shop{padding-top:100px;scroll-margin-top:70px}
.brake-shop-heading{display:flex;justify-content:space-between;align-items:end;gap:24px;border-bottom:1px solid var(--line);padding-bottom:20px}
.brake-shop-heading p{max-width:54ch;color:var(--mute);margin:8px 0 0}
.brake-filters{display:flex;gap:12px;flex:0 0 auto}
.brake-filters label{margin:0;min-width:150px}
.brake-filters select{font:inherit;width:100%;padding:8px;background:var(--bg);color:var(--ink);border:1.5px solid var(--ink)}
.brake-products{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1px;background:var(--line);border:1px solid var(--line);margin-top:20px}
.brake-product{background:var(--bg);padding:20px;display:flex;flex-direction:column;min-height:200px}
.brake-product-top,.brake-product-foot{display:flex;justify-content:space-between;align-items:center;gap:12px}
.brake-product-top small{font-weight:700;color:var(--mute)}
.brake-product-top span{font-size:12px;color:var(--mute);border:1px solid var(--line);padding:2px 7px}
.brake-product h4{font-size:18px;line-height:1.2;margin:14px 0 6px}
.brake-product p{font-size:14px;color:var(--mute);margin:0 0 20px}
.brake-product-foot{margin-top:auto;font-size:12px;color:var(--mute)}
.brake-product-foot a{font-size:13px;font-weight:700;color:var(--ink);white-space:nowrap}
.brake-empty{grid-column:1/-1;padding:20px;color:var(--mute)}
@media(max-width:860px){.brake-lab{grid-template-columns:minmax(0,1fr)}.brake-visual{position:static}.brake-shop-heading{align-items:stretch;flex-direction:column}.brake-filters{flex-wrap:wrap}.brake-filters label{flex:1;min-width:130px}}
@media(max-width:480px){.brake-title{gap:12px}.brake-brand-mark{flex-basis:56px;width:56px;height:56px;padding:3px}.brake-results{grid-template-columns:minmax(0,1fr)}.brake-results div{flex-direction:row;justify-content:space-between;align-items:baseline}.brake-visual-caption{font-size:12px}.sim-readout strong{font-size:16px}}
</style>