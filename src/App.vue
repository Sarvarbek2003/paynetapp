<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>
  
</script>
<style>
  .v-list-item--active .v-list-item-title {
    color: #fff!important;
  }

  input[type="number"]::-webkit-inner-spin-button {
  display: none;
}

/* Fallback for other browsers */
input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
  -webkit-appearance: textfield;
}
</style>