<template>
	<div class="checkout">
		<div class="checkout__form">
			<Form @submit="handleCheckout">
				<div class="form-group">
					<Field name="id" v-model="id" v-slot="{ field }">
						<input type="text" v-bind="field" disabled />
					</Field>
					<Field name="name" v-model="name" v-slot="{ field }">
						<input type="text" v-bind="field" disabled />
					</Field>
					<Field name="username" v-model="username" v-slot="{ field }">
						<input type="text" v-bind="field" disabled />
					</Field>
					<Field name="quantity" v-model="quantity" v-slot="{ field }">
						<input type="text" v-bind="field" disabled />
					</Field>
					<Field name="status" v-model="status" v-slot="{ field }">
						<input type="text" v-bind="field" disabled />
					</Field>
					<Field name="at_created" v-model="at_created" v-slot="{ field }">
						<input type="text" v-bind="field" disabled />
					</Field>
				</div>
				<button type="submit">Pagar</button>
			</Form>
		</div>
		<img
			ref="stripe"
			class="stripe hidden"
			src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png"
			alt="stripe"
		/>
	</div>
</template>
<script>
import { eventBus } from "../main";
import { Field, Form } from "vee-validate";

export default {
	name: "Checkout",
	data() {
		return {
			id: "---",
			name: "---",
			username: "---",
			quantity: "---",
			status: "---",
			at_created: "---"
		};
	},
	components: { Field, Form },
	methods: {
		handleCheckout() {
			this.$refs.stripe.classList.remove("hidden");
		}
	},
	created() {
		eventBus.on("orderData", data => {
			// console.info(data);
			if (data) {
				this.id = data.id;
				this.name = data.name;
				this.username = data.username;
				this.quantity = data.quantity;
				this.status = data.status;
				this.at_created = data.at_created;
			}
		});
	}
};
</script>
<style scoped>
.checkout {
	background-color: rgb(222, 236, 235);
	height: 100vh;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	padding: 30px;
	position: relative;
}

.checkout__form {
	background-color: white;
	width: 50%;
	min-width: 250px;
	padding: 20px;
	margin-top: 20px;
	border-radius: 8px;
}

.checkout__form .form-group {
	margin-top: 20px;
}

.form-group input {
	border: none;
	outline: none;
	border-bottom: 1px solid gray;
	width: 100%;
	margin-bottom: 20px;
	text-align: center;
}

.stripe {
	position: absolute;
	top: 80%;
	left: 50%;
	width: 200px;
	transform: translate(-50%, -50%);
	z-index: 9999;
}
.hidden {
	display: none;
}
</style>
