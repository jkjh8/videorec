<script setup>
import { format } from 'quasar'
import { clockString } from 'src/composables/useRecorder'
import { disk } from 'src/composables/useStatus'
import TooltipUp from 'components/tooltipUp'

const { humanStorageSize } = format
</script>

<template>
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
</template>

<style scoped></style>
