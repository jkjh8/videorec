<script setup>
import { useQuasar, useDialogPluginComponent } from "quasar";
import { useRecorderStore } from "src/stores/recorderStore";
import { useStreamStore } from "src/stores/streamStore";

const $stream = useStreamStore();
const $rec = useRecorderStore();
const $q = useQuasar();

const emit = defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();

function refresh() {
  $stream.getDevices();
  $rec.chkSupportedTypes();
}

function onSubmit() {
  onDialogOK([
    { key: "format", value: $rec.selectedFormat },
    { key: "videodeivce", value: $stream.videoDevice },
    { key: "audiodevice", value: $stream.audioDevice },
    { key: "quality", value: $rec.quality },
    {
      key: "resolution",
      value:
        typeof $stream.resolution === "string"
          ? $stream.resolution
          : { ...$stream.resolution },
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
              v-model="$rec.selectedFormat"
              filled
              dense
              label="Recording Format"
              :options="$rec.supportedTypes"
            />
            <q-select
              v-model="$stream.videoDevice"
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
              v-model="$stream.audioDevice"
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
            <q-select
              v-model="$stream.resolution"
              filled
              dense
              label="Video Resolution"
              :options="$stream.resolutions"
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
