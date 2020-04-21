import { IWorkBookState } from '@/types';

export default function() {
  return {
    workBooks: [],
    workBook: null,
    workBookData: null,
    workBookPages: null,
    workBookPage: null,
    currentPage: null,
    currentPageDimensions: null,
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
