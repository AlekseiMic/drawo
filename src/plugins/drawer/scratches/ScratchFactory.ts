import { Action } from '../interfaces/Action';
import { IScratch } from '../interfaces/IScratch';
import { LineScratch } from './LineScratch';
import { PenScratch } from './PenScratch';

export class ScratchFactory {
  static create(a: Action): IScratch | null {
    if (!a.payload.tool || !a.id || !a.user) return null;
    switch (a.payload.tool) {
      case 'PenTool':
        return PenScratch.create(a.id, a.user, a.payload);
      case 'LineTool':
        return LineScratch.create(a.id, a.user, a.payload);
      default:
        return null;
    }
  }

  static unserialize(s: any) {
    if (s.name === 'PenScratch') {
      return PenScratch.create(s.id, s.user, s.payload);
    }
    if (s.name === 'LineScratch') {
      return LineScratch.create(s.id, s.user, s.payload);
    }
    return null;
  }
}
