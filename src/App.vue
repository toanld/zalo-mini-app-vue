<template>
  <div id="app">
    <router-link to="/about">About</router-link>
    <router-view></router-view>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body {
  background-color: white; /* Đặt màu nền trắng */
  margin: 0; /* Loại bỏ khoảng cách xung quanh trang */
  padding: 0; /* Loại bỏ khoảng cách bên trong trang */
}
</style>
