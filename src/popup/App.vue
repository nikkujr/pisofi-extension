<template>
<div class="min-h-screen flex items-center justify-center bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-4">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Coins -> PisoFi Sync
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        This will sync your account with PisoFi.
      </p>
    </div>

    <coins-login-form v-if="!token && !accessToken" @onLoggedIn="onLoggedIn"></coins-login-form>
    <coins-verification-form v-if="token && !accessToken" :token="token" @onReset="onReset" @onVerified="onVerified"></coins-verification-form>
    <pisofi-sync v-if="accessToken && token" :accessToken="accessToken" @onReset="onReset" @onSynched="onSynched"></pisofi-sync>
  </div>
</div>

</template>

<script>

import CoinsLoginForm from '../components/CoinsLoginForm.vue';
import CoinsVerificationForm from '../components/CoinsVerificationForm.vue';
import PisofiSync from '../components/PisofiSync.vue';

export default {
  name: 'App',
  components: { CoinsLoginForm, CoinsVerificationForm, PisofiSync },
  data() {
    return {
      token: '',
      accessToken: ''
    }
  },
  methods: {
    onLoggedIn(token) {
      console.log("Token Received", token);
      this.token = token;
      chrome.storage.local.set({token: token}, function() {
        console.log("Token has been updated");
      });
    },
    onVerified(accessToken) {
      console.log("Verified");
      console.log(accessToken);
      this.accessToken = accessToken;
      
      chrome.storage.local.set({accessToken: accessToken}, function() {
        console.log("Access Token has been updated");
      });
    },
    onReset() {
      this.token = null;
      this.accessToken = null;
    },
    onSynched() {
      alert('Account has been synched :)');
    }
  },
  mounted() {
    var self = this;
    console.log("Mounted");
    chrome.storage.local.get('token', function(result) {
      self.token = result.token || '';
      console.log(result);
    });
    chrome.storage.local.get('accessToken', function(result) {
      self.accessToken = result.accessToken || '';
      console.log(result);
    });
  }
}
</script>

<style>
html {
  width: 400px;
  height: 400px;
}

/* purgecss start ignore */
@tailwind base;
@tailwind components;
/* purgecss end ignore */

@tailwind utilities;

</style>
