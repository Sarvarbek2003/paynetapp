<template>
    <v-app>
        <v-row class="continer">
            <v-col class="continer-card">
                <v-card class="card" v-if="paymentData">  
                    <v-col>
                        <div class="image-data">
                            <v-img width="100" :src="statusIcons[paymentData.status].icon"></v-img>
                            <h3 :class="'title '+paymentData.status">{{ statusIcons[paymentData.status].title[lang] }}</h3>
                        </div>
                        <div class="paydata">
                            <div class="paymentdata-params" v-for="(param, key) of paymentData.params" :key="key">
                            <span>{{ params[key][lang] || key }}</span>
                            <span>{{ key == 'amount' ? (param/100).toLocaleString('ru-RU', {minimumFractionDigits: 2}):param }}</span>
                        </div>
                        </div>
                    </v-col>
                </v-card>
            </v-col>
        </v-row>
    </v-app>
</template>

  
  <script>
    import axios from 'axios'
    import { useToast } from "vue-toastification";
    export default {
        data: () => ({
            BaseUrl: 'https://reposu.org/apiv1',
            lang: 'uz',
            paymentData: null,
            params: {
                service_id: {"uz": "Xizmat ID:", "ru": "Идентификатор услуги"},
                clientid: {"uz": "Telefon raqami:", "ru": "Номер телефона"},
                amount: {"uz": "Summa", "ru":"Сумма"},
                id_confirm: {"uz": "ID", "ru":"Идентификатор"}
            },
            statusIcons: {
                success: {icon: 'src/assets/success-paid.svg', title: {"uz":"To'landi ✅", "ru":"Оплаченный ✅"}},
                process: {icon: 'src/assets/proccess-paid.svg', title: {"uz":"Kutilmoqda ⏳", "ru":"Ожидающий ⏳"}},
                verify: {icon: 'src/assets/proccess-paid.svg', title: {"uz":"Kutilmoqda ⏳", "ru":"Ожидающий ⏳"}},
                cancel: {icon: 'src/assets/cancel-paid.svg', title: {"uz":"Bekor qilindi ❌", "ru":"Отменено ❌"}}
            }
        }),
        methods: {
            async getCheckData(){
                try {
                    let params = { 
                        "method": "cheque.get",
                        "params": {
                            "cheque_id": Number(this.$route.query.cheque_id)
                        }
                    }
                    let response = await axios.post(this.BaseUrl, params, {headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "POST",
                        token: this.$route.query.token
                    }})
                    if(response.data.success == false ){
                        this.toast.error(response.data.error.text[this.lang]) 
                        return
                    }
                    this.paymentData = response.data.result
                } catch (error) {
                    this.toast.error(error.message)
                }
            },
            
        },
        setup() {
            const toast = useToast();
            return { toast }
        },
        async mounted(){
            this.getCheckData()
        }   
    }
  </script>
  
  <style scoped>
    
    .image-data {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 50px;
        margin-bottom: 30px;
        width: 100%;
        margin-left: auto;
        margin-right: auto;
    }

    .title{
        margin-top: 20px;
    }
    
    .success {
        color: green;
    }
    .process {
        color: #FFC61B;
    }
    .verify {
        color: #FFC61B;
    }
    .cancel {
        color: rgb(196, 18, 18);
    }
    
    .continer {
        margin: 50px auto;;
        width: 500px;
        /* padding: 100px; */
        display: flex;
    }

    .card-continer {
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        padding: 10px;
    }
    .paymentdata-params{
        display: flex;
        font-family: 'Inter,sans-serif';
        font-size: 15px;
        color: rgb(150, 141, 141);
        justify-content: space-between;
    }

    @media screen and (max-width: 1000px) {
        .continer {
            padding: 10px;
            display: flex;
            flex-direction: column;
            width: 100%;
        }   

        .continer-card {
            width: 100%;
        }
    }   
  </style>