<template>
  <div class="p-1">
    <div class="py-2">
        <h1 class="text-center">Please login using coins.ph website</h1>
    </div>
    <a href="https://app.coins.ph/welcome/login" target="_blank" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      <span class="absolute left-0 inset-y-0 flex items-center pl-3">
        <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
        </svg>
      </span>
      Sign in to Coins.ph
    </a>
    <div class="mt-2 shadow-md bg-yellow-200 border-yellow-600 border-l-4 text-red p-4" role="alert">
        <p class="font-bold">Important!</p>
        <p>After you login to your account using coins.ph website, click this extension again to synch data to your machine</p>
    </div>
  </div>
</template>

<script>

import axios from 'axios';

const instance = axios.create({
  crossDomain: true,
  withCredentials: true,
  baseURL: 'https://api.coins.asia'
});

export default {
  name: 'CoinsLoginForm',
  components: {  },
  data() {
    return { 
      username: '',
      password: '',
      error: '',
      token: '',
      busy: false
    }
  },
  methods: {
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
    }
  }
}
</script>

<style>

</style>
