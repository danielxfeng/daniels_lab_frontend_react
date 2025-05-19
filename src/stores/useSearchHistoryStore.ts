import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SearchHistoryState = {
  /* properties */
  history: string[];
  maxHistory: number;
  /* methods */
  /**
   * @summary Add an entry to the search history.
   * @description It adds a new entry to the history,
   * while removing the duplicates and outdated entries.
   * @param entry The search query to add.
   */
  addHistory: (entry: string) => void;
};

/**
 * @summary A Zustand store for managing search history.
 * @description Here we maintain a set of search queries.
 * It allows adding new queries and retrieving the current history.
 * The history is limited to a maximum number of entries.
 */
const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set, get) => ({
      history: [],
      maxHistory: 5,

      addHistory: (entry) => {
        const current = get().history.filter((q) => q !== entry);
        const updated = [entry, ...current].slice(0, get().maxHistory);
        set({ history: updated });
      },
    }),
    { name: 'search-history' },
  ),
);

export default useSearchHistoryStore;
export type { SearchHistoryState };
