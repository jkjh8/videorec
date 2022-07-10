<script setup>
import { useQuasar, useDialogPluginComponent } from 'quasar'
import { useRecorderStore } from 'src/stores/recorderStore'
import { useStreamStore } from 'src/stores/streamStore'
import { useAudioStore } from 'src/stores/audioStore'

const $stream = useStreamStore()
const $rec = useRecorderStore()
const $audio = useAudioStore()
const $q = useQuasar()

const emit = defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

function onSubmit() {
  onDialogOK({
    format: $rec.selectedFormat,
    videoDev: $stream.selVideoDevice,
    audioDev: $stream.selAudioDevice,
    quality: $rec.quality
  })
}
</script>

<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card class="q-dialog-plugin confirmDialog">
      <q-form @submit="onSubmit">
        <q-card-section>
          <div class="q-gutter-y-sm">
            <q-select
              v-model="$rec.selectedFormat"
              filled
              dense
              label="Recording Format"
              :options="$rec.supportedTypes"
            />
            <q-select
              v-model="$stream.selVideoDevice"
              filled
              dense
              label="Video Device"
              :options="$stream.videoDevices"
              option-label="label"
              option-value="deviceId"
              emit-value
              map-options
            />
            <q-select
              v-model="$stream.selAudioDevice"
              filled
              dense
              label="Audio Device"
              :options="$stream.audioDevices"
              option-label="label"
              option-value="deviceId"
              emit-value
              map-options
            />
            <q-select
              v-model="$rec.quality"
              filled
              dense
              label="Rec Quality"
              :options="$rec.qualitys"
              option-label="label"
              option-value="value"
              emit-value
              map-options
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            style="width: 80px"
            label="취소"
            flat
            @click="onDialogCancel"
          />
          <q-btn
            style="width: 80px"
            label="확인"
            color="primary"
            unelevated
            type="submit"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style>
.confirmDialog {
  border-radius: 0.5rem;
  background: rgba(30, 30, 30, 0.7);
}
</style>
