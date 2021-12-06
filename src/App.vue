<template>
  <div id="app" class="app">
    <div class="img">
    </div>
    <div class="header">
      
      <img src="./imgs/LaBodegaLogo.svg" class="logo" width="200">

      <nav>
        <a v-if="is_auth" > Cervezas </a>
        <a v-if="is_auth" > Pack </a>
        <a v-if="is_auth" > Nosotros </a>
        <a v-if="is_auth" v-on:click="LoadContact"> Contacto </a>
        <button v-if="is_auth" v-on:click="loadSignUp" > SingUp </button>
        <button v-if="is_auth" v-on:click="loadLogIn" > LogIn </button>
      </nav>
    </div>

    <div class="main-component">
      <router-view
        v-on:completedLogIn="completedLogIn"
        v-on:completedSignUp="completedSignUp"
        v-on:completedAbout="completedContact"
      >
      </router-view>
    </div>

  </div>
</template>




<script>
export default {
  name: 'App',

  data: function(){
      return{
        is_auth: true
      }
  },

  components: {
  },

  methods:{
    verifyAuth: function() {
      if(this.is_auth == false)
        this.$router.push({name: "logIn"})
    },

    loadLogIn: function(){
      this.$router.push({name: "logIn"})
    },

    loadSignUp: function(){
      this.$router.push({name: "signUp"})
    },

    loadContact: function(){
      this.$router.push({name: "Contact"})
    },

    completedLogIn: function(data) {},

    completedSignUp: function(data) {},
    
    completedContact: function(data) {},

  },

  created: function(){
    this.verifyAuth()
  }

}


</script>

<style>
  * {
    box-sizing: border-box;
  }
  body{
    margin: 0 0 0 0;
    font-family: 'Montserrat';
    background: #000;
  }

  .app {
    display: grid;
    width: 100%;
    height: 100vh;
    grid-template-rows: 20% 80%;
    grid-template-areas: "header"
                         "main-component"
  }

  .img {
    background-image: url("./imgs/BgBeer.jpg");
    height: 100vh;
    width: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: absolute;
    z-index: -1;

    filter: blur(5px);
    -webkit-filter: blur(5px);
  }

  .header{
    margin: 0%;
    padding: 30px 70px 20px 70px;
    width: 100vw;
    color:#E5E7E9  ;
    position: absolute;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    grid-area: header;
  }

  .header nav {
    height: 100%;
    width: 60%;

    display: flex;
    justify-content: space-around;
    align-items: center;

    font-size: 20px;
  }

  .header nav a {
    color: #fff;
    padding: 20px;
    font-weight: bold;
    cursor: pointer;
  }
  .header nav button{
    color: #E5E7E9;
    background: #000000a1;
    border: none;
    padding: 18px 25px;
    position: relative;
    bottom: 7px;
  }

  .header nav button:hover{
    color: #ffffff;
    background: #000000;
    border: none;
  }

  
  .main-component{
    height: 75vh;
    margin: 0%;
    padding: 0%;
    grid-area: main-component;
  }
</style>
