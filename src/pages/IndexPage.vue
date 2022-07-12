<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import { useRecorderStore } from "src/stores/recorderStore";
import { useStreamStore } from "src/stores/streamStore";
import { initAudio } from "src/composables/useAudio";
import { video, audioMute, refreshVideo } from "src/composables/useVideo";
import {
  disk,
  folder,
  startDiskChkTimer,
  stopDiskChkTimer,
} from "src/composables/useStatus";
import { error } from "src/composables/useError";

const $stream = useStreamStore();
const $rec = useRecorderStore();
const $q = useQuasar();

function onloaded() {
  console.log("onloaded");
  API.send("status:resize", video.value.clientHeight);
}

onMounted(async () => {
  $q.loading.show();
  try {
    $rec.chkSupportedTypes();
    await $stream.getDevices();
    error.value = await $stream.startStream();
    if (!error.value) {
      refreshVideo($stream.stream);
      $rec.init($stream.stream);
      initAudio($stream.stream);
      // API.send("status:resize", video.value.clientHeight);
    }
    $q.loading.hide();
  } catch (err) {
    $q.loading.hide();
    console.log(err);
  }
});

onBeforeMount(async () => {
  navigator.mediaDevices.ondevicechange = () => {
    $stream.getDevices();
  };
  API.handle("status:folder", (e, r) => {
    folder.value = r;
  });
  const items = await API.send("setup:get");
  items.forEach((item) => {
    switch (item.key) {
      case "format":
        $rec.selectedFormat = item.value;
        break;
      case "videodeivce":
        $stream.videoDevice = item.value;
        console.log("update");
        break;
      case "audiodevice":
        $stream.audioDevice = item.value;
        break;
      case "resolution":
        $stream.resolution = item.value;
        break;
      case "quality":
        $rec.quality = item.value;
        break;
      case "audiomute":
        audioMute.value = item.value;
        break;
      case "folder":
        folder.value = item.value;
        break;
    }
  });

  if (!folder.value) {
    folder.value = await API.send("status:getfolder");
  }
  disk.value = await API.send("status:getdisk", folder.value);
  startDiskChkTimer();
});
</script>

<template>
  <div class="q-gutter-y-md" style="padding: 10px 10px 10px 10px">
    <div class="row justify-center">
      <video ref="video" class="video" @loadedmetadata="onloaded" />
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
