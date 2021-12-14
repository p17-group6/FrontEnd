<template>
	<div class="container">
		<div class="checkout">
			<Checkout />
		</div>
		<div class="table">
			<OrdersTable />
		</div>
	</div>
</template>
<script>
import Checkout from "./Checkout";
import OrdersTable from "./OrdersTable";

export default {
	name: "Orders",
	data() {
		return {};
	},
	components: {
		OrdersTable,
		Checkout
	}
};
</script>
<style scoped>
.container {
	display: flex;
}

.checkout {
	flex: 0.3;
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
