<script setup>
import { useQuasar } from 'quasar'
import { useRecorderStore } from 'src/stores/recorderStore'
import { useStreamStore } from 'src/stores/streamStore'
import { useAudioStore } from 'src/stores/audioStore'
import { showTime, toggleStart, fnStop } from 'src/composables/useStopWatch'
import { audioMute, refreshVideo, setAudioMute } from 'src/composables/useVideo'
import { error } from 'src/composables/useError'

import SetupDialog from 'components/dialogs/setupDialog.vue'

const $stream = useStreamStore()
const $rec = useRecorderStore()
const $audio = useAudioStore()
const $q = useQuasar()

function playStop() {
  if ($rec.state !== 'recording') {
    $rec.start()
    toggleStart()
  } else {
    $rec.end()
    fnStop()
  }
}

function openSetup() {
  $q.dialog({
    component: SetupDialog
  }).onOk(async (items) => {
    $q.loading.show()
    try {
      await API.send('setup:update', items)
      error.value = await $stream.startStream()
      if (!error.value) {
        await $rec.init($stream.stream)
      }
      refreshVideo($stream.stream)
      $q.loading.hide()
    } catch (err) {
      $q.loading.hide()
      console.error(err)
    }
  })
}
</script>

<template>
  <div>
    <q-linear-progress :value="$audio.meterL" />
    <q-linear-progress :value="$audio.meterR" />
  </div>
  <div class="row justify-between items-center control-box">
    <div class="text-h2">{{ showTime }}</div>

    <q-btn
      class="btn-center"
      round
      color="red"
      :icon="$rec.state !== 'recording' ? 'fiber_manual_record' : 'stop'"
      size="lg"
      @click="playStop"
    >
      <q-tooltip
        style="background: rgba(0, 0, 0, 0.8)"
        anchor="top middle"
        self="bottom middle"
        :offset="[10, 10]"
      >
        {{ $rec.state !== 'recording' ? 'Recording' : 'Stop' }}
      </q-tooltip>
    </q-btn>
    <div class="q-gutter-x-sm">
      <q-btn
        flat
        round
        :icon="audioMute ? 'volume_off' : 'volume_up'"
        :color="audioMute ? 'red-10' : ''"
        @click="setAudioMute"
      >
        <q-tooltip
          style="background: rgba(0, 0, 0, 0.8)"
          anchor="top middle"
          self="bottom middle"
          :offset="[10, 10]"
        >
          Mute
        </q-tooltip>
      </q-btn>

      <q-btn flat round icon="settings" @click="openSetup">
        <q-tooltip
          style="background: rgba(0, 0, 0, 0.8)"
          anchor="top middle"
          self="bottom middle"
          :offset="[10, 10]"
        >
          Setup
        </q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<style scoped>
.control-box {
  position: relative;
  height: 80px;
  padding: 0 2%;
  background: #333;
}
.btn-center {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>
