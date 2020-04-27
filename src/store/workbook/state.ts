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
    dialogs: {
      export: false,
    },
    toolAction: null,
  } as unknown as IWorkBookState;
}
