<script setup>
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { getDevices, startStream } from 'src/composables/useStream'
import { video, setWindowSize, setVideo } from 'src/composables/useVideo'
import { recState } from 'src/composables/useRecorder'
import { setAudioMeter } from 'src/composables/useAudio'
import { error } from 'src/composables/useStatus'

const $q = useQuasar()

onMounted(async () => {
  $q.loading.show()
  try {
    await getDevices()
    await startStream()
    setVideo()
    setAudioMeter()
    $q.loading.hide()
  } catch (err) {
    $q.loading.hide()
    error.value = err.name
  }
})
</script>

<template>
  <div class="q-gutter-y-md" style="padding: 10px 10px 10px 10px">
    <div class="row justify-center">
      <video
        ref="video"
        class="video"
        :style="
          recState === 'recording'
            ? 'border: 1px solid red'
            : 'border: 1px solid #222'
        "
        @loadedmetadata="windowResize"
        @dblclick="setWindowSize"
      />
    </div>
  </div>

  <div v-if="error" class="fixed-center">{{ error }}</div>
</template>

<style scoped>
.video {
  width: 100%;
  border-radius: 2px;
  background: #111;
}
</style>
