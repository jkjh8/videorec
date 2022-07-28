<script setup>
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { changeDevices } from 'src/composables/useStream'
import {
  APIHandler,
  getSetup,
  getFolder,
  getDiskUseage
} from 'src/composables/useStatus'
import { windowResize } from 'src/composables/useVideo'
import { setMeterWidth } from 'src/composables/useAudio'
import useNotify from 'src/composables/useNotify'

import RecControls from 'src/components/recorderControls.vue'
import About from 'components/dialogs/aboutDialog'

const $q = useQuasar()
const $n = useNotify()
$q.dark.set(true)

onMounted(async () => {
  changeDevices()
  APIHandler()
  getSetup()
  getDiskUseage()
  getFolder()

  window.addEventListener('resize', () => {
    setMeterWidth()
    windowResize()
  })

  API.handle('menu:about', () => {
    $q.dialog({
      component: About
    })
  })

  API.handle('file:saved', (e, filePath) => {
    $n.info('Record File Save Complited', filePath)
  })
})
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer>
      <RecControls />
    </q-footer>
  </q-layout>
</template>
