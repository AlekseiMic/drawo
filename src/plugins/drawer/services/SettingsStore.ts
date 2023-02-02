import { ScratchState } from '../interfaces';
import { RGBA } from '../interfaces/Color';
import { hexToRGBA } from '../utils/hexToRGBA';

interface SettingsProps extends Record<string, unknown> {
  _color: string;
  color: string;
  rgba: RGBA;
  thickness: number;
  stateColors: Partial<Record<ScratchState, RGBA>>;
}

export class SettingsStore {
  private _settings: SettingsProps = {
    _color: '#ffffffff',
    rgba: { r: 255, g: 255, b: 255, a: 255 },
    thickness: 3,
    stateColors: {
      [ScratchState.hovered]: { r: 150, g: 0, b: 255, a: 190 },
      [ScratchState.dragged]: { r: 255, g: 0, b: 0, a: 190 },
      [ScratchState.preview]: { r: 55, g: 0, b: 0, a: 190 },
    },
    set color(color: string) {
      this._color = color;
      this.rgba = hexToRGBA(color);
    },
    get color() {
      return this._color;
    },
  };

  set<T extends keyof SettingsProps>(name: T, value: SettingsProps[T]) {
    this._settings[name] = value;
  }

  get<T extends keyof SettingsProps>(
    name: T,
    fallback: undefined | SettingsProps[T] = undefined
  ) {
    return this._settings[name] ?? fallback;
  }

  getMany(...names: (keyof typeof this._settings)[]) {
    return names.reduce((acc: Partial<SettingsProps>, name) => {
      acc[name] = this._settings[name];
      return acc;
    }, {} as any);
  }

  setMany(data: Partial<typeof this._settings>) {
    Object.entries(data).forEach(([name, value]) => {
      this._settings[name] = value;
    });
  }

  getToolSettings() {
    return {
      color: this._settings.rgba,
      thickness: this._settings.thickness,
    };
  }

  getColorForState(
    state: ScratchState,
    fallback: RGBA = { r: 255, g: 255, b: 255, a: 255 }
  ): RGBA {
    if (!state) return fallback;
    return this._settings.stateColors[state] ?? fallback;
  }
}
