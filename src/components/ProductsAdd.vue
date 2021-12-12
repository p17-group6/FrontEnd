<template>
	<div class="product">
		<div class="product__logo">
			<router-link to="/">
				<img src="../assets/img/bodega-logo-black.svg" class="logo" width="200" />
			</router-link>
		</div>
		<div class="product__form">
			<p v-if="errors">
				{{ errors }}
			</p>
			<Form @submit="handleAddProduct" :validation-schema="schema">
				<ErrorMessage name="image">
					<el-tooltip content="Image es requerida!" placement="top">
						<i class="fas fa-exclamation-circle"></i>
					</el-tooltip>
				</ErrorMessage>
				<div class="form-group">
					<section class="avatar-container" v-if="results && results.secure_url">
						<img :src="results.secure_url" :alt="results.public_id" class="avatar" />
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
					<Field name="name" type="text" placeholder="Presentacion" />
					<ErrorMessage name="name" v-slot="{ message }">
						<span v-if="message" class="error">
							<el-tooltip :content="message" placement="top">
								<i class="fas fa-exclamation-circle"></i>
							</el-tooltip>
						</span>
					</ErrorMessage>
				</div>
				<div class="form-group">
					<Field name="description" type="text" placeholder="Descripcion" />
					<ErrorMessage name="description" v-slot="{ message }">
						<span v-if="message" class="error">
							<el-tooltip :content="message" placement="top">
								<i class="fas fa-exclamation-circle"></i>
							</el-tooltip>
						</span>
					</ErrorMessage>
				</div>
				<div class="form-group">
					<Field name="category" type="text" placeholder="Categoria" />
					<ErrorMessage name="category" v-slot="{ message }">
						<span v-if="message" class="error">
							<el-tooltip :content="message" placement="top">
								<i class="fas fa-exclamation-circle"></i>
							</el-tooltip>
						</span>
					</ErrorMessage>
				</div>
				<div class="form-group">
					<Field name="style" type="text" placeholder="Estilo" />
					<ErrorMessage name="style" v-slot="{ message }">
						<span v-if="message" class="error">
							<el-tooltip :content="message" placement="top">
								<i class="fas fa-exclamation-circle"></i>
							</el-tooltip>
						</span>
					</ErrorMessage>
				</div>
				<div class="form-group">
					<Field name="price" type="number" placeholder="Precio" />
					<ErrorMessage name="price" v-slot="{ message }">
						<span v-if="message" class="error">
							<el-tooltip :content="message" placement="top">
								<i class="fas fa-exclamation-circle"></i>
							</el-tooltip>
						</span>
					</ErrorMessage>
				</div>
				<div class="form-group">
					<Field name="ibu_grade" type="number" placeholder="Grado IBU" />
					<ErrorMessage name="ibu_grade" v-slot="{ message }">
						<span v-if="message" class="error">
							<el-tooltip :content="message" placement="top">
								<i class="fas fa-exclamation-circle"></i>
							</el-tooltip>
						</span>
					</ErrorMessage>
				</div>
				<div class="form-group">
					<Field name="avg_grade" type="number" placeholder="Grado AVG" />
					<ErrorMessage name="avg_grade" v-slot="{ message }">
						<span v-if="message" class="error">
							<el-tooltip :content="message" placement="top">
								<i class="fas fa-exclamation-circle"></i>
							</el-tooltip>
						</span>
					</ErrorMessage>
				</div>
				<button type="submit">Agregar</button>
			</Form>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import gql from "graphql-tag";
import jwt_decode from "jwt-decode";
import { eventBus } from "../main";

import { ElButton, ElIcon, ElUpload, ElTooltip } from "element-plus";
import { Plus } from "@element-plus/icons";

import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
	name: "ProductsAdd",
	data() {
		const schema = yup.object().shape({
			image: yup.mixed().required(),
			name: yup.string().required("El campo nombre es requerido!"),
			description: yup.string().required("El campo descripcion es requerido!"),
			category: yup.mixed().required("El campo categoria es requerido!"),
			style: yup.string().required("El campo estilo es requerido!"),
			price: yup.mixed().required("El campo precio es requerido!"),
			ibu_grade: yup.mixed().required("El campo IBU Grade es requerido!"),
			avg_grade: yup.mixed().required("El campo AVG Grade es requerido!")
		});
		return {
			schema,
			errors: "",
			userId: jwt_decode(localStorage.getItem("tokenRefresh")).user_id,
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
	components: {
		Field,
		Form,
		ErrorMessage,
		ElButton,
		Plus,
		ElTooltip,
		ElUpload,
		ElIcon
	},
	methods: {
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
		},
		async handleAddProduct(data) {
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
					submitData.price = parseInt(submitData.price);
					submitData.ibu_grade = parseFloat(submitData.price);
					submitData.avg_grade = parseFloat(submitData.price);
					submitData.image = this.results.secure_url;
					submitData.username = localStorage.getItem("username");
					console.log(submitData);

					await this.$apollo
						.mutate({
							mutation: gql`
								mutation SaveProduct($productInput: ProductAdd!) {
									saveProduct(productInput: $productInput) {
										id
										username
										name
										description
										style
										category
										image
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
							let message = `Producto agregado correctamente.\nNúmero Referencia: ${res.data.saveProduct.id}`;
							alert(message);
							eventBus.emit("saveProduct", message);
						})
						.catch(error => {
							console.info(error);
						});
				} else {
					alert("Hubo un problema con sus credenciales de acceso. Ingrese al sistema de nuevo.");
				}
			}
		}
	}
};
</script>
<style scoped>
.product {
	background-color: rgb(222, 236, 235);
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 30px;
}

.product__form {
	background-color: white;
	width: 50%;
	min-width: 250px;
	padding: 20px;
	margin-top: 20px;
	border-radius: 8px;
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
	padding: 5px 0px;
}
</style>
