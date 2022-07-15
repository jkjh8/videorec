<script setup>
import { useQuasar, format } from "quasar";
import { audioMute, setAudioMute } from "src/composables/useVideo";
import { disk, folder, error, selFolder, openFolder } from "src/composables/useStatus";
import { stream, startStream, stopStream } from "src/composables/useStream";
import {
  setStreamRecorder,
  recStart,
  recStop,
  recState,
  recTimeString,
} from "src/composables/useRecorder";

import AudioMeter from "components/audioMeter.vue";
import SetupDialog from "components/dialogs/setupDialog.vue";
import TooltipBtn from "components/tooltipBtn";
import TooltipUp from "components/tooltipUp";

const { humanStorageSize } = format;
const $q = useQuasar();

function playStop() {
  if (recState.value !== "recording") {
    recStart();
  } else {
    recStop();
  }
}

function openSetup() {
  $q.dialog({
    component: SetupDialog,
  }).onOk(async (items) => {
    $q.loading.show();
    try {
      error.value = "";
      await API.send("setup:update", items);
      await setStreamRecorder();
      $q.loading.hide();
    } catch (err) {
      $q.loading.hide();
      console.error(err);
    }
  });
}
</script>

<template>
  <AudioMeter />
  <div class="row justify-between items-center control-box">
    <!-- timer -->
    <div>
      <div class="text-h3">{{ recTimeString }}</div>
      <div v-if="disk">
        <q-linear-progress :value="(disk.size - disk.free) / disk.size" />
        <div class="row justify-between items-center">
          <div>{{ humanStorageSize(disk.size - disk.free) }}</div>
          <div>{{ humanStorageSize(disk.size) }}</div>
        </div>
        <TooltipUp :msg="`${humanStorageSize(disk.size)} Free`" />
      </div>
    </div>

    <!-- play btn -->
    <q-btn
      class="btn-center"
      round
      color="red"
      :icon="recState !== 'recording' ? 'fiber_manual_record' : 'stop'"
      size="lg"
      @click="playStop"
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
