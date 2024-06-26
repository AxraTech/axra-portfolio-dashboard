import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import {
  ApolloProvider,
  ApolloCache,
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
const authLink = setContext((_, { headers }) => {
  const loggedUserJSON = window.localStorage.getItem("loggedUser");
  const loggedUserParsed = JSON.parse(loggedUserJSON);

  if (loggedUserParsed) {
    return {
      headers: {
        ...headers,
        Authorization: loggedUserParsed
          ? `Bearer ${loggedUserParsed.token}`
          : null,
      },
    };
  }
  return {
    headers: { ...headers },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log("graphql", graphQLErrors);

    graphQLErrors.forEach(({ extensions }) => {
      if (
        extensions.code === "invalid-headers" ||
        extensions.code === "invalid-jwt"
      ) {
        localStorage.removeItem("token");
        alert("Session Expired, Please Sign In With Your Credentials Again");
      }
    });
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

const httpLink = new HttpLink({
  uri: "https://portfolio.axra.app/v1/graphql",
});
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: errorLink.concat(authLink).concat(httpLink),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
);
