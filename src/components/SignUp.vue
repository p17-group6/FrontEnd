<template>
	<div class="signUp">
		<div class="title">
			<h2>El mejor lugar para comprar tus cervezas favoritas</h2>
		</div>
		<div class="container">
			<Form @submit="handleRegister" :validation-schema="schema">
				<div class="form-group">
					<label for="username">Username</label>
					<i class="fas fa-user"></i>

					<Field type="text" name="username" />
					<ErrorMessage name="username" v-slot="{ message }">
						<span v-if="message" class="error">
							<el-tooltip :content="message" placement="top">
								<i class="fas fa-exclamation-circle"></i>
							</el-tooltip>
						</span>
					</ErrorMessage>
				</div>
				<div class="form-group">
					<label for="Password">Password</label>
					<i class="fas fa-unlock-alt"></i>
					<Field type="password" name="password" />
					<ErrorMessage name="password" v-slot="{ message }">
						<span v-if="message" class="error">
							<el-tooltip :content="message" placement="top">
								<i class="fas fa-exclamation-circle"></i>
							</el-tooltip>
						</span>
					</ErrorMessage>
				</div>
				<div class="form-group">
					<label for="email">Email</label>
					<i class="fas fa-envelope"></i>

					<Field type="text" name="email" />
					<ErrorMessage name="email" v-slot="{ message }">
						<span v-if="message" class="error">
							<el-tooltip :content="message" placement="top">
								<i class="fas fa-exclamation-circle"></i>
							</el-tooltip>
						</span>
					</ErrorMessage>
				</div>
				<button type="submit">Registrarse</button>
			</Form>
		</div>
	</div>
</template>

<script>
import { ElTooltip } from "element-plus";
import { Form, Field, ErrorMessage } from "vee-validate";
import gql from "graphql-tag";
import * as yup from "yup";

export default {
	name: "SignUp",
	data() {
		const schema = yup.object().shape({
			username: yup.string().required("Campo requerido!"),
			password: yup.string().required("Campo requerido!"),
			email: yup
				.string()
				.email("Ingresa un correo valido!")
				.required("Campo requerido!")
		});
		return {
			schema
		};
	},
	components: {
		Form,
		Field,
		ErrorMessage,
		ElTooltip
	},
	methods: {
		async handleRegister(data) {
			// console.log(data);
			await this.$apollo
				.mutate({
					mutation: gql`
						mutation SignUp($userInput: SignUp) {
							signUp(userInput: $userInput) {
								id
							}
						}
					`,
					variables: {
						userInput: data
					}
				})
				.then(res => {
					let message = `Usuario creado exitosamente, id: ${res.data.signUp.id}`;
					alert(message);
					this.$router.push("/signIn");
				})
				.catch(error => {
					console.error(error);
					alert("ERROR 401: Credenciales Incorrectas.");
				});
		}
	}
};
</script>

<style scoped>
.signUp {
	padding: 70px 60px;
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: space-between;
}

.title {
	display: inline-block;
	color: #fff;
	flex: 0.5;
	font-size: 35px;
	-webkit-text-size-adjust: auto;
}

.container {
	flex: 0.4;
	display: flex;
	max-width: 300px;
	min-width: 250px;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: white;
	border-radius: 8px;
	box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.8);
}

.container form {
	padding: 15px 0px;
	width: 80%;
}

.form-group label {
	font-style: italic;
}

.form-group input {
	height: 40px;
	width: 85%;
	padding: 5px 10px;
	border: none;
	outline: none;
	border-bottom: 1px solid #a2aecd;
	margin-bottom: 30px;
}

.fa-user,
.fa-envelope,
.fa-unlock-alt {
	color: #3d4d77;
	margin-left: 10px;
}

.fa-exclamation-circle {
	color: orangered;
}

.error {
	display: inline;
}

.container button {
	cursor: pointer;
	width: 100%;
	color: #e5e7e9;
	background: #2d3344;
	border: none;
	font-weight: 500;

	border-radius: 5px;
	padding: 10px 25px;
	margin: 5px 0;
}

.container button:hover {
	color: #e5e7e9;
	background: #3d4d77;
}

@media only screen and (max-width: 1100px) {
	.title {
		font-size: 30px;
	}
}

@media only screen and (max-width: 900px) {
	.title {
		font-size: 26px;
	}
}

@media only screen and (max-width: 600px) {
	.signIn {
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.title {
		padding-bottom: 40px;
	}
}
</style>
