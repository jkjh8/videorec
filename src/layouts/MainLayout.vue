<script setup>
import { useQuasar } from "quasar";
import RecControls from "src/components/recorderControls.vue";
const $q = useQuasar();
$q.dark.set(true);
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer>
      <RecControls />
    </q-footer>
  </q-layout>
</template>
