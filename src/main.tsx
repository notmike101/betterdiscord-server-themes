import { React, getData, setData, Themes } from 'betterdiscord/bdapi';
import { Updater } from 'betterdiscord-plugin-updater';
import { SettingsPanel } from './SettingsPanel';

class Plugin {  
  private updater: Updater;
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
    this.updater = new Updater(BETTERDISCORD_UPDATEURL, PACKAGE_VERSION);
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
  }

  public stop(): void {}

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

  private log(...message: string[]): void {
    console.log(`%c[ServerThemes]%c (${PACKAGE_VERSION})%c ${message.join(' ')}`, 'color: lightblue;', 'color: gray', 'color: white');
  }

  private settingsPanelThemeChangeHandler(guildId, themeId) {
    this.themeAssignments[guildId] = themeId;

    setData('themeAssignments', this.themeAssignments);

    this.loadServerTheme(guildId);
  }

  private async update(): Promise<void> {
    const isUpdateAvailable: boolean = await this.updater.isUpdateAvailable();

    if (isUpdateAvailable) {
      this.updater.showUpdateBanner();
    }
  }
}

export default Plugin;
