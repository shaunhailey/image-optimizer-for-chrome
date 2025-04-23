import { ProcessingOptions, DEFAULT_SETTINGS, DEFAULT_PRESETS, Preset } from '../types/index';

export class SettingsService {
  private static SETTINGS_KEY = 'image_optimizer_settings';
  private static CUSTOM_PRESET_KEY = 'image_optimizer_custom_preset';
  private static ACTIVE_PRESET_KEY = 'image_optimizer_active_preset';

  static async getSettings(): Promise<ProcessingOptions> {
    return new Promise((resolve) => {
      chrome.storage.sync.get(this.SETTINGS_KEY, (result) => {
        if (result[this.SETTINGS_KEY]) {
          resolve(result[this.SETTINGS_KEY] as ProcessingOptions);
        } else {
          // Initialize with default settings if none exist
          this.saveSettings(DEFAULT_SETTINGS).then(() => {
            resolve(DEFAULT_SETTINGS);
          });
        }
      });
    });
  }

  static async saveSettings(settings: ProcessingOptions): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ [this.SETTINGS_KEY]: settings }, () => {
        resolve();
      });
    });
  }

  static async getCustomPreset(): Promise<ProcessingOptions> {
    return new Promise((resolve) => {
      chrome.storage.sync.get(this.CUSTOM_PRESET_KEY, (result) => {
        if (result[this.CUSTOM_PRESET_KEY]) {
          resolve(result[this.CUSTOM_PRESET_KEY] as ProcessingOptions);
        } else {
          // Initialize custom preset with default settings if none exist
          const customPreset = DEFAULT_PRESETS.find(preset => preset.name === "Custom")?.options || DEFAULT_SETTINGS;
          this.saveCustomPreset(customPreset).then(() => {
            resolve(customPreset);
          });
        }
      });
    });
  }

  static async saveCustomPreset(settings: ProcessingOptions): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ [this.CUSTOM_PRESET_KEY]: settings }, () => {
        resolve();
      });
    });
  }

  static async getActivePresetName(): Promise<string> {
    return new Promise((resolve) => {
      chrome.storage.sync.get(this.ACTIVE_PRESET_KEY, (result) => {
        if (result[this.ACTIVE_PRESET_KEY]) {
          resolve(result[this.ACTIVE_PRESET_KEY] as string);
        } else {
          // Set Standard as default active preset
          this.saveActivePresetName("Standard").then(() => {
            resolve("Standard");
          });
        }
      });
    });
  }

  static async saveActivePresetName(presetName: string): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ [this.ACTIVE_PRESET_KEY]: presetName }, () => {
        resolve();
      });
    });
  }

  static async applyPreset(presetName: string): Promise<ProcessingOptions> {
    let options: ProcessingOptions;
    
    if (presetName === "Custom") {
      options = await this.getCustomPreset();
    } else {
      const preset = DEFAULT_PRESETS.find(p => p.name === presetName);
      options = preset ? preset.options : DEFAULT_SETTINGS;
    }
    
    await this.saveSettings(options);
    await this.saveActivePresetName(presetName);
    
    return options;
  }

  static getPresets(): Preset[] {
    return DEFAULT_PRESETS;
  }
}