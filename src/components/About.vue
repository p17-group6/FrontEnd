<template>
	<div class="textos">
		<div class="text01">
			<img class="img01" src="../assets/img/delivery.svg" alt="" />
			<span class="span01"
				>Somos tu tienda que te lleva tu cerveza favorita a donde quieras en cualquier momento y
				hora.</span
			>
		</div>
		<div class="text02">
			<span class="span02"
				>Somos tu tienda favorita que te ayuda a elegir la mejor cerveza para que compartas con tus
				amigos.</span
			>
			<img class="img02" src="../assets/img/beersfriend.svg" alt="" />
		</div>
		<div class="text03">
			<img class="img03" src="../assets/img/shop.svg" alt="" />
			<span class="span03"
				>Somos la tienda de los descuentos, la tienda que te hace la vida más facil, somos la de las
				promos, somos tu tienda de confianza.</span
			>
		</div>
	</div>
</template>

<style scoped>
.textos {
	background-color: rgba(255, 255, 255, 0.9);
	width: 100%;
	height: 100%;
}
.text01 {
	width: 80%;
	display: flex;
	padding: 30px 0 0 60px;
	flex-direction: row;
	align-items: center;
}
.span01 {
	font-size: 38px;
	font-weight: bold;
	margin: 30px;
}

.img01 {
	width: 400px;
}

.text02 {
	width: 90%;
	display: flex;
	margin: 100px 0 100px 60px;
	flex-direction: row;
	align-items: center;
}
.span02 {
	font-size: 38px;
	font-weight: bold;
	margin: 30px;
}

.img02 {
	width: 400px;
}

.text03 {
	width: 90%;
	display: flex;
	padding: 0 0 30px 60px;
	flex-direction: row;
	align-items: center;
}
.span03 {
	font-size: 38px;
	font-weight: bold;
	margin: 30px;
}

.img03 {
	width: 500px;
}

@media only screen and (max-width: 1200px) {
	.text01,
	.text02,
	.text03 {
		flex-direction: column;
	}
}
</style>
