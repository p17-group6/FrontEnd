<template>
	<div class="products">
		<h2 clas="products__title">Inventario</h2>
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
						<img class="products__image" :src="scope.row.image" :alt="scope.row.name" />
					</template>
				</el-table-column>
				<el-table-column label="Nombre" prop="name" width="120" />
				<el-table-column label="Precio" prop="price" width="80" />
				<el-table-column label="F. Creacion" width="150">
					<template #default="scope">
						{{ new Date(scope.row.at_created).toLocaleString("es-CO", { timeZone: "UTC" }) }}
					</template>
				</el-table-column>

				<el-table-column label="F. Modificacion" width="160">
					<template #default="scope">
						{{ new Date(scope.row.at_modified).toLocaleString("es-CO", { timeZone: "UTC" }) }}
					</template>
				</el-table-column>
				<el-table-column align="right" width="100">
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
						<div class="products__actions">
							<el-button size="mini" @click="this.$router.push(`/products/${scope.row.id}`)">
								<i class="fas fa-edit"></i>
							</el-button>
							<el-button
								size="mini"
								:loading="loading"
								type="danger"
								@click="handleDelete(scope.row.id)"
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
	name: "ProductsTable",
	data() {
		return {
			loading: false,
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
			this.loading = true;
			const confirmDelete = confirm("Estas seguro de eliminar el producto?");
			if (confirmDelete) {
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
						this.loading = false;
						console.log(result);
					})
					.catch(error => {
						console.log(error);
					});
				this.$apollo.queries.getProductsByUsername.refetch();
			}
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
.products {
	background-color: white;
	height: 100%;
	width: 100%;
	padding: 20px 20px;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
}

.products__image {
	width: 150px;
	height: 100px;
	object-fit: cover;
}

.products__title {
	margin: 50px 20px;
}

.products__actions {
	display: flex;
	flex-direction: column;
}

.el-button:first-of-type {
	margin-bottom: 20px;
}

.el-button:last-of-type {
	margin-left: 0px;
}
</style>
