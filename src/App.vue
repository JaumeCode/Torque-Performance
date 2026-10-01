<script setup>
import { onMounted } from 'vue'
import gsap from 'gsap'
import NavBar from './components/NavBar.vue'
import HeroClutch from './components/HeroClutch.vue'
import MarketSection from './components/MarketSection.vue'
import ClutchLab from './components/ClutchLab.vue'
import CaseStudy from './components/CaseStudy.vue'
import ShopSection from './components/ShopSection.vue'
import CompanySection from './components/CompanySection.vue'
import TechSection from './components/TechSection.vue'
import WorkshopSection from './components/WorkshopSection.vue'
import BudgetSection from './components/BudgetSection.vue'
import ClosingSection from './components/ClosingSection.vue'
import ProjectSection from './components/ProjectSection.vue'
import AppFooter from './components/AppFooter.vue'

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return
  gsap.utils.toArray('.grid>div,.cmp>div,.steps li,.prod').forEach(el => {
    gsap.from(el, { opacity: 0, y: 24, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } })
  })
})
</script>

<template>
  <NavBar />
  <HeroClutch />
  <main class="wrap">
    <MarketSection />
    <ClutchLab />
    <CaseStudy />
    <ShopSection />
    <CompanySection />
    <TechSection />
    <WorkshopSection />
    <BudgetSection />
    <ClosingSection />
    <ProjectSection />
    <AppFooter />
  </main>
</template>
