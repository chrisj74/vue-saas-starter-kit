import { INoteBookState } from '@/types';

export default function() {
  return {
    noteBooks: null,
    noteBook: null,
    settings: {
      showAddNoteDialog: false,
    },
  } as unknown as INoteBookState;
}
