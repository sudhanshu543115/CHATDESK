import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://127.0.0.1:8001/graphql',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Message', 'Channel', 'Workspace', 'Group', 'User', 'Task'],
  endpoints: (builder) => ({
    // AUTH & USERS
    login: builder.mutation({
      query: (credentials) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation Login($username: String!, $password: String!) {
              login(username: $username, password: $password) {
                token
                username
                id
              }
            }
          `,
          variables: credentials,
        },
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation Register($username: String!, $email: String!, $password: String!) {
              register(username: $username, email: $email, password: $password) {
                token
                username
                id
              }
            }
          `,
          variables: userData,
        },
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query GetUsers {
              users {
                id
                username
                email
                avatar
              }
            }
          `,
        },
      }),
      providesTags: ['User'],
    }),

    // TASKS
    getTasks: builder.query({
      query: (workspaceId) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query GetTasks($workspaceId: Int!) {
              tasks(workspaceId: $workspaceId) {
                id
                title
                description
                status
                priority
                assigneeId
                createdAt
                dueDate
                tags
                assignee {
                  id
                  username
                  avatar
                }
              }
            }
          `,
          variables: { workspaceId },
        },
      }),
      providesTags: ['Task'],
    }),
    createTask: builder.mutation({
      query: (taskData) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation CreateTask($title: String!, $workspaceId: Int!, $description: String, $priority: String, $assigneeId: Int, $tags: [String!], $dueDate: String) {
              createTask(title: $title, workspaceId: $workspaceId, description: $description, priority: $priority, assigneeId: $assigneeId, tags: $tags, dueDate: $dueDate) {
                id
                title
                status
              }
            }
          `,
          variables: taskData,
        },
      }),
      invalidatesTags: ['Task'],
    }),
    updateTaskStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation UpdateTaskStatus($id: Int!, $status: String!) {
              updateTaskStatus(id: $id, status: $status) {
                id
                status
              }
            }
          `,
          variables: { id, status },
        },
      }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation DeleteTask($id: Int!) {
              deleteTask(id: $id)
            }
          `,
          variables: { id },
        },
      }),
      invalidatesTags: ['Task'],
    }),

    // GROUPS
    getGroups: builder.query({
      query: (workspaceId) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query GetGroups($workspaceId: Int!) {
              groups(workspaceId: $workspaceId) {
                id
                name
                memberCount
              }
            }
          `,
          variables: { workspaceId },
        },
      }),
      providesTags: ['Group'],
    }),
    getGroup: builder.query({
      query: (groupId) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query GetGroup($groupId: Int!) {
              group(id: $groupId) {
                id
                name
                memberCount
                members {
                  id
                  username
                  avatar
                }
              }
            }
          `,
          variables: { groupId },
        },
      }),
      providesTags: (result, error, id) => [{ type: 'Group', id }],
    }),
    createGroup: builder.mutation({
      query: ({ name, workspaceId, memberIds }) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation CreateGroup($name: String!, $workspaceId: Int!, $memberIds: [Int!]!) {
              createGroup(name: $name, workspaceId: $workspaceId, memberIds: $memberIds) {
                id
                name
              }
            }
          `,
          variables: { name, workspaceId, memberIds },
        },
      }),
      invalidatesTags: ['Group'],
    }),
    addMemberToGroup: builder.mutation({
      query: ({ groupId, userId }) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation AddMember($groupId: Int!, $userId: Int!) {
              addMemberToGroup(groupId: $groupId, userId: $userId) {
                id
                memberCount
              }
            }
          `,
          variables: { groupId, userId },
        },
      }),
      invalidatesTags: ['Group', 'User'],
    }),
    removeMemberFromGroup: builder.mutation({
      query: ({ groupId, userId }) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation RemoveMember($groupId: Int!, $userId: Int!) {
              removeMemberFromGroup(groupId: $groupId, userId: $userId) {
                id
                memberCount
              }
            }
          `,
          variables: { groupId, userId },
        },
      }),
      invalidatesTags: ['Group', 'User'],
    }),
    deleteGroup: builder.mutation({
      query: (groupId) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation DeleteGroup($groupId: Int!) {
              deleteGroup(groupId: $groupId)
            }
          `,
          variables: { groupId },
        },
      }),
      invalidatesTags: ['Group'],
    }),

    // MESSAGES
    getMessages: builder.query({
      query: ({ channelId, recipientId, groupId }) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query GetMessages($channelId: Int, $recipientId: Int, $groupId: Int) {
              messages(channelId: $channelId, recipientId: $recipientId, groupId: $groupId) {
                id
                content
                timestamp
                senderId
                mediaUrl
                mediaType
                fileName
                sender {
                  id
                  username
                  avatar
                }
              }
            }
          `,
          variables: { channelId, recipientId, groupId },
        },
      }),
      providesTags: ['Message'],
    }),
    sendMessage: builder.mutation({
      query: (messageData) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation SendMessage($content: String!, $senderId: Int!, $channelId: Int, $groupId: Int, $recipientId: Int, $mediaUrl: String, $mediaType: String, $fileName: String) {
              sendMessage(content: $content, senderId: $senderId, channelId: $channelId, groupId: $groupId, recipientId: $recipientId, mediaUrl: $mediaUrl, mediaType: $mediaType, fileName: $fileName) {
                id
                content
                mediaUrl
                mediaType
                fileName
              }
            }
          `,
          variables: messageData,
        },
      }),
      invalidatesTags: ['Message'],
    }),
    deleteMessage: builder.mutation({
      query: (messageId) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation DeleteMessage($id: Int!) {
              deleteMessage(id: $id)
            }
          `,
          variables: { id: messageId },
        },
      }),
      invalidatesTags: ['Message'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUsersQuery,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
  useGetGroupsQuery,
  useGetGroupQuery,
  useCreateGroupMutation,
  useAddMemberToGroupMutation,
  useRemoveMemberFromGroupMutation,
  useDeleteGroupMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useDeleteMessageMutation,
} = chatApi;
