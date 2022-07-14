<script setup>
import {
  meterL,
  meterR,
  peakL,
  peakR,
  meterWidth as width,
} from "src/composables/useAudio";
</script>

<template>
  <div>
    <div class="row no-wrap">
      <canvas ref="meterL" class="meter" height="5" :width="width" />
      <div :class="peakL ? 'bg-red' : 'meter'" style="width: 10px; height: 5px"></div>
    </div>
    <q-separator class="bg-grey-10" />
    <div class="row no-wrap">
      <canvas ref="meterR" class="meter" height="5" :width="width" />
      <div :class="peakR ? 'bg-red' : 'meter'" style="width: 10px; height: 5px"></div>
    </div>
  </div>
</template>

<style scoped>
.meter {
  background: #222;
}
</style>
