<script setup>
import { ref, onMounted } from 'vue'
import { recState } from 'src/composables/useRecorder'
import useNotify from 'src/composables/useNotify'

import TooltipBtn from 'components/tooltipBtn'
import TooltipUp from 'components/tooltipUp'

const $n = useNotify()
const converting = ref(false)
const convertingTimeStamp = ref('00:00:00.00')

function convertMkv() {
  return API.send('file:convert')
}

onMounted(() => {
  API.handle('file:convert', (e, args) => {
    switch (args.comm) {
      case 'start':
        converting.value = true
        $n.info('Started Converting', args.file)
        break
      case 'end':
        converting.value = false
        $n.info('Converting Complited', args.file)
        break
      case 'progress':
        convertingTimeStamp.value = args.value
        break
      case 'error':
        converting.value = false
        $n.error('Converting Error', args.file)
        break
    }
  })
})
</script>

<template>
  <div v-if="converting" class="self-center">
    <q-spinner color="primary" size="2em" :thickness="10" />
    <TooltipUp :msg="convertingTimeStamp" />
  </div>

  <TooltipBtn
    v-else
    :disable="recState === 'recording'"
    icon="transform"
    color="green-8"
    msg="Convert Format"
    @click="convertMkv"
  />
</template>

<style scoped></style>
