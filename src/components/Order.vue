<template>
	<div class="order">
		<div class="order__logo">
			<router-link to="/">
				<img src="../assets/img/bodega-logo-black.svg" class="logo" width="200" />
			</router-link>
		</div>
		<p v-if="!product">Loading...</p>
		<div v-else class="order__form">
			<Form @submit="handleAddOrder" :validation-schema="schema">
				<div class="form-group">
					<Field name="productId" type="text" v-model="product.id" v-slot="{ field }">
						<input v-bind="field" disabled />
					</Field>
				</div>
				<div class="form-group">
					<Field name="username" type="text" v-model="product.username" v-slot="{ field }">
						<input v-bind="field" disabled />
					</Field>
				</div>
				<div class="form-group">
					<Field name="name" type="text" v-model="product.name" v-slot="{ field }">
						<input v-bind="field" disabled />
					</Field>
				</div>
				<div class="form-group">
					<Field name="quantity" type="number" placeholder="Cantidad" />
					<ErrorMessage name="quantity" v-slot="{ message }">
						<span v-if="message" class="error">
							<el-tooltip :content="message" placement="top">
								<i class="fas fa-exclamation-circle"></i>
							</el-tooltip>
						</span>
					</ErrorMessage>
				</div>
				<button type="submit">Agregar</button>
			</Form>
		</div>
	</div>
</template>
<script>
import gql from "graphql-tag";
import jwt_decode from "jwt-decode";

import { ElTooltip } from "element-plus";
import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
	name: "Order",
	props: ["id"],
	data() {
		const schema = yup.object().shape({
			quantity: yup.mixed().required("El campo cantidad es requerido!")
		});
		return {
			schema,
			username: localStorage.getItem("username") || "",
			getProductsByUsername: [],
			userId: jwt_decode(localStorage.getItem("tokenRefresh")).user_id
		};
	},
	computed: {
		product() {
			const product = this.getProductsByUsername.filter(product => product.id == this.id)[0];
			return product;
		}
	},
	components: {
		Field,
		Form,
		ErrorMessage,
		ElTooltip
	},
	apollo: {
		getProductsByUsername: {
			query: gql`
				query Query($username: String!) {
					getProductsByUsername(username: $username) {
						id
						username
						name
					}
				}
			`,
			variables() {
				return {
					username: this.username
				};
			}
		}
	},
	methods: {
		async handleAddOrder(data) {
			if (data) {
				if (
					localStorage.getItem("tokenRefresh") === null ||
					localStorage.getItem("tokenAccess") === null
				) {
					this.$emit("logOut");
					return;
				}
				localStorage.setItem("tokenAccess", "");

				await this.$apollo
					.mutate({
						mutation: gql`
							mutation RefreshToken($refresh: Refresh!) {
								refreshToken(refresh: $refresh) {
									access
								}
							}
						`,
						variables: {
							refresh: {
								refresh: localStorage.getItem("tokenRefresh")
							}
						}
					})
					.then(result => {
						localStorage.setItem("tokenAccess", result.data.refreshToken.access);
					})
					.catch(error => {
						console.log(error);
						this.$emit("logOut");
						return;
					});

				if (
					localStorage.getItem("tokenAccess") != "" &&
					localStorage.getItem("tokenAccess") != null
				) {
					const submitData = data;
					submitData.productId = String(submitData.productId);
					submitData.quantity = parseInt(submitData.quantity);
					submitData.status = "completed";
					console.log(submitData);

					await this.$apollo
						.mutate({
							mutation: gql`
								mutation SaveOrder($orderInput: OrderAdd!) {
									saveOrder(orderInput: $orderInput) {
										id
										username
										name
										quantity
										status
									}
								}
							`,
							variables: {
								orderInput: submitData
							}
						})
						.then(res => {
							let message = `Order hecha correctamente.\nNúmero Referencia: ${res.data.saveOrder.id}`;
							alert(message);
						})
						.catch(error => {
							console.info(error);
						});
				} else {
					alert("Hubo un problema con sus credenciales de acceso. Ingrese al sistema de nuevo.");
				}
			}
		}
	}
};
</script>
<style scoped>
.order {
	background-color: rgb(222, 236, 235);
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 30px;
}

.order__form {
	background-color: white;
	width: 50%;
	min-width: 250px;
	padding: 20px;
	margin-top: 20px;
	border-radius: 8px;
}

.fa-exclamation-circle {
	color: gray;
}

.error {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 5px 0px;
	background-color: lightblue;
	color: darkslategray;
	margin-top: 20px;
}

.order__form .form-group {
	margin-top: 20px;
}

.order__form .form-group:first-of-type {
	display: flex;
	justify-content: space-around;
	align-items: center;
}

.form-group input {
	outline: none;
	border: 2px solid rgba(53, 58, 58, 0.4);
	border-radius: 5px;
	padding: 0px 15px;
	text-align: center;
	width: 100%;
	padding: 5px 0px;
}
</style>
