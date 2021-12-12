<template>
	<div id="app" class="app">
		<div class="background"></div>
		<header class="header">
			<router-link to="/">
				<img src="./assets/img/bodega-logo-white.svg" class="logo" width="200" />
			</router-link>
			<label class="icon" for="menu"><i class="fas fa-bars"></i></label>
			<input id="menu" name="menu" @change="collapseMenu" class="menu" type="checkbox" />
			<nav class="nav" ref="nav">
				<router-link v-if="isAuth" to="/products"> Cervezas </router-link>
				<!-- <router-link v-if="isAuth"> Pack </router-link>
				<router-link v-if="isAuth"> Nosotros </router-link> 
				<router-link v-if="isAuth" to="/contact"> Contacto </router-link> -->
				<router-link class="link" v-if="isAuth" to="/signIn" @click="logOut">
					Logout
				</router-link>
				<router-link class="link" v-if="!isAuth" to="/signUp">
					Registrarse
				</router-link>
				<router-link class="link" v-if="!isAuth" to="/signIn">
					Iniciar Sesion
				</router-link>
			</nav>
		</header>
		<main class="main-component">
			<router-view @completedLogin="completedLogin"> </router-view>
		</main>
	</div>
</template>

<script>
export default {
	name: "App",
	computed: {
		isAuth: {
			get() {
				return this.$route.meta.requiresAuth;
			},
			set() {}
		}
	},
	components: {},
	methods: {
		collapseMenu(ev) {
			const items = this.$refs.nav.childNodes;
			items.forEach(item => {
				item.addEventListener("click", e => {
					ev.target.checked = false;
				});
			});
		},
		logOut() {
			localStorage.clear();
			alert("Sesion terminada");
			this.$router.push("/signIn");
		},
		completedLogin(data) {
			// console.log(data);
			localStorage.setItem("username", data.username);
			localStorage.setItem("tokenRefresh", data.tokenRefresh);
			localStorage.setItem("tokenAccess", data.tokenAccess);
			alert("Autenticacion exitosa");
			this.$router.push("/products");
		}
	},
	emits: ["completedLogin"]
};
</script>

<style>
*,
*::before,
*::after {
	margin: 0;
	padding: 0;
	box-sizing: inherit;
}

html {
	box-sizing: border-box;
}

body {
	font-family: "Montserrat";
	background: #000;
}

.app {
	overflow-x: hidden;
	width: 100%;
	height: 100vh;
}

::-moz-selection,
::selection {
	background-color: #2837479f;
}

.background {
	background-image: url("./assets/img/bodega-background.jpg");
	height: calc(100vh);
	width: 100%;
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	position: absolute;
	z-index: -1;
	filter: blur(5px);
	-webkit-filter: blur(5px);
}

.header {
	padding: 10px 70px 10px 70px;
	width: 100vw;
	color: #e5e7e9;
	background-color: rgba(0, 0, 0, 0.2);
	position: sticky;
	z-index: 2;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
}

.header .nav {
	display: flex;
	height: 100%;
	flex: 0.6;
	justify-content: space-around;
	align-items: center;
}

.header .nav a {
	color: #fff;
	padding: 20px;
	font-weight: bold;
	cursor: pointer;
}
.header .nav .link {
	color: #e5e7e9;
	cursor: pointer;
	text-decoration: none;
	background: #000000a1;
	border: none;
	position: relative;
	text-align: center;
}

.header .nav .link:hover {
	color: #ffffff;
	background: #000000;
	border: none;
}

.icon,
.menu {
	display: none;
}

form button {
	width: 100%;
	margin: 15px 0px;
	height: 40px;
	border: none;
	border-radius: 5px;
	color: #fff;
	font-weight: bold;
	background: #283747;
}

form button:hover {
	background: #283747ce;
}

form button:active {
	background: #2837479f;
}

@media only screen and (max-width: 900px) {
	.header .nav {
		display: none;
		flex-direction: column;
		align-items: center;
		justify-content: initial;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		top: 100%;
		width: 100%;
	}

	.menu[type="checkbox"]:checked ~ .nav {
		display: flex;
	}

	.icon {
		display: block;
		cursor: pointer;
		font-size: 24px;
	}

	.header .nav .link {
		width: 100%;
	}
}
</style>
