import { create } from 'zustand'

type StateProps = {
    search: string
    setSearch: (value: string) => void
}

export const useSearch = create<StateProps>((set) => ({
    search: '',
    setSearch: (value) => set({ search: value }),
}))