import { gql } from 'graphql-request';

export const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      email
      avatar
      status
      displayName
    }
  }
`;

export const GET_WORKSPACES = gql`
  query GetWorkspaces {
    workspaces {
      id
      name
      slug
      avatar
      role
    }
  }
`;

export const GET_CHATS = gql`
  query GetChats($workspaceId: ID!) {
    chats(workspaceId: $workspaceId) {
      id
      name
      type
      avatar
      lastMessage {
        id
        content
        createdAt
        sender {
          id
          username
        }
      }
      unreadCount
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages($chatId: ID!, $limit: Int, $before: String) {
    messages(chatId: $chatId, limit: $limit, before: $before) {
      id
      content
      createdAt
      type
      sender {
        id
        username
        avatar
      }
      attachments {
        id
        name
        url
        type
      }
      reactions {
        emoji
        count
        users {
          id
          username
        }
      }
    }
  }
`;

export const GET_GROUPS = gql`
  query GetGroups($workspaceId: ID!) {
    groups(workspaceId: $workspaceId) {
      id
      name
      description
      avatar
      memberCount
    }
  }
`;

export const GET_CHANNELS = gql`
  query GetChannels($workspaceId: ID!) {
    channels(workspaceId: $workspaceId) {
      id
      name
      description
      isPrivate
    }
  }
`;
