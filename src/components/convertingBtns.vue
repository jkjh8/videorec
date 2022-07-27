<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { recState } from "src/composables/useRecorder";
import useNotify from "src/composables/useNotify";

import TooltipBtn from "components/tooltipBtn";
import TooltipUp from "components/tooltipUp";

const $n = useNotify();
const converting = ref(false);
const convertingProgress = ref("00:00:00.00");

function selectConveringFile() {
  API.send("file:convert");
}

onMounted(() => {
  API.handle("file:convert", (e, args) => {
    switch (args.comm) {
      case "start":
        converting.value = true;
        $n.info("Converting Start", args.file);
        break;
      case "progress":
        convertingProgress.value = args.value;
        break;
      case "end":
        converting.value = false;
        $n.info("Converting End", args.file);
        break;
      case "error":
        converting.value = false;
        $n.error("Converting Error", args.file);
        break;
    }
  });
});
</script>

<template>
  <div v-if="converting" class="self-center">
    <q-spinner color="primary" size="1.8em" :thickness="10" />
    <TooltipUp :msg="convertingProgress" />
  </div>

  <TooltipBtn
    v-else
    :disable="recState === 'recording'"
    icon="transform"
    color="green-8"
    msg="Convert Format"
    @click="selectConveringFile"
  />
</template>

<style scoped></style>
