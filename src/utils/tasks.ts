import { taskTabTypesEnum, ITaskTabs, ITaskTab } from '@/types';

export function newTaskTabs(): ITaskTab[] {
  return [
    {
      type: taskTabTypesEnum.HOME,
      icon: 'mdi-home',
      label: 'Cover',
      description: 'Overview of the task to help when you start working on it.',
      active: true,
    },
    {
      type: taskTabTypesEnum.LINKS,
      icon: 'mdi-link',
      label: 'Links',
      description: 'List of bookmarked links to help with the task.',
      active: true,
    },
    {
      type: taskTabTypesEnum.NOTES,
      icon: 'mdi-lead-pencil',
      label: 'Notes',
      description: 'Take notes while you work.',
      active: true,
    },
    {
      type: taskTabTypesEnum.DOCS,
      icon: 'mdi-file-document-outline',
      label: 'Documents',
      description: 'Documents you need to do the task.',
      active: true,
    },
    {
      type: taskTabTypesEnum.INFO,
      icon: 'mdi-information',
      label: 'Info',
      description: 'Help and instruction on how to complete the task',
      active: true,
    },
    {
      type: taskTabTypesEnum.CALCULATOR,
      icon: 'mdi-calculator',
      label: 'Calculator',
      description: 'Simple calculator.',
      active: false,
    },
    {
      type: taskTabTypesEnum.YOUTUBE,
      icon: 'mdi-youtube',
      label: 'YouTube',
      description: 'Safe ad free YouTube search.',
      active: false,
    },
  ] as ITaskTab[];
}
