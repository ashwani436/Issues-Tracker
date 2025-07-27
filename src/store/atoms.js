import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Create storage atom with fallback
const createStorageAtom = (key, initialValue) => {
  try {
    return atomWithStorage(key, initialValue);
  } catch (error) {
    console.warn(`Failed to create storage atom for ${key}:`, error);
    return atom(initialValue);
  }
};

// Table state atom with localStorage persistence
export const tableStateAtom = createStorageAtom('issues-table-state', {
  globalFilter: '',
  columnFilters: [],
  sorting: [],
  grouping: [],
  rowSelection: {},
  pagination: {
    pageIndex: 0,
    pageSize: 25,
  },
});

// Selected issue for detail view
export const selectedIssueAtom = atom(null);

// Detail view open state
export const detailViewOpenAtom = atom(false);

// Loading state
export const loadingAtom = atom(false);

// Error state
export const errorAtom = atom(null);

// Derived atom for checking if there are any active filters
export const hasActiveFiltersAtom = atom((get) => {
  const state = get(tableStateAtom);
  return (
    state.globalFilter.length > 0 ||
    state.columnFilters.length > 0 ||
    state.grouping.length > 0
  );
});
