import { createRouter, createWebHistory } from "vue-router";
import gql from "graphql-tag";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client/core";

import Home from "./components/Home.vue";
import SignIn from "./components/SignIn.vue";
import SignUp from "./components/SignUp.vue";
import Contact from "./components/Contact.vue";
import About from "./components/About.vue";
import Products from "./components/Products.vue";
import Orders from "./components/Orders.vue";
import OrderAdd from "./components/OrderAdd.vue";
import Product from "./components/Product.vue";

const routes = [
	{
		path: "/",
		name: "home",
		component: Home,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: "/signIn",
		name: "signIn",
		component: SignIn,
		meta: {
			requiresAuth: false
		}
	},
	{
		path: "/signUp",
		name: "signUp",
		component: SignUp,
		meta: {
			requiresAuth: false
		}
	},
	{
		path: "/contact",
		name: "contact",
		component: Contact,
		meta: {
			requiresAuth: false
		}
	},
	{
		path: "/about",
		name: "about",
		component: About,
		meta: {
			requiresAuth: false
		}
	},
	{
		path: "/orders",
		name: "orders",
		component: Orders,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: "/orders/:id",
		name: "order",
		component: OrderAdd,
		meta: {
			requiresAuth: true
		},
		props: true
	},
	{
		path: "/products",
		name: "products",
		component: Products,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: "/products/:id",
		name: "product",
		component: Product,
		meta: {
			requiresAuth: true
		},
		props: true
	}
];

const router = createRouter({
	history: createWebHistory(),
	routes
});

const apolloClient = new ApolloClient({
	link: createHttpLink({
		uri: "https://gateway-ms-g6.herokuapp.com/"
	}),
	cache: new InMemoryCache()
});

async function isAuth() {
	if (
		localStorage.getItem("tokenRefresh") === null ||
		localStorage.getItem("tokenAccess") === null
	) {
		return false;
	}

	try {
		var result = await apolloClient.mutate({
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
		});

		localStorage.setItem("tokenAccess", result.data.refreshToken.access);
		return true;
	} catch (error) {
		localStorage.clear();
		alert("Su sesion ha expirado. Por favor, ingrese nuevamente.");
		return false;
	}
}

router.beforeEach(async (to, from) => {
	console.info(`Redirecting from ${from.name} to ${to.name}`);
	let is_auth = await isAuth();

	if (is_auth == to.meta.requiresAuth) return true;

	if (is_auth) return { name: "home" };
	else return { name: "signIn" };
});

export default router;
