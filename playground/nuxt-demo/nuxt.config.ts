// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  runtimeConfig: {
    apiSecret: '123',
    public: {
      apiBase: '/api'
    }
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalDate: '@use "~/assets/css/colors.scss" as *;'
        }
      }
    }
  }
})
