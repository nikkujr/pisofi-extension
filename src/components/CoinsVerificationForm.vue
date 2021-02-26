<template>
    <form @submit.prevent="submitForm" class="mt-8 space-y-6" action="#" method="POST">
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="verification_code">Verification Code</label>
          <input v-model="verification_code" id="verification_code" name="verification_code" type="text" autocomplete="username" required class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 text-2xl font-bold text-center focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Verification Code">
        </div>
      </div>
      <div v-if="error && error.length" class="bg-red-400 border-red-700 border-l-4 text-red p-4" role="alert">
        <p class="font-bold">Error</p>
        <p>Verification code is incorrect.</p>
      </div>
      <div>
      
      <div>
        <button :disabled="busy" type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M17.218,2.268L2.477,8.388C2.13,8.535,2.164,9.05,2.542,9.134L9.33,10.67l1.535,6.787c0.083,0.377,0.602,0.415,0.745,0.065l6.123-14.74C17.866,2.46,17.539,2.134,17.218,2.268 M3.92,8.641l11.772-4.89L9.535,9.909L3.92,8.641z M11.358,16.078l-1.268-5.613l6.157-6.157L11.358,16.078z"></path>
            </svg>
          </span>
          Verify
        </button>
      </div>

      <p class="p-4 text-center">Did not received verification code?</p>
      <div class="flex space-x-4 py-2">
        <div class="flex-1">
            <button @click="requestCode('sms')" :disabled="busy" type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-green-500 group-hover:text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M13.372,1.781H6.628c-0.696,0-1.265,0.569-1.265,1.265v13.91c0,0.695,0.569,1.265,1.265,1.265h6.744c0.695,0,1.265-0.569,1.265-1.265V3.045C14.637,2.35,14.067,1.781,13.372,1.781 M13.794,16.955c0,0.228-0.194,0.421-0.422,0.421H6.628c-0.228,0-0.421-0.193-0.421-0.421v-0.843h7.587V16.955z M13.794,15.269H6.207V4.731h7.587V15.269z M13.794,3.888H6.207V3.045c0-0.228,0.194-0.421,0.421-0.421h6.744c0.228,0,0.422,0.194,0.422,0.421V3.888z"></path>
                </svg>
            </span>
            Request By SMS
            </button>
        </div>
        <div class="flex-1">
            <button @click="requestCode('email')" :disabled="busy" type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-yellow-500 group-hover:text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M17.388,4.751H2.613c-0.213,0-0.389,0.175-0.389,0.389v9.72c0,0.216,0.175,0.389,0.389,0.389h14.775c0.214,0,0.389-0.173,0.389-0.389v-9.72C17.776,4.926,17.602,4.751,17.388,4.751 M16.448,5.53L10,11.984L3.552,5.53H16.448zM3.002,6.081l3.921,3.925l-3.921,3.925V6.081z M3.56,14.471l3.914-3.916l2.253,2.253c0.153,0.153,0.395,0.153,0.548,0l2.253-2.253l3.913,3.916H3.56z M16.999,13.931l-3.921-3.925l3.921-3.925V13.931z"></path>
                </svg>
            </span>
            Request By Email
            </button>
        </div>
      </div>
      <hr>
        <div class="py-2 text-center">
            <token-remover @onDataCleared="onDataCleared"></token-remover>
        </div>

    </form>
</template>

<script>

import axios from 'axios';
import TokenRemover from './TokenRemover.vue';

const instance = axios.create({
  crossDomain: true,
  withCredentials: true,
  baseURL: 'https://api.coins.asia'
});

export default {
  name: 'CoinsVerificationForm',
  components: { TokenRemover },
  props: ['token'],
  data() {
    return { 
      verification_code: '',
      error: '',
      busy: false
    }
  },
  methods: {
    submitForm() {
      console.log(this);

      let payload = {
        device_type: "mobile",
        access_code: this.verification_code
      };

      this.busy = true;
      this.error = '';

      instance.post('/v5/jwt/verify', payload, {
          headers: { 
              Authorization: `Bearer ${this.token}`,
              Referer: `https://apps.coins.ph`,
         }
      })
        .then(response => {
          console.log(response);
          if (response && response.data && response.data.token) {
            this.$emit('onVerified', response.data.token );
          } else {
            this.error = 'Username / Password is incorrect. Please try again.';
          }
        })
        .catch((err) => {
          console.log(err);
          this.error = 'Username / Password is incorrect. Please try again.';
        })
        .finally(() => {
          this.busy = false;
        })
    },
    requestCode(type) {
        let payload = {
            "tfa_type": type
        };

      this.busy = true;
      this.error = '';

      instance.post('/v5/tfa/access-code', payload, {
          headers: { Authorization: `Bearer ${this.token}` }
      })
        .then(response => {
          console.log(response);
          let message = 'Verification code has been sent to your ' + (type == "sms" ? "Phone" : "Email");
          alert(message);
        })
        .catch((err) => {
          console.log("Error", err);
          if (err.errors && err.errors.non_field_errors) {
              this.error = err.errors.non_field_errors[0].message || 'Please try again.';
          }
        })
        .finally(() => {
          this.busy = false;
        })
    },
    onDataCleared() {
        this.$emit('onReset', true);
    }
  }
}
</script>

<style>

</style>
