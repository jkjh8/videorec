<script setup>
import { useQuasar } from 'quasar'
import { useRecorderStore } from 'src/stores/recorderStore'
import { useStreamStore } from 'src/stores/streamStore'
import { useAudioStore } from 'src/stores/audioStore'
import { showTime, toggleStart, fnStop } from 'src/composables/stopWatch'

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
  })
}
</script>

<template>
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

    <q-btn flat round icon="settings" @click="openSetup">
      <q-tooltip
        style="background: rgba(0, 0, 0, 0.8)"
        anchor="top middle"
        self="bottom middle"
        :offset="[10, 10]"
        >Setup</q-tooltip
      >
    </q-btn>
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
