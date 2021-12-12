<template>
	<div class="products">
		<div class="products__side--1">
			<ProductsAdd />
		</div>
		<div class="products__side--2">
			<ProductsTable />
		</div>
	</div>
</template>
<script>
import ProductsAdd from "./ProductsAdd.vue";
import ProductsTable from "./ProductsTable.vue";

export default {
	name: "Products",
	data() {
		return {
			refreshTable: ""
		};
	},
	components: {
		ProductsAdd,
		ProductsTable
	}
};
</script>
<style scoped>
.products {
	display: flex;
	position: absolute;
	top: 0;
	z-index: 1000;
	width: 100%;
}
.products__side--1 {
	flex: 0.4;
	min-width: 400px;
}

.products__side--2 {
	flex: 0.6;
}

@media only screen and (max-width: 900px) {
	.products {
		flex-direction: column;
	}
}
</style>
