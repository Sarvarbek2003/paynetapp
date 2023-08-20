<template>
    <!-- <v-app-bar>
      <img class="logo" src="../assets/logo.svg" alt="logo" >
      <v-btn @click="logout" icon style="margin-left: auto;">
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-app-bar> -->
    <v-app>
      <v-row>
        <v-col>
            <v-card class="card" :loading="loading">
              <div class="image">
                <v-avatar :image="'https://reposu.org/public/images/'+service.merchant_image" size="100"></v-avatar>
                <v-title style="font-weight: bold; font-size: 20px;">{{service.merchant_name_uz}}</v-title>
              </div>
              <v-col
                cols="12"
                sm="12"
                v-for="item of service.params"
              >
                <v-text-field
                  :label="item.titleuz"
                  @input="keyup(item, $event)"
                  :placeholder="item.placeholder"
                  @keyup.enter="sendData(service)"
                  color="primary"
                  variant="outlined"
                  type="number"
                  :id="item.key"
                ></v-text-field>
              </v-col>
              <v-card-actions
                style="display: flex; justify-content: center;"
              >
                <v-btn
                  variant="outlined"
                  color="green"
                  :loading="loading"
                  @click="sendData(service)"
                >Accept</v-btn>
              </v-card-actions>
            </v-card>
        </v-col>
        </v-row>
    </v-app>
  </template>

  
  
  <script>
    import axios from 'axios'
    import { useToast } from "vue-toastification";
    import { vMaska } from "maska"
    export default {
        directives: { maska: vMaska },
        data: () => ({
            service: {},
            BaseUrl: "https://reposu.org/apiv1",
            createPaymentParam: {},
            success_param : true,
            loading: false
        }),
        methods: {
            async getServices(){
              let params = {
                  "method": "cheque.getfield",
                  "params": {
                      "service_id": Number(this.$route.query.service_id)
                  }
              }
              try {
                  let response = await axios.post(this.BaseUrl, params, {headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST",
                    token: this.$route.query.token
                  }})
                  if(response.data.success == false ){
                    this.toast.error(response.data.error.text.uz) 
                    return
                  }
                  this.service = response.data.result
                  this.$store.commit('createPayment', response.data.result)
              } catch (error) {
                  this.toast.error(error.message)
              }
            },
            async createPayment () {
              let params = {
                  "method": "cheque.create",
                  "params": this.createPaymentParam
              }
              try {
                  this.loading = true
                  let response = await axios.post(this.BaseUrl, params, {headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST",
                    token: this.$route.query.token
                  }})
                  this.loading = false
                  // console.log("🚀 ~ file: HomePage.vue:56 ~ getServices ~ response:", response.data.result)
                  if(response.data.success == false ){
                    this.toast.error(response.data.error.text.uz) 
                    return
                  }
                  this.$router.push({
                    name: 'AcceptPayment',
                    query: {cheque_id: response.data.result.id, token: this.$route.query.token},
                    
                  });
              } catch (error) {
                  this.toast.error(error.message)
              }
            },
            async sendData(item) {
              let object = {
                service_id: parseInt(this.$route.query.service_id)
              }
              for (const param of item.params) {
                if(document.querySelector('#'+param.key).value.trim() == "")  {
                  document.querySelector('#'+param.key).style = 'border-color: red'
                  document.querySelector('#'+param.key + '-messages').style = 'color: red;'
                  document.querySelector('#'+param.key + '-messages').textContent = 'Maydon to\'ldirilishi shart'
                  this.success_param = false
                } else {
                  document.querySelector('#'+param.key + '-messages').textContent = null
                  object[param.key] = param.key == 'amount' ? parseInt(document.querySelector('#'+param.key).value) * 100 : document.querySelector('#'+param.key).value
                }
              }
              if (!this.success_param) return
              this.createPaymentParam = object
              this.createPayment()
            },
            keyup(item, event) {
              let value = event.srcElement.value
              if(item.key == 'amount'){
                let buttonText = document.querySelector('#'+item.key + '-messages')
                let min = (this.service.min_amount / 100 ).toLocaleString('ru-RU', {minimumFractionDigits: 2})
                let max = (this.service.max_amount / 100 ).toLocaleString('ru-RU', {minimumFractionDigits: 2})
                if(parseInt(value) < parseInt(this.service.min_amount / 100) || parseInt(value) > parseInt(this.service.max_amount / 100)) {
                  console.log(buttonText);
                  buttonText.style = 'color: red;'
                  buttonText.textContent = `${min} - ${max}`
                  this.success_param = false
                } else {
                  buttonText.style = 'color: inherit;'
                  buttonText.textContent = `${min} - ${max}`
                  this.success_param = true
                }
              } 
            }
        },
        setup() {
          // Get toast interface
          const toast = useToast();
          return { toast }
        },
        mounted(){
          this.getServices()
        }
  }
  </script>
  
  
  <style scoped>
    .image{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .card {
      width: 500px;
      margin-left: auto;
      margin-right: auto;
      padding: 30px;
    }
    
    .v-row{
      justify-content: center;
      flex: 0 0 auto;
      margin-top: 50px;
    }

    @media screen and (max-width: 600px) {
      .card {
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        padding: 30px;
        height: calc(100vh);
      }
      .v-row{
        justify-content: center;
        flex: 0 0 auto;
        margin-top: 0px;
      }
    }

  </style>
  