import { ListSelect } from '@/db'
import { useEffect, useState } from 'react'
import { listsService } from '../services/lists.service'

type State = {
  data: ListSelect | null
  loading: boolean
  error: Error | null
}

export function useList(listId: string) {
  const [listState, setListState] = useState<State>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let mounted = true

    async function loadList() {
      try {
        setListState((s) => ({ ...s, loading: true }))

        const list = await listsService.getListById(listId)

        if (!mounted) return

        setListState({
          data: list,
          loading: false,
          error: null,
        })
      } catch (error) {
        if (!mounted) return

        setListState({
          data: null,
          loading: false,
          error: error as Error,
        })
      }
    }

    loadList()

    return () => {
      mounted = false
    }
  }, [listId])

  return listState
}
