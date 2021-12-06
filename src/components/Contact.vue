<template>
    <div class="containerContact">
        <div class="containerForm">
            <form v-on:submit.prevent="processAbout">
                <label for="contact" class="c">Name</label>
                <input type="text" v-model="contact" placeholder="name">
                <br>
                <label for="contact" class="c">Email</label>
                <input type="email" v-model="contact" placeholder="email">
                <br>
                <label for="contact" class="c">Additional details</label>
                <textarea name="Comment" id="" cols="30" rows="10" placeholder="comments"></textarea>
                <button type="submit" class="b">Submit</button>
            </form>
        </div>
    </div>
</template>


<style>
    
    .containerContact {
        width: 100%;
        height: 410px;
        display: flex;
        justify-content: center;
    }

    .containerForm {
        width: 500px;
        height: 470px;
        display: flex;
        border-radius: 10px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: #fff;
        padding: 0 20px 0 20px;
        box-shadow: 0 0 20px 5px rgba(0,0,0, .8);
    }

    form {
        width: 100%;
    }
    .c{
        padding: 10px 0 5px 0;
        display: inline-block;
        color: #46CDCF;
    }
    form input {
        width: 100%;
        padding: 5px;
        height: 40px;
        border: none;
        border-bottom: 1px solid #A2AECD;
    }

    textarea{
      resize: vertical;
      width: 100%;
      max-height: 20px;
      min-height:150px;
      font-family: 'Montserrat';
      padding: 10px;
      font-size: 15px;
    }

    form button {
        width: 100%;
        margin: 15px 0;
        height: 40px;
        border: none;
        color: #fff;
        font-family: 'Montserrat';
        font-weight: bold;
        background: #283747;
    }
</style>