import { createClient } from 'contentful'
import { prepare } from './prepare'

export const get_contentful_da = (access_token, space) => {
  const client = createClient({ accessToken: access_token, space })

  return {
    get: async (params, include = 10) => {
      const { items: [data] } = await client.getEntries({ ...params, include })

      return prepare(data)
    }
  }
}
