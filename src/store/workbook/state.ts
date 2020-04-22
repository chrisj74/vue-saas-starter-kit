import { IWorkBookState, modesEnum, subModesEnum } from '@/types';

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
      mode: modesEnum.DRAW,
      subMode: subModesEnum.BRUSH,
    },
    settings: {
      showThumbs: false,
      color: '#000000',
      brushWidth: 2,
    },
    toolAction: null,
  } as unknown as IWorkBookState;
}
