import { ITask, ITemplate } from '@/types';

export default function() {
  return {
    tasks: null as unknown as ITask[],
    templates: null as unknown as ITask[],
    allWindows: [] as any[],
    showLinks: 0,
  };
}
