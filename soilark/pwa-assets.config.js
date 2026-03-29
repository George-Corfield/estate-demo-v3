import {
  defineConfig,
  minimal2023Preset,
  createAppleSplashScreens
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
  headLinkOptions: {
    preset: '2023',
  },
  preset: {
    ...minimal2023Preset,
    appleSplashScreens: createAppleSplashScreens({
      padding: 0.3,
      resizeOptions: { background: '#064e3b', fit: 'contain' },
    }),
  },
  images: ['public/LANDARK.png'], // Make sure this file exists!
})