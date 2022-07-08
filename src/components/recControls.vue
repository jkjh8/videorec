<script setup>
import { useRecorderStore } from 'src/stores/recorderStore'
import { useStreamStore } from 'src/stores/streamStore'
import {
  clock,
  showTime,
  remaindTime,
  toggleStart,
  fnStop
} from 'src/composables/stopWatch'

const $stream = useStreamStore()
const $rec = useRecorderStore()
function playStop() {
  if ($rec.state !== 'recording') {
    $rec.start()
    toggleStart()
  } else {
    $rec.end()
    fnStop()
  }
}
</script>

<template>
  <div class="row justify-start control-box">
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
  </div>
</template>

<style scoped>
.control-box {
  position: relative;
  height: 60px;
  padding: 0 2%;
}
.btn-center {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>
