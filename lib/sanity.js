
import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'm7bvu8m4',
  dataset: 'production',
  apiVersion: '2025-02-19',
  useCdn: false,
})
