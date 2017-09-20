<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  height:100%;
  min-width: 1000px;
}
ul,li{
  list-style: none;
}
#app{
	background-image:url('./assets/background.jpg');
	background-repeat: no-repeat;
	background-size: 100% 100%;
  position: relative;
}
</style>
