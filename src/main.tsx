import { React, getData, setData, Themes, Plugins, showToast, findModuleByProps } from 'betterdiscord/bdapi';
import { Logger, Updater, Banners, DiscordModules } from 'betterdiscord-plugin-libs';
import { SettingsPanel } from './SettingsPanel';
import BdApi from 'BdApi'; 

class Plugin {  
  private updater: Updater;
  private banners: Banners;
  private logger: Logger;
  private updateBannerId: number;
  private modules: { [key: string]: any };
  private themeAssignments: ThemeAssignments;

  private get currentGuildId(): string {
    return this.modules.selectedGuildStore.getGuildId();
  }

  private get guilds(): Guild[] {
    const guilds: Guild[] = Object.values(BdApi.Webpack.getStore("GuildStore").getGuilds())
      .map((guild: Guild) => ({
        id: guild.id,
        name: guild.name,
      }));

    guilds.unshift({
      id: 'noguild',
      name: 'No Guild',
    });

    return guilds;
  }

  private get themes(): string[] {
    const themes: string[] = Themes.getAll().map(({ id: themeId }: Theme) => themeId);

    themes.unshift('Default');

    return themes;
  }

  private loadModules(): void {
    this.modules = {
      selectedGuildStore: DiscordModules.selectedGuildStore,
      guildStore: DiscordModules.guildStore,
      app: DiscordModules.app,
    };
  }

  private loadServerTheme(guildId: string | null): void {
    const themeName: string = this.themeAssignments[guildId ?? 'Default'];

    for (const theme of this.themes) {
      Themes[theme === themeName ? 'enable' : 'disable'](theme);
    }

    this.logger.log('Switched to theme', themeName, 'for guild', guildId);
  }

  private settingsPanelThemeChangeHandler(guildId, themeId) {
    this.themeAssignments[guildId] = themeId;

    setData('themeAssignments', this.themeAssignments);

    if (this.currentGuildId === guildId) {
      this.loadServerTheme(guildId);
    }
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

  public start(): void {
    this.loadModules();

    this.logger = this.logger ?? new Logger('ServerThemes v' + PACKAGE_VERSION);
    this.updater = this.updater ?? new Updater({ storagePath: Plugins.folder, currentVersion: PACKAGE_VERSION, updatePath: BETTERDISCORD_UPDATEURL });
    this.banners = this.banners ?? new Banners(document.querySelector('.' + this.modules.app.app));
    this.themeAssignments = getData('serverthemes', 'themeAssignments') ?? {};

    for (const guild of this.guilds) {
      if (this.themeAssignments[guild.id] === undefined) {
        const activeThemes = Themes.getAll().filter((theme: Theme) => Themes.isEnabled(theme.id));

        if (activeThemes.length > 0) {
          this.themeAssignments[guild.id] = activeThemes[0].id;
        } else {
          this.themeAssignments[guild.id] = 'Default';
        }
      }
    }

    setData('serverthemes', 'themeAssignments', this.themeAssignments);

    this.update();
    this.loadServerTheme(this.currentGuildId);

    this.logger.log('Plugin started');
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
}

export default Plugin;
