<template>
	<div class="orders">
		<h2 class="orders__title">Ordenes</h2>
		<div class="orders__table">
			<el-table
				:data="
					getOrdersByUsername.filter(
						order => !search || order.name.toLowerCase().includes(search.toLowerCase())
					)
				"
				style="width: 100%; margin: 0 auto;"
			>
				<el-table-column label="Imagen" width="180">
					<template #default="scope">
						<img
							class="orders__image"
							:src="getProductImage(scope.row.productId)"
							:alt="scope.row.name"
						/>
					</template>
				</el-table-column>
				<el-table-column label="Cliente" prop="username" width="100" />
				<el-table-column label="Nombre" prop="name" width="140" />
				<el-table-column label="Cantidad" prop="quantity" width="110" />
				<el-table-column label="Estado" prop="status" width="120" />
				<el-table-column align="right" width="140">
					<template #header>
						<el-input
							class="el-input"
							v-model="search"
							size="medium"
							placeholder="Buscar..."
							autocomplete="true"
						/>
					</template>
					<template #default="scope">
						<div class="orders__actions">
							<el-button size="mini" @click="generateCheckout(scope.row)">Generar Recibo</el-button>
							<el-button
								size="mini"
								:loading="loading"
								type="danger"
								@click="handleCancelOrder(scope.row.id)"
								><i class="fas fa-trash"></i
							></el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>
<script>
import gql from "graphql-tag";
import jwt_decode from "jwt-decode";
import { eventBus } from "../main";

import { ElTable, ElTableColumn, ElButton, ElInput } from "element-plus";
export default {
	name: "Orders",
	data() {
		return {
			search: "",
			loading: false,
			userId: jwt_decode(localStorage.getItem("tokenRefresh")).user_id,
			username: localStorage.getItem("username") || "",
			getOrdersByUsername: [],
			getProductsByUsername: []
		};
	},
	components: {
		ElTable,
		ElTableColumn,
		ElButton,
		ElInput
	},
	methods: {
		async handleCancelOrder(id) {
			this.loading = true;
			const cancelOrder = confirm("Estas seguro de eliminar el producto?");
			if (cancelOrder) {
				await this.$apollo
					.mutate({
						mutation: gql`
							mutation DeleteOrderById($orderId: String!) {
								deleteOrderById(orderId: $orderId)
							}
						`,
						variables: {
							orderId: id
						}
					})
					.then(result => {
						this.loading = false;
						console.log(result);
					})
					.catch(error => {
						console.log(error);
					});
				this.$apollo.queries.getOrdersByUsername.refetch();
			}
		},
		getProductImage(productId) {
			const product = this.getProductsByUsername.filter(product => product.id == productId);
			const item = product[0];
			if (item) return item.image;
		},
		generateCheckout(row) {
			eventBus.emit("orderData", row);
		}
	},
	apollo: {
		getOrdersByUsername: {
			query: gql`
				query Query($username: String!) {
					getOrdersByUsername(username: $username) {
						id
						name
						username
						status
						productId
						quantity
						at_created
					}
				}
			`,
			variables() {
				return {
					username: this.username
				};
			}
		},
		getProductsByUsername: {
			query: gql`
				query Query($username: String!) {
					getProductsByUsername(username: $username) {
						id
						image
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
	created() {
		this.$apollo.queries.getOrdersByUsername.refetch();
		this.$apollo.queries.getProductsByUsername.refetch();
	}
};
</script>
<style scoped>
.orders {
	background-color: white;
	height: 100vh;
	width: 100%;
	padding: 0px 20px;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
}

.orders__image {
	width: 150px;
	height: 100px;
	object-fit: cover;
}

.orders__title {
	margin: 50px 20px;
}

.orders__actions {
	display: flex;
	flex-direction: column;
}

.orders__actions .el-button:first-of-type {
	margin-bottom: 20px;
}

.orders__actions .el-button:last-of-type {
	margin-left: 0px;
}
</style>
