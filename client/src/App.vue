<script setup>
import { onMounted, ref } from "vue";

// Baked in at build time: vite.config.js sets envPrefix: ["GREETING_", "VITE_"].
const frontendLine = `frontend: hello world oxzoo-vue-vite_${import.meta.env.GREETING_TAG}`;
const backendLine = ref("loading");
const backendError = ref("");

onMounted(async () => {
  try {
    const res = await fetch("/api/greeting");
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    backendLine.value = await res.text();
  } catch (err) {
    backendError.value = `backend error: ${err.message}`;
  }
});
</script>

<template>
  <main>
    <h1>oxzoo-vue-vite</h1>
    <p>{{ frontendLine }}</p>
    <p v-if="backendError">{{ backendError }}</p>
    <p v-else>backend: {{ backendLine }}</p>
  </main>
</template>

<style>
body {
  font-family: system-ui, sans-serif;
  max-width: 40rem;
  margin: 2rem auto;
  color: #1a1a1a;
}

h1 {
  font-size: 1.5rem;
}
</style>
