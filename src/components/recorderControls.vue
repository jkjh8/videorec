<script setup>
import { ref, onMounted, computed } from "vue";
import { useQuasar, format } from "quasar";
import { useRecorderStore } from "src/stores/recorderStore";
import { useStreamStore } from "src/stores/streamStore";
import { showTime, toggleStart, fnStop } from "src/composables/useStopWatch";
import { video, audioMute, refreshVideo, setAudioMute } from "src/composables/useVideo";
import { meterL, meterR, initAudio, peakL, peakR } from "src/composables/useAudio";
import { disk, folder } from "src/composables/useStatus";
import { error } from "src/composables/useError";

import SetupDialog from "components/dialogs/setupDialog.vue";

const { humanStorageSize } = format;
const $stream = useStreamStore();
const $rec = useRecorderStore();
const $q = useQuasar();
const width = ref(window.innerWidth - 10);

function playStop() {
  if ($rec.state !== "recording") {
    $rec.start();
    toggleStart();
  } else {
    $rec.end();
    fnStop();
  }
}

function openSetup() {
  $q.dialog({
    component: SetupDialog,
  }).onOk(async (items) => {
    $q.loading.show();
    try {
      await API.send("setup:update", items);
      error.value = await $stream.startStream();
      if (!error.value) {
        refreshVideo($stream.stream);
        $rec.init($stream.stream);
        initAudio($stream.stream);
      }
      $q.loading.hide();
    } catch (err) {
      $q.loading.hide();
      console.error(err);
    }
  });
}

async function selFolder() {
  const r = await API.send("status:selfolder");
  if (r) {
    folder.value = r;
  }
}

function openFinder() {
  API.send("status:openfinder", folder.value);
}

onMounted(() => {
  window.addEventListener("resize", () => {
    width.value = window.innerWidth - 10;
    API.send("status:resize", video.value.clientHeight);
  });
});
</script>

<template>
  <div class="flex">
    <div class="row no-wrap">
      <canvas ref="meterL" class="meter" height="5" :width="width" />
      <div :class="peakL ? 'bg-red' : 'meter'" style="width: 10px; height: 5px"></div>
    </div>
    <div class="row no-wrap">
      <canvas ref="meterR" class="meter" height="5" :width="width" />
      <div :class="peakR ? 'bg-red' : 'meter'" style="width: 10px; height: 5px"></div>
    </div>
  </div>
  <div class="row justify-between items-center control-box">
    <!-- timer -->
    <div>
      <div class="text-h3">{{ showTime }}</div>
      <div v-if="disk">
        <q-linear-progress :value="(disk.size - disk.free) / disk.size" />
        <div class="row justify-between items-center">
          <div>{{ humanStorageSize(disk.size - disk.free) }}</div>
          <div>{{ humanStorageSize(disk.size) }}</div>
        </div>
        <q-tooltip
          style="background: rgba(0, 0, 0, 0.8)"
          anchor="top middle"
          self="bottom middle"
          :offset="[10, 10]"
        >
          {{ humanStorageSize(disk.size) }} Free
        </q-tooltip>
      </div>
    </div>

    <!-- play btn -->
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
        {{ $rec.state !== "recording" ? "Recording" : "Stop" }}
      </q-tooltip>
    </q-btn>

    <!-- Controls -->
    <div>
      <div class="cursor row justify-end" @click="openFinder">
        {{ folder }}
        <q-tooltip
          style="background: rgba(0, 0, 0, 0.8)"
          anchor="top middle"
          self="bottom middle"
          :offset="[10, 10]"
        >
          Open Folder
        </q-tooltip>
      </div>
      <div class="q-gutter-x-sm row justify-end">
        <q-btn
          :disable="$rec.state === 'recording'"
          flat
          round
          icon="folder"
          color="yellow-8"
          @click="selFolder"
        >
          <q-tooltip
            style="background: rgba(0, 0, 0, 0.8)"
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
          >
            Select Folder
          </q-tooltip>
        </q-btn>
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

        <q-btn
          :disable="$rec.state === 'recording'"
          flat
          round
          icon="settings"
          @click="openSetup"
        >
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
