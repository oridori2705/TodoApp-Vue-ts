<script setup lang="ts">
;(async () => {
  const res = await fetch('/api/hello', {
    method: 'POST'
  })
  const json = await res.json()
  console.log(json)
})()
</script>

<template>
  <h1>MainPage</h1>
</template>
