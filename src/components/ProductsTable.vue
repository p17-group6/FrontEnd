<template>
	<div class="product">
		<h2>Inventario</h2>
		<div>
			<el-table
				:data="
					getProductsByUsername.filter(
						product => !search || product.name.toLowerCase().includes(search.toLowerCase())
					)
				"
				style="width: 100%; margin: 0 auto;"
			>
				<el-table-column label="Imagen" width="180">
					<template #default="scope">
						<img class="product-img" :src="scope.row.image" :alt="scope.row.name" />
					</template>
				</el-table-column>
				<el-table-column label="Nombre" prop="name" width="80" />
				<el-table-column label="Precio" prop="price" width="80" />
				<el-table-column label="Fecha Creacion" width="120">
					<template #default="scope">
						{{ new Date(scope.row.at_created).toLocaleString("es-CO", { timeZone: "UTC" }) }}
					</template>
				</el-table-column>

				<el-table-column label="Fecha Modificacion" width="140">
					<template #default="scope">
						{{ new Date(scope.row.at_modified).toLocaleString("es-CO", { timeZone: "UTC" }) }}
					</template>
				</el-table-column>
				<el-table-column align="right">
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
						<el-button size="mini" @click="this.$router.push(`/products/${scope.row.id}`)">
							Editar
						</el-button>
						<el-button size="mini" type="danger" @click="handleDelete(scope.row.id)"
							>Delete</el-button
						>
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
	name: "ProductsTable",
	data() {
		return {
			search: "",
			userId: jwt_decode(localStorage.getItem("tokenRefresh")).user_id,
			username: localStorage.getItem("username") || "",
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
		async handleDelete(id) {
			await this.$apollo
				.mutate({
					mutation: gql`
						mutation DeleteProductById($productId: String!) {
							deleteProductById(productId: $productId)
						}
					`,
					variables: {
						productId: id
					}
				})
				.then(result => {
					console.log(result);
				})
				.catch(error => {
					console.log(error);
				});
			this.$apollo.queries.getProductsByUsername.refetch();
		}
	},
	apollo: {
		getProductsByUsername: {
			query: gql`
				query Query($username: String!) {
					getProductsByUsername(username: $username) {
						id
						image
						name
						price
						avg_grade
						at_created
						at_modified
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
		this.$apollo.queries.getProductsByUsername.refetch();
		eventBus.on("saveProduct", message => {
			console.info(message);
			if (message) {
				this.$apollo.queries.getProductsByUsername.refetch();
			}
		});
	}
};
</script>
<style scoped>
.product {
	background-color: white;
	height: 100%;
	width: 100%;
	padding: 0px 20px;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
}

.product-img {
	width: 150px;
	height: 100px;
	object-fit: cover;
}

.product h2 {
	margin: 50px 20px;
}
</style>
