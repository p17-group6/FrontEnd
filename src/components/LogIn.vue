<template>
    <div class="logIn_user">
        <div class="text">
            <h2>El mejor lugar para comprar tus cervezas favoritas</h2>
        </div>
        <div class="container_logIn">
            <form v-on:submit.prevent="processLogInUser" >
                <label for="Username">Username</label>
                <input type="text" v-model="user.username" placeholder="Username">
                <br>
                <label for="Password">Password</label>
                <input type="password" v-model="user.password" placeholder="Password">
                <br>
                <a href="#">¿Olvidaste tu contraseña?</a>
                <button type="submit">Iniciar Sesion</button>
            </form>
        </div>

    </div>

</template>



<script>
import axios from 'axios';

export default {
    name: "LogIn",

    data: function(){
        return {
            user: {
                username:"",
                password:""
            }
        }
    },

    methods: {
        processLogInUser: function(){
            axios.post(
                "https://mision-tic-bank-be.herokuapp.com/login/",
                this.user,
                {headers: {}}
                )
                .then((result) => {
                    let dataLogIn = {
                        username: this.user.username,
                        token_access: result.data.access,
                        token_refresh: result.data.refresh,
                    }

                    this.$emit('completedLogIn', dataLogIn)
                })
                .catch((error) => {

                    if (error.response.status == "401")
                        alert("ERROR 401: Credenciales Incorrectas.");

                });
        }
    }
}
</script>


<style>

    .logIn_user {
        margin: 0;
        padding: 50px 70px 5px 70px;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .text {
        color: #fff;
        grid-area: text;
        width: 520px;
        font-size: 35px;
        position: absolute;
        left: 5%;
    }

    .container_logIn {
        border-radius: 5px;
        position: absolute;
        right: 10%;
        width: 20%;
        height: 350px;
        background: white;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        grid-area: form;
        box-shadow: 0 0 20px 5px rgba(0,0,0, .8);
    }

    .logIn_user form{
        width: 80%;

    }

    .logIn_user input{
        height: 40px;
        width: 100%;

        box-sizing: border-box;
        padding: 10px 20px;
        margin: 5px 0;
        border: none;
        border-bottom: 1px solid #A2AECD;
    }

    .logIn_user input:nth-child(2) {
        margin: 0 0 30px 0;
    }

    a {
        text-decoration: none;
        color: #2D3344;
        font-size: 13px;
        display: flex;
        justify-content: center;
        margin: 5px 0 20px 0;
    }

    .logIn_user button{
        width: 100%;
        height: 40px;

        color: #E5E7E9;
        background: #2D3344;
        border: none;
        font-family: 'Montserrat';
        font-weight: 500;

        border-radius: 5px;
        padding: 10px 25px;
        margin: 5px 0;
    }

    .logIn_user button:hover{
        color: #E5E7E9;
        background: #3d4d77;

    }

</style>