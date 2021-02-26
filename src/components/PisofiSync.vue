<template>
    <div>
        
      <div v-if="error && error.length" class="bg-red-400 mb-3 border-red-700 border-l-4 text-red p-4" role="alert">
        <p class="font-bold">Error</p>
        <p>{{ error }}</p>
      </div>

      <div class="p-4 mb-3 border-green-700 border-l-4 bg-green-400" v-if="busy">
          <p>Processing...</p>
      </div>

    <button @click="sync" :disabled="busy" type="button" class="group relative w-full flex mb-2 justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
        <span class="absolute left-0 inset-y-0 flex items-center pl-3">
        <svg class="h-5 w-5 text-green-500 group-hover:text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M12.319,5.792L8.836,2.328C8.589,2.08,8.269,2.295,8.269,2.573v1.534C8.115,4.091,7.937,4.084,7.783,4.084c-2.592,0-4.7,2.097-4.7,4.676c0,1.749,0.968,3.337,2.528,4.146c0.352,0.194,0.651-0.257,0.424-0.529c-0.415-0.492-0.643-1.118-0.643-1.762c0-1.514,1.261-2.747,2.787-2.747c0.029,0,0.06,0,0.09,0.002v1.632c0,0.335,0.378,0.435,0.568,0.245l3.483-3.464C12.455,6.147,12.455,5.928,12.319,5.792 M8.938,8.67V7.554c0-0.411-0.528-0.377-0.781-0.377c-1.906,0-3.457,1.542-3.457,3.438c0,0.271,0.033,0.542,0.097,0.805C4.149,10.7,3.775,9.762,3.775,8.76c0-2.197,1.798-3.985,4.008-3.985c0.251,0,0.501,0.023,0.744,0.069c0.212,0.039,0.412-0.124,0.412-0.34v-1.1l2.646,2.633L8.938,8.67z M14.389,7.107c-0.34-0.18-0.662,0.244-0.424,0.529c0.416,0.493,0.644,1.118,0.644,1.762c0,1.515-1.272,2.747-2.798,2.747c-0.029,0-0.061,0-0.089-0.002v-1.631c0-0.354-0.382-0.419-0.558-0.246l-3.482,3.465c-0.136,0.136-0.136,0.355,0,0.49l3.482,3.465c0.189,0.186,0.568,0.096,0.568-0.245v-1.533c0.153,0.016,0.331,0.022,0.484,0.022c2.592,0,4.7-2.098,4.7-4.677C16.917,9.506,15.948,7.917,14.389,7.107 M12.217,15.238c-0.251,0-0.501-0.022-0.743-0.069c-0.212-0.039-0.411,0.125-0.411,0.341v1.101l-2.646-2.634l2.646-2.633v1.116c0,0.174,0.126,0.318,0.295,0.343c0.158,0.024,0.318,0.034,0.486,0.034c1.905,0,3.456-1.542,3.456-3.438c0-0.271-0.032-0.541-0.097-0.804c0.648,0.719,1.022,1.659,1.022,2.66C16.226,13.451,14.428,15.238,12.217,15.238"></path>
        </svg>
        </span>
        Sync to PisoFi
    </button>
    <token-remover @onDataCleared="onDataCleared"></token-remover>
    </div>
</template>

<script>

import axios from 'axios';
import TokenRemover from './TokenRemover.vue';

const instance = axios.create({
  crossDomain: true,
  withCredentials: true,
  baseURL: 'http://10.0.01.'
});

export default {
  name: 'PisofiSync',
  components: { TokenRemover  },
  props: ['accessToken'],
  data() {
    return {
      busy: false,
      error: ''
    }
  },
  methods: {
    sync() {
        this.busy = true;
        this.error = '';
        let payload = {
            accessToken: this.accessToken
        };
        instance.post('/api/v1/pkrycns', payload, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
        .then(response => {
          if (response && response.data && response.data.status) {
            this.$emit('onSynched', true);
          } else {
            this.error = 'Failed to synch coins.ph account to PisoFi. Make sure you are connected to the system.';
          }
        })
        .catch((err) => {
          console.log(err);
          this.error = 'Failed to synch coins.ph account to PisoFi. Make sure you are connected to the system.';
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
