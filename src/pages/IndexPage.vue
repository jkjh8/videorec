<script setup>
import { onMounted, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import { getDevices, changeDevices } from "src/composables/useStream";
import { checkSupportedTypes, setStreamRecorder } from "src/composables/useRecorder";
import { video, windowResize, setWindowSize } from "src/composables/useVideo";
import { setMeterWidth } from "src/composables/useAudio";
import { error, APIHandler, getSetup } from "src/composables/useStatus";
import About from "components/dialogs/aboutDialog";

const $q = useQuasar();

function setSize() {
  setWindowSize();
}

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

  $q.loading.show();
  try {
    error.value = "";
    checkSupportedTypes();
    await getDevices();
    await setStreamRecorder();
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
      <video
        ref="video"
        class="video"
        @loadedmetadata="windowResize"
        @dblclick="setSize"
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
