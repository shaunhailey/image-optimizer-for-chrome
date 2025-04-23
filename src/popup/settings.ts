import { SettingsService } from '../utils/settingsService';
import { ProcessingOptions, Preset } from '../types/index';

export class SettingsUI {
  private container: HTMLElement;
  private settingsPanel!: HTMLElement;
  private isVisible = false;
  private currentOptions: ProcessingOptions = {} as ProcessingOptions;
  private presets: Preset[] = [];
  private onSettingsChange: (options: ProcessingOptions) => void;

  constructor(containerId: string, onSettingsChange: (options: ProcessingOptions) => void) {
    this.container = document.getElementById(containerId) as HTMLElement;
    this.onSettingsChange = onSettingsChange;
    this.init();
  }

  private async init() {
    // Create settings panel
    this.settingsPanel = document.createElement('div');
    this.settingsPanel.className = 'settings-panel';
    this.settingsPanel.style.display = 'none';
    this.container.appendChild(this.settingsPanel);
    
    // Get presets and current settings
    this.presets = SettingsService.getPresets();
    this.currentOptions = await SettingsService.getSettings();
    
    // Render settings UI
    this.renderSettingsUI();
    
    // Add settings toggle button
    const settingsBtn = document.getElementById('settingsButton') as HTMLButtonElement;
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => this.toggleSettings());
    }
  }

  private async renderSettingsUI() {
    const activePresetName = await SettingsService.getActivePresetName();
    
    // Clear existing content
    this.settingsPanel.innerHTML = '';
    
    // Create preset selector
    const presetSection = document.createElement('div');
    presetSection.className = 'settings-section';
    
    const presetLabel = document.createElement('label');
    presetLabel.textContent = 'Preset:';
    presetLabel.htmlFor = 'preset-select';
    
    const presetSelect = document.createElement('select');
    presetSelect.id = 'preset-select';
    presetSelect.className = 'settings-control';
    
    this.presets.forEach(preset => {
      const option = document.createElement('option');
      option.value = preset.name;
      option.textContent = `${preset.name} - ${preset.description}`;
      option.selected = preset.name === activePresetName;
      presetSelect.appendChild(option);
    });
    
    presetSelect.addEventListener('change', async () => {
      const newOptions = await SettingsService.applyPreset(presetSelect.value);
      this.currentOptions = newOptions;
      this.renderCustomSettings();
      this.onSettingsChange(newOptions);
    });
    
    presetSection.appendChild(presetLabel);
    presetSection.appendChild(presetSelect);
    this.settingsPanel.appendChild(presetSection);
    
    // Create custom settings section (only editable when "Custom" is selected)
    const customSection = document.createElement('div');
    customSection.id = 'custom-settings';
    customSection.className = 'settings-section';
    this.settingsPanel.appendChild(customSection);
    
    this.renderCustomSettings();
  }

  private async renderCustomSettings() {
    const customSection = document.getElementById('custom-settings') as HTMLElement;
    const activePresetName = await SettingsService.getActivePresetName();
    const isCustom = activePresetName === 'Custom';
    
    // Get the current custom preset if we're on custom mode
    const options = isCustom 
      ? await SettingsService.getCustomPreset()
      : this.currentOptions;
    
    customSection.innerHTML = `
      <h3>Settings ${!isCustom ? '(View Only)' : ''}</h3>
      <div class="settings-row">
        <label for="max-file-size">Max File Size (MB):</label>
        <input type="number" id="max-file-size" value="${options.maxFileSize / 1000000}" 
               min="0.1" step="0.1" class="settings-control" ${!isCustom ? 'disabled' : ''}>
      </div>
      <div class="settings-row">
        <label for="max-width">Max Width (px):</label>
        <input type="number" id="max-width" value="${options.maxWidth}" 
               min="100" step="50" class="settings-control" ${!isCustom ? 'disabled' : ''}>
      </div>
      <div class="settings-row">
        <label for="max-height">Max Height (px):</label>
        <input type="number" id="max-height" value="${options.maxHeight}" 
               min="100" step="50" class="settings-control" ${!isCustom ? 'disabled' : ''}>
      </div>
      <div class="settings-row">
        <label for="quality">Quality:</label>
        <input type="range" id="quality" value="${options.quality || 0.9}" 
               min="0.5" max="1" step="0.05" class="settings-control" ${!isCustom ? 'disabled' : ''}>
        <span id="quality-value">${Math.round((options.quality || 0.9) * 100)}%</span>
      </div>
      <div class="settings-row">
        <label for="format">Format:</label>
        <select id="format" class="settings-control" ${!isCustom ? 'disabled' : ''}>
          <option value="png" ${(options.format || 'png') === 'png' ? 'selected' : ''}>PNG</option>
          <option value="jpeg" ${(options.format || 'png') === 'jpeg' ? 'selected' : ''}>JPEG</option>
        </select>
      </div>
    `;
    
    if (isCustom) {
      // Add event listeners for custom settings
      const maxFileSizeInput = document.getElementById('max-file-size') as HTMLInputElement;
      const maxWidthInput = document.getElementById('max-width') as HTMLInputElement;
      const maxHeightInput = document.getElementById('max-height') as HTMLInputElement;
      const qualityInput = document.getElementById('quality') as HTMLInputElement;
      const qualityValue = document.getElementById('quality-value') as HTMLSpanElement;
      const formatSelect = document.getElementById('format') as HTMLSelectElement;
      
      qualityInput.addEventListener('input', () => {
        qualityValue.textContent = `${Math.round(parseFloat(qualityInput.value) * 100)}%`;
      });
      
      const saveCustomSettings = async () => {
        const customSettings: ProcessingOptions = {
          maxFileSize: parseFloat(maxFileSizeInput.value) * 1000000,
          maxWidth: parseInt(maxWidthInput.value),
          maxHeight: parseInt(maxHeightInput.value),
          quality: parseFloat(qualityInput.value),
          format: formatSelect.value
        };
        
        await SettingsService.saveCustomPreset(customSettings);
        await SettingsService.saveSettings(customSettings);
        this.currentOptions = customSettings;
        this.onSettingsChange(customSettings);
      };
      
      [maxFileSizeInput, maxWidthInput, maxHeightInput, qualityInput, formatSelect].forEach(input => {
        input.addEventListener('change', saveCustomSettings);
      });
      
      // Add save button
      const saveButton = document.createElement('button');
      saveButton.textContent = 'Save Custom Settings';
      saveButton.className = 'button';
      saveButton.addEventListener('click', saveCustomSettings);
      customSection.appendChild(saveButton);
    }
  }

  public toggleSettings() {
    this.isVisible = !this.isVisible;
    this.settingsPanel.style.display = this.isVisible ? 'block' : 'none';
  }
}