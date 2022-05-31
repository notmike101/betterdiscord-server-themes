import { React, getData, setData, Themes, Plugins, showToast, findModuleByProps } from 'betterdiscord/bdapi';
import { Updater, Banners } from 'betterdiscord-plugin-libs';
import { SettingsPanel } from './SettingsPanel';

class Plugin {  
  private updater: Updater;
  private banners: Banners;
  private updateBannerId: number;

  private themeAssignments: ThemeAssignments;

  get currentGuildId(): string {
    const history = BdApi.findModuleByProps('getHistory').getHistory();
    let guildId: string = history.location.pathname.split('/').filter(Boolean)[1];

    if (!guildId || guildId === '@me') {
      guildId = 'noguild';
    }

    return guildId;
  }

  get guilds(): Guild[] {
    const guilds: Guild[] = Object.values(BdApi.findModuleByProps('getGuild').getGuilds());
    const noServer: Guild = {
      id: 'noguild',
      name: 'No guild',
    };

    guilds.unshift(noServer);

    return guilds;
  }

  get themes(): string[] {
    const themes: string[] = Themes.getAll().map(({ id: themeId }: Theme) => themeId);

    themes.unshift('Default');

    return themes;
  }

  public load(): void {
    this.updater = this.updater ?? new Updater({ storagePath: Plugins.folder, currentVersion: PACKAGE_VERSION, updatePath: BETTERDISCORD_UPDATEURL });
    this.banners = this.banners ?? new Banners(document.querySelector('.' + findModuleByProps('app', 'layers').app));
    this.themeAssignments = getData('serverthemes', 'themeAssignments') ?? {};

    this.guilds.forEach(({ id: guildId }: Guild) => {
      if (this.themeAssignments[guildId] === undefined) {
        const activeThemes = Themes.getAll().filter((theme: Theme) => Themes.isEnabled(theme.id));

        if (activeThemes.length > 0) {
          this.themeAssignments[guildId] = activeThemes[0].id;
        } else {
          this.themeAssignments[guildId] = 'Default';
        }
      }
    });

    setData('serverthemes', 'themeAssignments', this.themeAssignments);
  }

  public start(): void {
    this.update();
    this.loadServerTheme(this.currentGuildId);
  }

  public stop(): void {
    if (this.updateBannerId !== null) {
      this.banners.dismissBanner(this.updateBannerId);
    }

    this.loadServerTheme(null);
  }

  public onSwitch(): void {
    this.loadServerTheme(this.currentGuildId);
  }

  public getSettingsPanel(): JSX.Element {
    return <SettingsPanel
      onChangeCallback={this.settingsPanelThemeChangeHandler.bind(this)}
      themeAssignments={this.themeAssignments}
      themes={this.themes}
      guilds={this.guilds}
    />;
  }

  private loadServerTheme(guildId: string | null): void {
    const themeName: string = this.themeAssignments[guildId ?? 'Default'];

    this.themes.forEach((theme: string) => {
      Themes[theme === themeName ? 'enable' : 'disable'](theme);
    });
  }

  private settingsPanelThemeChangeHandler(guildId, themeId) {
    this.themeAssignments[guildId] = themeId;

    setData('themeAssignments', this.themeAssignments);

    this.loadServerTheme(guildId);
  }

  private async update(): Promise<void> {
    const isUpdateAvailable: boolean = await this.updater.isUpdateAvailable();

    if (isUpdateAvailable) {
      this.updateBannerId = this.banners.createBanner('Update available for ServerThemes', {
        acceptCallback: async () => {
          const updateSuccess = await this.updater.installUpdate();

          if (updateSuccess) {
            showToast('ServerThemes successfully updated', { type: 'success' });
          } else {
            showToast('Failed to update ServerThemes', { type: 'error' });
          }
        },
      });
    }
  }
}

export default Plugin;
