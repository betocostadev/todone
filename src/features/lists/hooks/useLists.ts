import { ListSelect } from '@/db'
import { useEffect, useState } from 'react'
import { listsService } from '../services/lists.service'

type State = {
  data: ListSelect[] | null
  loading: boolean
  error: Error | null
}

export function useLists() {
  const [state, setState] = useState<State>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const lists = await listsService.getAllLists()

        if (!mounted) return

        setState({
          data: lists,
          loading: false,
          error: null,
        })
      } catch (err) {
        if (!mounted) return

        setState({
          data: null,
          loading: false,
          error: err as Error,
        })
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  return state
}
