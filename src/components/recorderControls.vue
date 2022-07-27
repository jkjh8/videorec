<script setup>
import { ref, onMounted } from "vue";
import { useQuasar, format } from "quasar";
import { audioMute, setAudioMute, setVideo } from "src/composables/useVideo";
import { setAudioMeter } from "src/composables/useAudio";
import { disk, folder, error, selFolder, openFolder } from "src/composables/useStatus";
import { stream, startStream, stopStream } from "src/composables/useStream";
import { recState, clockString, recStartStop } from "src/composables/useRecorder";

import AudioMeter from "components/audioMeter.vue";
import SetupDialog from "components/dialogs/setupDialog.vue";
import TooltipBtn from "components/tooltipBtn";
import TooltipUp from "components/tooltipUp";

const converting = ref(false);
const convertingTime = ref("00:00:00");

const { humanStorageSize } = format;
const $q = useQuasar();

function convertMkv() {
  API.send("file:convert");
}

function openSetup() {
  $q.dialog({
    component: SetupDialog,
  }).onOk(async (items) => {
    $q.loading.show();
    try {
      await API.send("setup:update", items);
      error.value = await stopStream();
      error.value = await startStream();
      setVideo();
      setAudioMeter();
      $q.loading.hide();
    } catch (err) {
      $q.loading.hide();
      error.value = err.name;
    }
  });
}

onMounted(() => {
  API.handle("file:convert", (e, args) => {
    switch (args.comm) {
      case "start":
        converting.value = true;
        $q.notify({
          color: "primary",
          icon: "info",
          position: "top",
          message: "Converting Start",
          caption: args.file,
        });
        break;
      case "progress":
        convertingTime.value = args.value;
        break;
      case "end":
        converting.value = false;
        $q.notify({
          color: "primary",
          icon: "info",
          position: "top",
          message: "Converting Complited",
          caption: args.file,
        });
        break;
      case "error":
        converting.value = false;
        $q.notify({
          color: "red-10",
          icon: "warning",
          position: "top",
          message: "Converting Error",
          caption: args.file,
        });
        break;
    }
  });
});
</script>

<template>
  <AudioMeter />
  <div class="row justify-between items-center control-box">
    <!-- timer -->
    <div>
      <div class="text-h3">{{ clockString }}</div>
      <div v-if="disk">
        <q-linear-progress :value="(disk.size - disk.free) / disk.size" />
        <div class="row justify-between items-center">
          <div>{{ humanStorageSize(disk.size - disk.free) }}</div>
          <div>{{ humanStorageSize(disk.size) }}</div>
        </div>
        <TooltipUp :msg="`${humanStorageSize(disk.free)} Free`" />
      </div>
    </div>

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
        <div v-if="converting" class="self-center">
          <q-spinner color="primary" size="2em" :thickness="10" />
          <TooltipUp :msg="convertingTime" />
        </div>

        <TooltipBtn
          v-else
          :disable="recState === 'recording'"
          icon="transform"
          color="green-8"
          msg="Convert Format"
          @click="convertMkv"
        />
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
