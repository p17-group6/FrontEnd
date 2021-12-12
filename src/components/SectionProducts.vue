<template>
	<div class="section__product">
		<h2>Nuevos Productos</h2>
		<p v-if="!getProductsByUsername">Loading...</p>
		<el-row v-else>
			<el-col
				v-for="(product, index) in getProductsByUsername"
				:key="product.name"
				:span="6"
				:offset="index > 0 ? 3 : 0"
			>
				<el-card :body-style="{ padding: '10px' }">
					<i class="fas fa-star"></i>
					<img :src="product.image" class="image" />
					<div style="padding: 14px">
						<span>{{ product.name }}</span>
						<span>{{ product.style }}</span>
						<span>{{ product.category[0] }}</span>
						<span>{{ product.price }}</span>
						<div class="bottom">
							<el-button
								type="text"
								class="button"
								v-on:click="this.$router.push(`/orders/${product.id}`)"
								>Ordena Ahora</el-button
							>
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>
<script>
import gql from "graphql-tag";
import { ElCard, ElRow, ElCol, ElButton } from "element-plus";

export default {
	name: "SectionProducts",
	components: { ElCard, ElRow, ElCol, ElButton },
	data() {
		return {
			username: localStorage.getItem("username") || "",
			getProductsByUsername: []
		};
	},
	apollo: {
		getProductsByUsername: {
			query: gql`
				query Query($username: String!) {
					getProductsByUsername(username: $username) {
						id
						image
						name
						style
						category
						price
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
	}
};
</script>
<style scoped>
.section__product {
	background-color: white;
	margin-top: 75px;
	padding: 50px 30px;
}

.fa-star {
	margin: 10px 10px;
	color: lightgray;
}

span {
	display: block;
	margin-top: 15px;
	text-align: center;
	border-bottom: 1px solid lightgray;
}

.section__product h2 {
	font-size: 20px;
	font-family: "Sans-serif";
	font-weight: bold;
	margin-bottom: 30px;
	color: #283747;
}
.image {
	width: 100%;
	height: 250px;
	display: block;
}

.button {
	width: 100%;
	margin: 15px 0px;
	height: 40px;
	border: none;
	border-radius: 5px;
	color: #fff;
	font-weight: bold;
	background: #283747;
}

.button:hover {
	background: #283747e0;
	color: #fff;
}

.button:active,
.button:focus {
	color: #fff;
	background: #283747c2;
}
</style>
