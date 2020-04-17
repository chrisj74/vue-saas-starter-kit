import { IWorkBookState } from '@/types';

export default function() {
  return {
    workBooks: [],
    workBook: null,
    workBookPages: null,
    workBookPage: null,
    currentPage: null,
    modes: {
      mode: 'draw',
      subMode: 'brush',
    },
    settings: {
      showThumbs: false,
    },
    toolAction: null,
  } as unknown as IWorkBookState;
}
