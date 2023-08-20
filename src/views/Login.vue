<template>
  <v-sheet width="500" class="mx-auto">
    <h2><center>Login</center></h2>
    <v-form fast-fail @submit.prevent>
      <v-text-field
        v-model="username"
        label="Username"
        :rules="usernameRules"
      ></v-text-field>

      <v-text-field
        type="password" 
        v-model="password"
        label="Password"
        :rules="passwordRules"
      ></v-text-field>

      <v-btn type="submit" :loading="loading" @click="login" block class="mt-2">Submit</v-btn>
    </v-form>
  </v-sheet>
</template>

<script>
  import axios from 'axios'
  import { useToast } from "vue-toastification";
  export default {
    data: () => ({
      username: '',
      usernameRules: [
        value => {
          if (value?.length > 3) return true
          return 'Username must be at least 3 characters.'
        },
      ],
      password: '',
      passwordRules: [
        value => {
          if (value?.length > 3) return true
          return 'Password must be at least 3 characters.'
        },
      ],
      loading: false
    }),
    methods: {
      async login(){
        try {
            this.loading = true
            let params = {
                "jsonrpc": "2.0",
                "id": "1234",
                "method": "login",
                "params": {
                    "username": this.username,
                    "password": this.password
                }
            }
            let response = await axios.post('http://192.168.10.71:8180/api/auth/', params)
            this.loading = false
            if (response.data.status == true) {
              document.cookie = 'token='+response.data.result.access_token
              this.$router.push({
                name: 'Home'
              });
            }else{
              this.toast.error(response.data.error.message)
            }
        } catch (error) {
            this.loading = false
            if(error.response.status == 401 ){
              if (typeof error.response.data.error.message == "object") this.toast.error(error.response.data.error.message["en"])
            }
            else if(error.response.status == 403) {
              this.toast.error(error.response.data.error.message)
            } else this.toast.error(error.message)
        }
      }
    },
    setup() {
      // Get toast interface
      const toast = useToast();
      return { toast }
    }
  }
</script>

<style scoped>
  .mx-auto{
    margin: 200px auto;
  }

  h2{
    color:rgb(38, 56, 40);
  }
</style>