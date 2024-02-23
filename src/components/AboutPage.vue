<!-- AboutPage.vue -->
<template>
  <div>
    <h2>About Page</h2>
    <p>This is the About page content.</p>
    <button @click="getPhone">{{phone}}</button>
  </div>
</template>

<script>
import {
  openWebURL
} from '../services/apis'
export default {
  name: 'AboutPage', // Đổi tên component thành AboutPage
  data(){
    return {
      phone:"lay so"
    }
  },
  methods:{
    getPhone(){
      this.phone = openWebURL();
    }
  }
}
</script>