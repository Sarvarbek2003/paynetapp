<template>
  <v-app>
    <default-bar />
      <v-row>
        <v-col cols="4">
          <v-card
            color="#385F73"
            theme="dark"
            style="margin: 50px;"
          >
            <v-card-title class="text-h5">
              Transactions
            </v-card-title>
  
            <v-card-actions>
              <v-btn 
                to="/kassa"
                target="_blank"
                variant="text">
                <v-icon icon="mdi-arrow-right-thick"></v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card
            color="#385F73"
            theme="dark"
            style="margin: 50px;"
          >
            <v-card-title class="text-h5">
              Monitoring
            </v-card-title>
  
            <v-card-actions>
              <v-btn target="_blank" to="/monitoring" variant="text">
                <v-icon icon="mdi-arrow-right-thick"></v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-card
            color="#385F73"
            theme="dark"
            style="margin: 50px;"
          >
            <v-card-title class="text-h5">
              Logs
            </v-card-title>
    
            <v-card-actions>
              <v-btn to="/logs" target="_blank" variant="text">
                <v-icon icon="mdi-arrow-right-thick"></v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card
            color="#385F73"
            theme="dark"
            style="margin: 50px;"
          >
            <v-card-title class="text-h5">
              Card info
            </v-card-title>
    
            <v-card-actions>
              <v-btn to="/info" target="_blank" variant="text">
                <v-icon icon="mdi-arrow-right-thick"></v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    <default-view />
  </v-app>
</template>


<script setup>
  import DefaultBar from './AppBar.vue'
  import DefaultView from './View.vue'
</script>


<style scoped>

  .v-row{
    justify-content: center;
    flex: 0 0 auto;
  }
</style>
