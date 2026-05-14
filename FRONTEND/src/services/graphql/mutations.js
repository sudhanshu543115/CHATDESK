import { gql } from 'graphql-request';

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        email
        avatar
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      id
      username
      email
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($chatId: ID!, $content: String!, $attachments: [ID]) {
    sendMessage(chatId: $chatId, content: $content, attachments: $attachments) {
      id
      content
      createdAt
      sender {
        id
        username
      }
    }
  }
`;

export const CREATE_GROUP = gql`
  mutation CreateGroup($workspaceId: ID!, $name: String!, $description: String, $members: [ID!]) {
    createGroup(workspaceId: $workspaceId, name: $name, description: $description, members: $members) {
      id
      name
    }
  }
`;

export const CREATE_CHANNEL = gql`
  mutation CreateChannel($workspaceId: ID!, $name: String!, $description: String, $isPrivate: Boolean) {
    createChannel(workspaceId: $workspaceId, name: $name, description: $description, isPrivate: $isPrivate) {
      id
      name
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($displayName: String, $avatar: String) {
    updateProfile(displayName: $displayName, avatar: $avatar) {
      id
      displayName
      avatar
    }
  }
`;
