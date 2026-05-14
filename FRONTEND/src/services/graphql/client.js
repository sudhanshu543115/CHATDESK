import { GraphQLClient } from 'graphql-request';

const endpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:8000/graphql';

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});
