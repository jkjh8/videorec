<script setup>
import { onMounted, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import { getDevices, changeDevices, startStream } from "src/composables/useStream";
import { video, windowResize, setWindowSize, setVideo } from "src/composables/useVideo";
import { setMeterWidth, setAudioMeter } from "src/composables/useAudio";
import {
  error,
  APIHandler,
  getSetup,
  getFolder,
  getDiskUseage,
} from "src/composables/useStatus";
import About from "components/dialogs/aboutDialog";

const $q = useQuasar();

onMounted(async () => {
  window.addEventListener("resize", () => {
    setMeterWidth();
    windowResize();
  });

  API.handle("menu:about", () => {
    $q.dialog({
      component: About,
    });
  });

  API.handle("file:saved", (e, filePath) => {
    console.log(filePath);
    $q.notify({
      color: "primary",
      icon: "info",
      position: "top",
      message: "File Saved",
      caption: filePath,
    });
  });

  $q.loading.show();
  try {
    await getDevices();
    await startStream();
    setVideo();
    setAudioMeter();
    $q.loading.hide();
  } catch (err) {
    $q.loading.hide();
    error.value = err.name;
  }
});

onBeforeMount(async () => {
  changeDevices();
  APIHandler();
  getSetup();
  getDiskUseage();
  getFolder();
});
</script>

<template>
  <div class="q-gutter-y-md" style="padding: 10px 10px 10px 10px">
    <div class="row justify-center">
      <video
        ref="video"
        class="video"
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
