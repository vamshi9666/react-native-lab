import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { CHAT_URL } from "./Api";
import { retrieveData } from "./Storage";

export const Client = async token => {
  const cache = new InMemoryCache();
  const wsLink = new WebSocketLink({
    uri: "ws://185.247.117.61:4000/graphql",
    options: {
      reconnect: true,
      connectionParams: {
        authToken:
          "Bearer " +
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDRlYzVmOWY5ZTVmY2Y0YzA5ZmI1NjAiLCJuYW1lIjoiVmFtc2hpIiwiZGF0ZV9vZl9iaXJ0aCI6IjA0LTEyLTE5OTgiLCJtb2JpbGVfbnVtYmVyIjoiNzY1OTgyMTU2NCIsImNyZWF0ZWRBdCI6IjE1NjU0NDM1NzgiLCJ1c2VyX2luZGV4IjoxNiwiaWF0IjoxNTY1Njk2MzE5fQ.a9X9AwwkS9V5JBXwKlre2vtV9eNInJzcZ1JnOREOxoQ"
      }
    }
  });

  const httpLink = new HttpLink({
    uri: CHAT_URL
  });

  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      console.log(" definintion ===== \n   ", definition);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );
  return new ApolloClient({
    link: link,
    cache
  });
};
