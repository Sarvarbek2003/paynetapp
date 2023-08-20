<template>
    <v-app>
        <v-row class="continer">
            <v-col class="continer-card">
                <v-card v-if="['created' ,'verify'].includes(paymentData.status)" class="card" :loading="loading">  
                    <v-col>
                        <div class="image">
                            <v-avatar :image="'https://reposu.org/public/images/'+this.$store.state.item.merchant_image" size="100"></v-avatar>
                            <v-title style="font-weight: bold; font-size: 20px;">{{this.$store.state.item.merchant_name_uz}}</v-title>
                        </div>
                        <span class="paymentdata-description">{{ paymentData.description }}</span>
                        <div class="paymentdata-params" v-for="(param, key) of paymentData.params" :key="key">
                            <span>{{ params[key][lang] || key }}</span>
                            <span>{{ key == 'amount' ? (param/100).toLocaleString('ru-RU', {minimumFractionDigits: 2}):param }}</span>
                        </div>
                    </v-col>
                </v-card>
            </v-col>
            <v-col class="continer-card" v-if="['created','verify'].includes(paymentData.status)">
                <v-card  class="card">  
                    <v-window
                        v-model="onboarding"
                        show-arrows                        
                    >
                    <template v-slot:prev="{ props }">
                        <v-btn
                            style="width: 30px; height: 30px;"
                            icon="mdi-arrow-left-drop-circle-outline"
                            @click="send(props)"
                        >
                        </v-btn>
                    </template>
                    <template v-slot:next="{ props }">
                        <v-btn
                            style="width: 30px; height: 30px;"
                            icon="mdi-arrow-right-drop-circle-outline"
                            @click="send(props)"
                        >
                        </v-btn>    
                    </template>
                        <v-window-item
                            v-for="n in length"
                            :key="`card-${n}`"
                        >
                            <v-card
                                elevation="3"
                                height="200"
                                class="ma-5 pa-4"
                            >
                                <div @keypress.left="" v-if="n == 1">
                                    <span style="display: flex; align-items: center;">
                                        <v-icon icon="mdi-wallet" style="margin-right: 10px;"></v-icon>
                                        <h1>{{ userData.wallet.current_balance.toLocaleString('ru-RU', {minimumFractionDigits: 2})}} so'm</h1>
                                    </span><br><br>
                                    <span style="display: flex; align-items: center;">
                                        <v-icon icon="mdi-account-credit-card" style="margin-right: 10px;"></v-icon>
                                        <h3>{{ userData.wallet.full_name || "Card Holder" }}</h3>
                                    </span>
                                    <span style="display: flex; align-items: center;">
                                        <v-icon icon="mdi-numeric" style="margin-right: 10px;"></v-icon>
                                        <p>{{ userData.wallet.wallet_number }}</p>
                                    </span>
                                </div>
                                <div v-else-if="!isotp" class="card-continer">
                                    <v-row class="card-data">
                                        <div class="card-data_number">
                                            <v-text-field 
                                                label="Karta raqami"
                                                variant="underlined"
                                                @keyup.enter="sendCardData"
                                                v-model="cardNumber"
                                                v-maska:[optionscard]
                                                ></v-text-field>
                                            </div>
                                            <div class="card-data_expire">
                                            <v-text-field 
                                                v-model="expiry"
                                                v-maska:[optionsexpire]
                                                placeholder="oo/yy"
                                                @keyup.enter="sendCardData"
                                                label="Muddati" 
                                                variant="underlined"
                                            ></v-text-field>
                                        </div>
                                    </v-row>
                                </div>
                                <div v-else class="opt-input">
                                    <span class="otpmessage">{{  otpmessage || "Tasdiqlash kodini kiriting" }} </span>
                                    <v-otp-input 
                                        @finish="onFinish" 
                                        :loading="loading" 
                                        v-model="otp" 
                                        :length="otplength" 
                                        placeholder="0" 
                                    ></v-otp-input>
                                </div>
                            </v-card>
                        </v-window-item>
                    </v-window>
                    <div class="confirm">
                        <v-btn
                            variant="outlined"
                            rounded="xl"
                            @keyup.enter="sendCardData"
                            color="green"
                            :loading="loading"
                            @click="sendCardData"
                        >Accept</v-btn>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-app>
  </template>

  
  <script>
    import axios from 'axios'
    import { useToast } from "vue-toastification";
    import { VOtpInput } from 'vuetify/labs/VOtpInput';
    import { vMaska } from "maska"
    export default {
        directives: { maska: vMaska },
        components: {VOtpInput},
        data: () => ({
            cardNumber: "",
            expiry:"",
            isotp: false,
            otp: '',
            otplength: 4,
            isCardRequest: false,
            otpmessage: null,
            optionsexpire: { mask: '##/##' },
            optionscard: { mask: '#### #### #### ####' },
            paymentData: {},
            BaseUrl: "https://reposu.org/apiv1",
            loading: false,
            userData: {},
            length: 2,
            lang: 'uz',
            onboarding: 0,
            params: {
                service_id: {"uz": "Xizmat ID:", "ru": "Идентификатор услуги"},
                clientid: {"uz": "Telefon raqami:", "ru": "Номер телефона"},
                amount: {"uz": "Summa", "ru":"Сумма"},
                id_confirm: {"uz": "ID", "ru":"Идентификатор"}
            }
        }),
        methods: {
            async getUserData(){
                try {
                    this.loading = true
                    let params = {
                        "method": "users.get",
                        "params": {}
                    }
                    let response = await axios.post(this.BaseUrl, params, {headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "POST",
                        token: this.$route.query.token
                    }})
                    this.loading = false
                    if(response.data.success == false ){
                        this.toast.error(response.data.error.text[this.lang]) 
                        return
                    }
                    this.userData = response.data.result
                    console.log(response.data.result)
                } catch (error) {
                    this.loading = false
                    this.toast.error(error.message)
                }
            },
            async getCheckData(){
                try {
                    this.loading = true
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
                    this.loading = false
                    if(response.data.success == false ){
                        this.toast.error(response.data.error.text[this.lang]) 
                        return
                    }
                    if(!this.$store.state.item){
                        await this.getService(response.data.result.params.service_id)
                    } 
                    if(response.data.result.status == 'cancel') {
                        this.$router.push({
                            name: 'Status',
                            query: {cheque_id: this.$route.query.cheque_id, token: this.$route.query.token}
                        })
                    }
                    this.paymentData = response.data.result
                    this.isotp = response.data.result.status == 'verify'? true: false
                } catch (error) {
                    this.loading = false
                    this.toast.error(error.message)
                }
            },
            async getService (service_id){
                let params = {
                    "method": "cheque.getfield",
                    "params": {
                        "service_id": service_id
                    }
                }
                try { 
                    let response = await axios.post(this.BaseUrl, params, {headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "POST",
                        token: this.$route.query.token
                    }})
                    if(response.data.success == false ){
                        this.toast.error(response.data.error.text[this.lang]) 
                        return
                    }
                    this.$store.commit('createPayment', response.data.result)
                } catch (error) {
                    this.toast.error(error.message)
                }
            },
            async sendCardData () {
                this.loading = true
                let params = {
                    "method": "cheque.verify",
                    "params": {
                        "cheque_id": Number(this.$route.query.cheque_id),
                    }
                }
                if(this.onboarding == 1 && (this.cardNumber && this.expiry)) {
                    params.params.card =  this.cardNumber.replaceAll(' ', ''),
                    params.params.expire = this.expiry.split('/').reverse().join('')
                } else if(this.onboarding == 1){
                    this.loading = false
                    this.toast.warning('Karta ma\'lumotlarini to\'liq kiriting!') 
                    return
                }

                try { 
                    let response = await axios.post(this.BaseUrl, params, {headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "POST",
                        token: this.$route.query.token
                    }})
                    this.loading = false
                    if(response.data.success == false ){
                        this.toast.error(response.data.error.text[this.lang]) 
                        return
                    }
                    if(response.data.result.otp) {
                        this.isotp = true
                        this.otpmessage = response.data.result.text[this.lang]
                        this.otplength = response.data.result['length']
                    }
                } catch (error) {
                    this.loading = false
                    this.toast.error(error.message)
                }
            },
            async paymentAcceptOtp (otpp) {
                let params = {
                    "method": "cheque.pay",
                    "params": {
                        "cheque_id": this.paymentData.id,
                        "sms_code": otpp
                    }
                }
                try { 
                    let response = await axios.post(this.BaseUrl, params, {headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "POST",
                        token: this.$route.query.token
                    }})
                    if(response.data.success == false ){
                        this.toast.error(response.data.error.text[this.lang]) 
                        return
                    }
                    this.$router.push({
                        name: 'Status',
                        query: {cheque_id: this.$route.query.cheque_id, token: this.$route.query.token}
                    })
                } catch (error) {
                    this.toast.error(error.message)
                }
            },
            async onFinish (rsp) {
                this.loading = true
                this.paymentAcceptOtp(rsp).then(data=> {
                    this.loading = false
                }).catch(err=> {
                    this.toast.error(err.message)
                })
            },
            send(props) {
                console.log(props);
                if(props.class == 'v-window__right'){
                    this.isCardRequest = true
                } else {
                    this.isCardRequest = false
                }
                props.onClick()
            }
        },
        setup() {
            const toast = useToast();
            return { toast }
        },
        async mounted(){
            this.getUserData()
            this.getCheckData()
        }   
    }
  </script>
  
  <style scoped>

    .confirm{
        padding: 10px;
        display: flex;
        justify-content: center;
    }
    .paymentdata-params{
        display: flex;
        font-family: 'Inter,sans-serif';
        font-size: 15px;
        color: rgb(150, 141, 141);
        justify-content: space-between;
    }

    .otpmessage{
        margin: 10px auto;
        font-size: 14px;
        color: green;
    }

    .opt-input {
        display: flex;
        flex-direction: column;
    }

    .paymentdata-description {
        font-family: 'Inter,sans-serif'; font-size: 15px; color: var(--neutral-900);
    }
    .service-id{
        font-family: 'Inter,sans-serif';
    }

    .image{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }                               
    .continer {
        margin: 50px auto;;
        width: 75%;
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

    .card-data {
        display: flex;
        padding: 12px;
        align-items: center;
        justify-content: space-evenly;
    }
    
    .card-data_number{
        width: 65%;
    }

    .card-data_expire{
        width: 25%;
    }


    @media screen and (max-width: 1300px) {

        .card-data {
            display: flex;
            padding: 12px;
            flex-direction: column;
            align-items: center;
            justify-content: space-evenly;
        }

        .card-data_number{
            width: 70%;
        }

        .card-data_expire{
            width: 50%;
        }
    }  

    @media screen and (max-width: 1000px) {

        .card-data {
            display: flex;
            padding: 12px;
            flex-direction: column;
            align-items: center;
            justify-content: space-evenly;
        }

        .continer {
            padding: 10px;
            display: flex;
            flex-direction: column;
            width: 100%;
        }   

        .card-data_number{
            width: 100%;
            font-size-adjust: 10px;
        }

        .card-data_expire{
            width: 70%;
            font-size-adjust: 10px;
        }

        .continer-card {
            width: 100%;
        }
    }   
  </style>