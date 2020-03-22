<template>
  <div id="app">
    <h1>{{title}}</h1>
    <img src="../../assets/moive.png">
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: 'user page'
    }
  }
}
</script>

<style lang="less">
  #app{
    color: blue;
    img{
      width: 800px;
    }
  }
</style>

