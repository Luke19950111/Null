<template>
  index
  <Hi />
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
console.log(runtimeConfig, 'config')

const appConfig = useAppConfig()
console.log(appConfig, 'appConfig')
</script>