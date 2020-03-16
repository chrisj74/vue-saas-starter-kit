import { ITask } from '@/types';

export default function() {
  return {
    tasks: null as unknown as ITask[],
    allWindows: [] as any[],
    showLinks: 0,
  };
}
