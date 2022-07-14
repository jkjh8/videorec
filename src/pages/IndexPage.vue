<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
// import { useRecorderStore } from 'src/stores/recorderStore'
// import { useStreamStore } from 'src/stores/streamStore'
import {
  stream,
  getDevices,
  startStream,
  changeDevices,
} from "src/composables/useStream";
import { checkSupportedTypes, setRecorder } from "src/composables/useRecorder";
import { initAudio } from "src/composables/useAudio";
import { video, audioMute, setVideo, windowResize } from "src/composables/useVideo";
import { disk, error, folder, APIHandler, getSetup } from "src/composables/useStatus";

const $q = useQuasar();

onMounted(async () => {
  $q.loading.show();
  try {
    error.value = "";
    checkSupportedTypes();
    await getDevices();
    await startStream();
    setVideo(stream.value);
    setRecorder(stream.value);
    initAudio(stream.value);
    $q.loading.hide();
  } catch (err) {
    $q.loading.hide();
    console.log(err);
    error.value = err.name;
  }
});

onBeforeMount(async () => {
  changeDevices();
  APIHandler();
  getSetup();
});
</script>

<template>
  <div class="q-gutter-y-md" style="padding: 10px 10px 10px 10px">
    <div class="row justify-center">
      <video ref="video" class="video" @loadedmetadata="windowResize" />
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
