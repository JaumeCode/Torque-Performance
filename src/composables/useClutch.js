import { reactive, computed, toRefs } from 'vue'

// Estado compartido entre el laboratorio, la tienda y el fundamento técnico
const st = reactive({ pedal: 0, mu: 0.3, F: 5833, D: 240, d: 160, engine: 420, preset: 'o' })
const rm = computed(() => (st.D + st.d) / 4000)          // radio medio (m)
const cap = computed(() => st.mu * st.F * 2 * rm.value)  // T = μ · F · n · Rm
const sf = computed(() => cap.value / st.engine)         // margen de seguridad
const slip = computed(() => sf.value < 1)

const setP = (k) => {
  st.preset = k
  Object.assign(st, k === 'o' ? { mu: 0.3, F: 5833, D: 240, d: 160 } : { mu: 0.38, F: 6579, D: 240, d: 160 })
}
const simular = (p) => {
  st.mu = 0.38; st.D = 240; st.d = 160
  st.F = Math.round(p.nm / (st.mu * 2 * 0.1) / 10) * 10
  st.preset = ''
  document.getElementById('lab')?.scrollIntoView({ behavior: 'smooth' })
}

export function useClutch() {
  return { ...toRefs(st), rm, cap, sf, slip, setP, simular }
}
