<script setup>
import { useQuasar, useDialogPluginComponent } from "quasar";
import info from "../../../package.json";

const $q = useQuasar();

const emit = defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();
</script>

<template>
  <q-dialog ref="dialogRef">
    <q-card class="q-dialog-plugin confirmDialog">
      <q-card-section>
        <div class="row no-wrap justify-center q-pt-md">
          <q-icon name="svguse:icons.svg#logo" size="100px" />
        </div>
        <div class="column items-center">
          <div>{{ info.productName }} {{ info.version }}</div>
          <div>{{ info.author }}</div>
        </div>
      </q-card-section>
      <q-scroll-area style="height: 200px">
        <q-card-section>
          <div>Used Open Sources</div>
        </q-card-section>
        <q-card-section>
          <div>Vue.js</div>
          <div class="caption">https://www.nodejs.org</div>
          <div class="caption">Copyright (c) 2014-2022 Evan You</div>
          <div class="caption">The MIT License (MIT)</div>
        </q-card-section>

        <q-card-section>
          <div>Quasar</div>
          <div class="caption">https://quasar.dev</div>
          <div class="caption">Copyright (c) 2015-present Razvan Stoenescu</div>
          <div class="caption">The MIT License (MIT)</div>
        </q-card-section>

        <q-card-section>
          <div>Electron</div>
          <div class="caption">https://www.electronjs.org</div>
          <div class="caption">Copyright (c) 2013-2020 GitHub Inc</div>
          <div class="caption">The MIT License (MIT)</div>
        </q-card-section>

        <q-card-section>
          <div>Nedb-promises</div>
          <div class="caption">https://github.com/bajankristof/nedb-promises</div>
          <div class="caption">The MIT License (MIT)</div>
        </q-card-section>

        <q-card-section>
          <div>Moment.js</div>
          <div class="caption">https://momentjs.com</div>
          <div class="caption">The MIT License (MIT)</div>
        </q-card-section>

        <q-card-section>
          <div>Check-disk-space</div>
          <div class="caption">https://github.com/Alex-D/check-disk-space</div>
          <div class="caption">The MIT License (MIT)</div>
        </q-card-section>
      </q-scroll-area>
      <q-card-actions align="right">
        <q-btn
          style="width: 80px"
          label="확인"
          color="primary"
          unelevated
          @click="onDialogOK"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style>
.confirmDialog {
  border-radius: 0.5rem;
  background: rgba(30, 30, 30, 0.8);
}
.caption {
  font-size: 0.6rem;
  color: grey;
}
</style>
