<template>
	<div class="modal">
		<div class="modal__content">
			<div class="product">
				<div class="product__logo">
					<router-link to="/">
						<img src="../assets/img/bodega-logo-black.svg" class="logo" width="200" />
					</router-link>
				</div>
				<div class="product__form">
					<p v-if="!product">Loading...</p>
					<Form v-else @submit="handleUpdateProduct">
						<i class="fas fa-arrow-left" @click="this.$router.push('/products')" />
						<div class="form-group">
							<section
								class="avatar-container"
								v-if="(results && results?.secure_url) || product.image || !product.image"
							>
								<p v-if="!product.image">No Image</p>
								<img v-if="!results" :src="product.image" :alt="product.name" class="avatar" />
								<img v-else :src="results.secure_url" :alt="results.public_id" class="avatar" />
							</section>
							<el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
							<label class="avatar-label" for="image">
								<el-button class="avatar-label-btn" size="small" type="primary">Subir</el-button>
								<Field
									id="image"
									class="avatar-label-input"
									name="image"
									type="file"
									@change="handleFile"
								/>
							</label>
						</div>
						<div class="form-group">
							<Field name="name" type="text" :placeholder="product?.name" />
						</div>
						<div class="form-group">
							<Field name="description" :placeholder="product?.description" type="text" />
						</div>
						<div class="form-group">
							<Field name="category" :placeholder="product?.category" type="text" />
						</div>
						<div class="form-group">
							<Field name="style" :placeholder="product?.style" type="text" />
						</div>
						<div class="form-group">
							<Field name="price" :placeholder="product?.price" type="number" />
						</div>
						<div class="form-group">
							<Field name="ibu_grade" :placeholder="product?.ibu_grade" type="number" />
						</div>
						<div class="form-group">
							<Field name="avg_grade" :placeholder="product?.avg_grade" type="number" />
						</div>
						<button type="submit">Actualizar</button>
					</Form>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import gql from "graphql-tag";
import jwt_decode from "jwt-decode";
import { ElButton, ElIcon, ElUpload, ElTooltip } from "element-plus";
import { Plus } from "@element-plus/icons";
import { Field, Form } from "vee-validate";

export default {
	name: "Product",
	props: ["id"],
	data() {
		return {
			userId: jwt_decode(localStorage.getItem("tokenRefresh")).user_id,
			username: localStorage.getItem("username") || "",
			getProductsByUsername: [],
			results: null,
			file: null,
			cloudName: "db9wyaboy",
			preset: "products",
			tags: "beer",
			filesSelected: null,
			fileContents: null,
			formData: null
		};
	},
	computed: {
		product() {
			const product = this.getProductsByUsername.filter(product => product.id == this.id)[0];
			return product;
		}
	},
	components: {
		Field,
		Form,
		ElButton,
		Plus,
		ElTooltip,
		ElUpload,
		ElIcon
	},
	apollo: {
		getProductsByUsername: {
			query: gql`
				query Query($username: String!) {
					getProductsByUsername(username: $username) {
						id
						image
						name
						description
						category
						style
						price
						avg_grade
						ibu_grade
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
	methods: {
		async handleUpdateProduct(data) {
			if (data) {
				if (
					localStorage.getItem("tokenRefresh") === null ||
					localStorage.getItem("tokenAccess") === null
				) {
					this.$emit("logOut");
					return;
				}
				localStorage.setItem("tokenAccess", "");

				await this.$apollo
					.mutate({
						mutation: gql`
							mutation RefreshToken($refresh: Refresh!) {
								refreshToken(refresh: $refresh) {
									access
								}
							}
						`,
						variables: {
							refresh: {
								refresh: localStorage.getItem("tokenRefresh")
							}
						}
					})
					.then(result => {
						localStorage.setItem("tokenAccess", result.data.refreshToken.access);
					})
					.catch(error => {
						console.log(error);
						this.$emit("logOut");
						return;
					});

				if (
					localStorage.getItem("tokenAccess") != "" &&
					localStorage.getItem("tokenAccess") != null
				) {
					const submitData = data;
					submitData.id = this.id;
					submitData.image = this.results?.secure_url || this.product?.image;
					submitData.username = localStorage.getItem("username");
					submitData.name = submitData?.name || this.product?.name;
					submitData.description = submitData?.description || this.product?.description;
					submitData.category = submitData?.category || this.product?.category;
					submitData.style = submitData?.style || this.product?.style;
					submitData.price = parseInt(submitData?.price) || this.product?.price;
					submitData.ibu_grade = parseFloat(submitData?.ibu_grade) || this.product?.ibu_grade;
					submitData.avg_grade = parseFloat(submitData?.avg_grade) || this.product?.avg_grade;

					await this.$apollo
						.mutate({
							mutation: gql`
								mutation UpdateProduct($productInput: ProductUpdate!) {
									updateProduct(productInput: $productInput) {
										id
										image
										username
										name
										description
										style
										category
										price
										avg_grade
										ibu_grade
									}
								}
							`,
							variables: {
								productInput: submitData
							}
						})
						.then(res => {
							let message = `Producto actualizado correctamente.\nNúmero Referencia: ${res.data.updateProduct.id}`;
							alert(message);
							this.$router.push("/products");
						})
						.catch(error => {
							console.info(error);
						});
				} else {
					alert("Hubo un problema con sus credenciales de acceso. Ingrese al sistema de nuevo.");
				}
			}
		},
		prepareFormData() {
			this.formData = new FormData();
			this.formData.append("upload_preset", this.preset);
			this.formData.append("tags", this.tags);
			this.formData.append("file", this.fileContents);
		},
		handleFile(e) {
			// console.log("handlefile", e.target.files);
			this.file = e.target.files[0];
			this.filesSelected = e.target.files.length;

			const isJPG = this.file.type === "image/jpeg";
			const isLt2M = this.file.size / 1024 / 1024 < 2;

			if (!isJPG) {
				alert("Avatar picture must be JPG format!");
			}
			if (!isLt2M) {
				alert("Avatar picture size can not exceed 2MB!");
			}

			if (isJPG && isLt2M) {
				this.handleUpload();
			}
		},
		handleUpload() {
			// console.log("upload", this.file.name);
			let reader = new FileReader();

			reader.addEventListener(
				"load",
				function() {
					this.fileContents = reader.result;
					this.prepareFormData();
					let cloudinaryUploadURL = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
					let requestObj = {
						url: cloudinaryUploadURL,
						method: "POST",
						data: this.formData
					};
					axios(requestObj)
						.then(res => {
							this.results = res.data;
							// console.log(this.results);
						})
						.catch(error => {
							this.errors = "Error cargando la imagen.";
							console.log(error);
						});
				}.bind(this),
				false
			);

			if (this.file && this.file.name) {
				reader.readAsDataURL(this.file);
			}

			window.removeEventListener("load", reader);
		}
	},
	created() {
		this.$apollo.queries.getProductsByUsername.refetch();
	},
	mounted() {
		this.$apollo.queries.getProductsByUsername.refetch();
	}
};
</script>
<style scoped>
.modal {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	background: rgba(189, 93, 93, 0.5);
	z-index: 1000;
}

.modal__content {
	width: 80vw;
	max-width: 600px;
	height: 90vh;
	border-radius: 8px;
	background-color: rgb(222, 236, 235);

	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	overflow-y: scroll;

	scrollbar-width: none;
}

.modal__content::-webkit-scrollbar {
	display: none;
}

.product {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 30px;
}

.product__form {
	background-color: white;
	padding: 20px;
	width: 50%;
	min-width: 250px;
	margin-top: 20px;
	border-radius: 8px;
}

.fa-arrow-left {
	cursor: pointer;
	font-size: 30px;
}

.fa-exclamation-circle {
	color: gray;
}

.error {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 5px 0px;
	background-color: lightblue;
	color: darkslategray;
	margin-top: 20px;
}

.product__form .form-group {
	margin-top: 20px;
}

.product__form .form-group:first-of-type {
	display: flex;
	justify-content: space-around;
	align-items: center;
}

.avatar-container {
	height: 60px;
	width: 60px;
}

.avatar {
	width: 100%;
	height: 100%;
}

.avatar-uploader-icon {
	color: gray;
	outline: dotted;
	outline-offset: 5px;
	outline-width: 2px;
	font-size: 50px;
}

.avatar-label {
	display: flex;
	justify-content: flex-end;
	pointer-events: all;
	cursor: pointer;
	width: 100px;
}

.avatar-label-btn {
	pointer-events: none;
	width: 100%;
}

.avatar-label .avatar-label-input {
	padding: 0;
	margin: 0;
	border: 0;
	width: 0;
	height: 0;
	overflow: hidden;
	opacity: 0;
}

.form-group input {
	outline: none;
	border: 2px solid rgba(53, 58, 58, 0.4);
	border-radius: 5px;
	padding: 0px 15px;
	text-align: center;
	width: 100%;
	padding: 5px;
	height: 40px;
}
</style>
