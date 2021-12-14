<template>
	<div class="container">
		<div class="add">
			<ProductsAdd />
		</div>
		<div class="table">
			<ProductsTable />
		</div>
	</div>
</template>
<script>
import ProductsAdd from "./ProductsAdd.vue";
import ProductsTable from "./ProductsTable.vue";

export default {
	name: "Products",
	data() {},
	components: {
		ProductsAdd,
		ProductsTable
	}
};
</script>
<style scoped>
.container {
	display: flex;
	position: absolute;
	top: 0;
	z-index: 1000;
	width: 100%;
}
.add {
	flex: 0.3;
	min-width: 400px;
}

.table {
	flex: 0.7;
}

@media only screen and (max-width: 900px) {
	.container {
		flex-direction: column;
	}
}
</style>
