<script setup>
import { useQuasar } from 'quasar'
import { audioMute, setAudioMute, setVideo } from 'src/composables/useVideo'
import { setAudioMeter } from 'src/composables/useAudio'
import { folder, error, selFolder, openFolder } from 'src/composables/useStatus'
import { startStream, stopStream } from 'src/composables/useStream'
import { recState, recStartStop } from 'src/composables/useRecorder'

import AudioMeter from 'components/audioMeter.vue'
import ConvertingBtns from 'components/convertingBtns.vue'
import RecorderTimer from 'components/recorderTimer.vue'

import SetupDialog from 'components/dialogs/setupDialog.vue'

import TooltipBtn from 'components/tooltipBtn'
import TooltipUp from 'components/tooltipUp'

const $q = useQuasar()

function openSetup() {
  $q.dialog({
    component: SetupDialog
  }).onOk(async (items) => {
    $q.loading.show()
    try {
      await API.send('setup:update', items)
      error.value = await stopStream()
      error.value = await startStream()
      setVideo()
      setAudioMeter()
      $q.loading.hide()
    } catch (err) {
      $q.loading.hide()
      error.value = err.name
    }
  })
}
</script>

<template>
  <AudioMeter />
  <div class="row justify-between items-center control-box">
    <!-- timer -->
    <RecorderTimer />

    <!-- play btn -->
    <q-btn
      class="btn-center"
      round
      color="red"
      :icon="recState !== 'recording' ? 'fiber_manual_record' : 'stop'"
      size="lg"
      @click="recStartStop"
    >
      <TooltipUp :msg="recState !== 'recording' ? 'Recording' : 'Stop'" />
    </q-btn>

    <!-- Controls -->
    <div>
      <div class="cursor row justify-end" @click="openFolder">
        {{ folder }}
        <TooltipUp msg="Oprn Folder" />
      </div>
      <div class="q-gutter-x-sm row justify-end">
        <ConvertingBtns />
        <TooltipBtn
          :disable="recState === 'recording'"
          icon="folder"
          color="yellow-8"
          msg="Select Folder"
          @click="selFolder"
        />
        <TooltipBtn
          :icon="audioMute ? 'volume_off' : 'volume_up'"
          :color="audioMute ? 'red-10' : 'grey-1'"
          msg="Mute"
          @click="setAudioMute"
        />
        <TooltipBtn
          :disable="recState === 'recording'"
          icon="settings"
          color="grey-1"
          msg="Setup"
          @click="openSetup"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.control-box {
  position: relative;
  height: 100px;
  padding: 0 2%;
  background: #333;
}
.btn-center {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translate(-50%, 0);
}
.meter {
  background: #222;
}
</style>
