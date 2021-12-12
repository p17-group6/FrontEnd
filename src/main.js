import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import mitt from "mitt";

export const eventBus = mitt();

// Apollo
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client/core";
import { createApolloProvider } from "@vue/apollo-option";
import { setContext } from "apollo-link-context";

// Element Plus
import "@element-plus/icons/es/Plus";
import "element-plus/es/components/tooltip/style/css";
import "element-plus/es/components/upload/style/css";
import "element-plus/es/components/icon/style/css";
import "element-plus/es/components/button/style/css";
import "element-plus/es/components/input/style/css";
import "element-plus/es/components/table/style/css";
import "element-plus/es/components/table-column/style/css";
import "element-plus/es/components/card/style/css";
import "element-plus/es/components/row/style/css";
import "element-plus/es/components/col/style/css";

// Config

const httpLink = createHttpLink({
	uri: "http://localhost:4000/"
});

const authLink = setContext((_, { headers }) => {
	return {
		headers: {
			...headers,
			Authorization: localStorage.getItem("tokenAccess") || ""
		}
	};
});

const apolloClient = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache()
});

const apolloProvider = new createApolloProvider({
	defaultClient: apolloClient
});

createApp(App)
	.use(router)
	.use(apolloProvider)
	.mount("#app");
