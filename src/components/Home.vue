<template>
	<section class="hero">
		<div class="hero__background"></div>
		<div class="hero__title">
			<h1>Hoy cervezas importadas con el 20% de descuento</h1>
		</div>
		<div class="hero__subtitle">
			<h3>Hola! {{ userDetailsById.username.toUpperCase() }}</h3>
		</div>
	</section>
	<section class="section">
		<SectionProducts />
	</section>
</template>
<script>
import jwt_decode from "jwt-decode";
import gql from "graphql-tag";

import SectionProducts from "./SectionProducts.vue";

export default {
	name: "Home",
	data() {
		return {
			userId: jwt_decode(localStorage.getItem("tokenRefresh")).user_id,
			userDetailsById: {}
		};
	},
	components: { SectionProducts },
	apollo: {
		userDetailsById: {
			query: gql`
				query UserDetailsById($userId: Int!) {
					userDetailsById(userId: $userId) {
						username
					}
				}
			`,
			variables() {
				return {
					userId: this.userId
				};
			}
		}
	},
	created() {
		this.$apollo.queries.userDetailsById.refetch();
	}
};
</script>
<style scoped>
.hero {
	position: relative;
	width: 100%;
	height: 100%;
}

.hero__background {
	background-image: linear-gradient(to bottom left, rgba(0, 0, 0, 0.6) 10%, rgba(0, 0, 0, 0.3)),
		url("../assets/img/home-background.jpg");
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center;
	filter: blur(2px);
	height: 500px;
	clip-path: circle(80.7% at 59% 0%);
}

.hero__title {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 40%;
	color: white;
	font-family: "Sans-serif";
	font-size: 32px;
	text-shadow: 1px 1px 2px black;
	transform: translate(0%, -50%);
}

.hero__subtitle {
	position: absolute;
	top: 50%;
	left: 10%;
	width: 40%;
	color: white;
	font-family: "Sans-serif";
	font-size: 32px;
	text-shadow: 1px 1px 2px black;
	transform: translate(0%, -50%);
}
</style>
