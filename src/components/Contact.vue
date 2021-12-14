<template>
	<div class="containerContact">
		<div class="containerForm">
			<form v-on:submit.prevent="processAbout">
				<label for="contact" class="c">Nombre</label>
				<input type="text" v-model="contact" />
				<br />
				<label for="contact" class="c">Correo</label>
				<input type="email" v-model="contact" />
				<br />
				<label for="contact" class="c">Detalles Adicionales</label>
				<textarea
					class="t-contact"
					name="Comment"
					id=""
					cols="30"
					rows="10"
					placeholder="Comentarios"
				></textarea>
				<button type="submit" class="b">Enviar</button>
			</form>
		</div>
	</div>
</template>

<style scoped>
.containerContact {
	width: 100%;
	padding: 40px 0px;
	height: 600px;
	display: flex;
	justify-content: center;
}

.containerForm {
	width: 600px;
	height: 100%;
	display: flex;
	border-radius: 10px;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-image: linear-gradient(30deg, #1e2026, #2a3655);
	padding: 0 20px 0 20px;
	box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.205);
}

form {
	width: 100%;
}
.c {
	padding: 10px 0 5px 0;
	display: inline-block;
	color: #ffffff;
}
form input {
	width: 100%;
	padding: 5px;
	height: 40px;
	outline: none;
	background: none;
	border: none;
	border-bottom: 1px solid #a2aecd;
	color: #a2aecd;
}

form textarea {
	outline: none;
}

.t-contact {
	resize: vertical;
	margin-top: 10px;
	width: 100%;
	max-height: 20px;
	min-height: 150px;
	font-family: "Montserrat";
	padding: 10px;
	font-size: 15px;
	background: none;
	border-radius: 5px;
	border: 1px solid #a2aecd;
	color: #a2aecd;
}

form button {
	width: 100%;
	margin: 15px 0;
	height: 40px;
	border: none;
	color: #fff;
	font-family: "Montserrat";
	font-weight: bold;
	background: #3f88eb;
	cursor: pointer;
}
</style>
