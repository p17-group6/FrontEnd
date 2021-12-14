<template>
	<div class="section">
		<h2 class="section__title">Nuevos Productos</h2>
		<p v-if="!getProductsByUsername">Loading...</p>
		<el-row v-else :gutter="20">
			<el-col
				v-for="product in getProductsByUsername"
				:key="product.id"
				:xs="24"
				:sm="12"
				:md="8"
				:lg="6"
				:xl="8"
			>
				<el-card class="card" :body-style="{ padding: '10px' }">
					<label class="card__label" for="favorite">
						<input
							id="favorite"
							@change="markFavorite"
							type="checkbox"
							name="favorite"
							class="favorite"
						/>
						<i ref="icon" class="fas fa-star"></i>
					</label>
					<img :src="product.image" class="card__image" />
					<div class="card__info" style="padding: 14px">
						<span>{{ product.name }}</span>
						<span>{{ product.style }}</span>
						<span>{{ product.category[0] }}</span>
						<span class="card__price">$ {{ product.price }} COP</span>
						<div class="card__button">
							<el-button type="text" v-on:click="this.$router.push(`/orders/${product.id}`)"
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
.section {
	background-color: white;
	margin-top: 75px;
	padding: 50px 30px;
}

.section__title {
	font-size: 20px;
	font-family: "Sans-serif";
	font-weight: bold;
	margin-bottom: 30px;
	color: #283747;
}

.card__image {
	display: block;
	margin: 0 auto;
	border-radius: 5px;
	height: 250px;
	width: 90%;
}

.fa-star {
	margin: 10px 10px;
	color: lightgray;
	cursor: pointer;
}

.favorite:checked ~ .fa-star {
	color: yellow;
}

.favorite {
	opacity: 0;
	width: 0;
	height: 0;
}

.card__info > span {
	display: block;
	padding-bottom: 10px;
	margin-top: 5px;
	text-align: center;
	border-bottom: 1px solid lightgray;
}

.card__price {
	font-weight: 700;
}

.card__button > button {
	width: 100%;
	margin: 15px 0px;
	height: 40px;
	border: none;
	border-radius: 5px;
	color: #fff;
	font-weight: bold;
	background: #283747;
}

.card__button > button:hover {
	background: #283747e0;
	color: #fff;
}

.card__button > button:active,
.card__button > button:focus {
	color: #fff;
	background: #283747c2;
}
</style>
