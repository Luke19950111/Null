<template>
  index
  <Hi />
  <img src="/public/img/t.png" alt="" style="width: 200px">
  <img src="~/assets/img/t.png" alt="" style="width: 300px">
  <div class="primary-color">
    primary color
  </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
console.log(runtimeConfig, 'config')

const appConfig = useAppConfig()
console.log(appConfig, 'appConfig')
</script>

<style lang="scss" scoped>
.primary-color {
  color: $red;
}
</style>