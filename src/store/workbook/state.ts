import { IWorkBookState, modesEnum, subModesEnum } from '@/types';

export default function() {
  return {
    workBooks: null,
    workBook: null,
    workBookData: null,
    workBookPages: null,
    workBookPage: null,
    currentPage: null,
    currentPageDimensions: null,
    modes: {
      mode: modesEnum.DRAW,
      subMode: subModesEnum.INK,
    },
    settings: {
      showThumbs: false,
      color: '#000000',
      brushWidth: 2,
      brushOpacity: 1,
      showDrawingExtras: false,
      showAddWorkBookDialog: false,
    },
    dialogs: {
      export: false,
    },
    toolAction: null,
  } as unknown as IWorkBookState;
}
