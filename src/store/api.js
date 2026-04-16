import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BASE = 'https://api.lsuthar.in'
const FLAGS_BASE = 'https://flags.lsuthar.in'
const HEALTH_WORKER = 'https://health-aggregator.leeladharsuthar62.workers.dev'

export const platformApi = createApi({
  reducerPath: 'platformApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    }
  }),
  tagTypes: ['Flags', 'Routes', 'Jobs'],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials
      })
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials
      })
    }),

    // Gateway health
    getGatewayHealth: builder.query({
      query: () => '/health'
    }),

    // Aggregated health
    getAggregatedHealth: builder.query({
      queryFn: async () => {
        try {
          const res = await fetch(HEALTH_WORKER)
          const data = await res.json()
          return { data }
        } catch (e) {
          return { error: { status: 'FETCH_ERROR', error: e.message } }
        }
      }
    }),

    // Flags
    getFlags: builder.query({
      query: () => '/flags',
      providesTags: ['Flags']
    }),
    createFlag: builder.mutation({
      query: (body) => ({ url: '/flags', method: 'POST', body }),
      invalidatesTags: ['Flags']
    }),
    updateFlag: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/flags/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Flags']
    }),

    // Audio jobs
    getJobs: builder.query({
      query: () => '/audio/jobs',
      providesTags: ['Jobs']
    }),
  })
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetGatewayHealthQuery,
  useGetAggregatedHealthQuery,
  useGetFlagsQuery,
  useCreateFlagMutation,
  useUpdateFlagMutation,
  useGetJobsQuery,
} = platformApi
