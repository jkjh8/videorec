<script setup>
import { useQuasar, useDialogPluginComponent } from "quasar";

import {
  getDevices,
  videoDevices,
  videoDevice,
  audioDevices,
  audioDevice,
  resolutions,
  resolution,
} from "src/composables/useStream";

import {
  checkSupportedTypes,
  supportedTypes,
  format,
  qualitys,
  quality,
} from "src/composables/useRecorder";

const $q = useQuasar();

const emit = defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();

function refresh() {
  getDevices();
  checkSupportedTypes();
}

function onSubmit() {
  onDialogOK([
    { key: "format", value: format.value },
    { key: "videodevice", value: videoDevice.value },
    { key: "audiodevice", value: audioDevice.value },
    { key: "quality", value: quality.value },
    {
      key: "resolution",
      value:
        typeof resolution.value === "string" ? resolution.value : { ...resolution.value },
    },
  ]);
}
</script>

<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card class="q-dialog-plugin confirmDialog">
      <q-card-section class="nameTag q-py-xs" style="">
        <div class="row justify-between items-center">
          <div>Video Recorder Setup</div>
          <div>
            <q-btn flat round icon="refresh" @click="refresh">
              <q-tooltip
                style="background: rgba(0, 0, 0, 0.8)"
                anchor="top middle"
                self="bottom middle"
                :offset="[10, 10]"
              >
                Reload
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section>
          <div class="q-gutter-y-sm">
            <q-select
              v-model="format"
              filled
              dense
              label="Recording Format"
              :options="supportedTypes"
            />
            <q-select
              v-model="videoDevice"
              filled
              dense
              label="Video Device"
              :options="videoDevices"
              option-label="label"
              option-value="deviceId"
              emit-value
              map-options
            />
            <q-select
              v-model="audioDevice"
              filled
              dense
              label="Audio Device"
              :options="audioDevices"
              option-label="label"
              option-value="deviceId"
              emit-value
              map-options
            />
            <q-select
              v-model="quality"
              filled
              dense
              label="Rec Quality"
              :options="qualitys"
              option-label="label"
              option-value="value"
              emit-value
              map-options
            />
            <q-select
              v-model="resolution"
              filled
              dense
              label="Video Resolution"
              :options="resolutions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn style="width: 80px" label="취소" flat @click="onDialogCancel" />
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
  background: rgba(30, 30, 30, 0.8);
}
.nameTag {
  background: rgba(66, 135, 255, 0.7);
}
</style>
