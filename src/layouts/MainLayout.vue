<script setup>
import { useQuasar } from 'quasar'
import RecControls from 'components/recControls.vue'
const $q = useQuasar()
$q.dark.set(true)
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <!-- <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" />

        <q-toolbar-title> Quasar App </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header> -->

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer>
      <RecControls />
    </q-footer>
  </q-layout>
</template>
