<template>
    <form @submit.prevent="submitForm" class="mt-8 space-y-6" action="#" method="POST">
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="username" class="sr-only">Email address / Phone Number</label>
          <input v-model="username" id="username" name="username" type="text" autocomplete="username" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email / Phone">
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input v-model="password" id="password" name="password" type="password" autocomplete="current-password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password">
        </div>
      </div>
      <div v-if="error && error.length" class="bg-red-400 border-red-700 border-l-4 text-red p-4" role="alert">
        <p class="font-bold">Error</p>
        <p>Username / Password is incorrect.</p>
      </div>
      <div>
        <button :disabled="busy" type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
          </span>
          Sign in
        </button>
      </div>
    </form>
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
    isEmail(email) {
        return /\S+@\S+\.\S+/.test(email)
    },
    submitForm() {

      let username = this.username;
      if (!this.isEmail(this.username)) {
        if (this.username.length === 11) {
          username = "+63" + this.username.substring(0);
        }
      }

      let payload = {
        username: username,
        password: this.password,
        region: 'ph'
      };

      this.busy = true;
      this.error = '';

      instance.post('/v5/jwt/login', payload)
        .then(response => {
          console.log(response);
          if (response && response.data && response.data.token) {
            this.token = response.data.token;
            this.$emit('onLoggedIn', response.data.token);
            this.requestCode('sms');
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
    }
  }
}
</script>

<style>

</style>
