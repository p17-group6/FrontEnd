<template>

    <div class="signUp_user">
        <div class="text">
            <h2>El mejor lugar para comprar tus cervezas favoritas</h2>
        </div>
        <div class="container_signUp">

            <form v-on:submit.prevent="processSignUp" >
                <label for="Username">Username</label>
                <input type="text" v-model="user.username" placeholder="Username">
                <br>

                <label for="Username">Password</label>
                <input type="password" v-model="user.password" placeholder="Password">
                <br>

                <label for="Username">Name</label>
                <input type="text" v-model="user.name" placeholder="Name">
                <br>

                <label for="Username">Email</label>
                <input type="email" v-model="user.email" placeholder="Email">
                <br>

                <button type="submit">Registrarse</button>
            </form>
        </div>

    </div>

</template>




<script>
import axios from 'axios';

export default {
    name: "SignUp",

    data: function(){
        return {
            user: {
                username: "",
                password: "",
                name: "",
                email: "",
                account: {
                    lastChangeDate: (new Date()).toJSON().toString(),
                    balance: 0,
                    isActive: true
                }
            }
        }
    },

    methods: {
        processSignUp: function(){
            axios.post(
                "https://mision-tic-bank-be.herokuapp.com/user/",
                this.user,
                {headers: {}}
            )
                .then((result) => {
                    let dataSignUp = {
                        username: this.user.username,
                        token_access: result.data.access,
                        token_refresh: result.data.refresh,
                    }

                    this.$emit('completedSignUp', dataSignUp)
                })
                .catch((error) => {
                    console.log(error)
                    alert("Erroe en el resgistro.");


                });
        }
    }
}
</script>

<style>

    .text {
            color: #fff;
            grid-area: text;
            width: 520px;
            font-size: 35px;
            position: absolute;
            left: 5%;
        }

    .signUp_user{
        margin: 0;
        padding: 50px 70px 5px 70px;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .container_signUp {
        border-radius: 5px;
        position: absolute;
        right: 10%;
        width: 22%;
        height: 470px;
        background: white;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-shadow: 0 0 20px 5px rgba(0,0,0, .8);
    }

    .signUp_user form{
        width: 80%;
        margin-top: 20px;

    }

    .signUp_user input:nth-child(n + 2) {
        margin: 0 0 30px 0;
    }

    .signUp_user input{
        height: 40px;
        width: 100%;

        box-sizing: border-box;
        padding: 10px 20px;
        margin: 5px 0;
        border: none;
        border-bottom: 1px solid #A2AECD;
    }

    .signUp_user button{
        width: 100%;
        height: 40px;

        color: #E5E7E9;
        background-image: #283747;
        border: 1px solid #E5E7E9;

        border-radius: 5px;
        padding: 10px 25px;
        margin: 5px 0 25px 0;

        font-family: 'Montserrat';
        font-weight: 500;
    }

    .signUp_user button:hover{
        color: #E5E7E9;
        background: #3d4d77;
        border: 1px solid #283747;
    }

</style>