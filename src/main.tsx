import { Theme, BdApi as BdApiNamespace } from './bdapi';
import { Guild } from './GuildInterface';
import SettingsPanel from './SettingsPanel';

const BdApi: typeof BdApiNamespace = (window as any).BdApi;
const React = BdApi.React;

module.exports = class DiscordPlugin {
  protected themeAssignments: { [guildId: string]: string };

  constructor() {
    this.themeAssignments = {};
  }

  get guildId(): string {
    let guildId: string = BdApi.findModuleByProps('getGuildId').getGuildId()

    if (guildId === null) return 'noguild';
    return guildId;
  }

  get themes(): string[] {
    const themes = BdApi.Themes.getAll().map((theme: Theme) => theme.id);

    themes.unshift('Default');

    return themes;
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

  protected loadServerTheme(guildId: string | null): void {
    const themeName: string = this.themeAssignments[guildId ?? 'Default'];

    if (BdApi.Themes.isEnabled(themeName)) return;

    this.themes.forEach((theme: string) => {
      if (BdApi.Themes.isEnabled(theme)) BdApi.Themes.disable(theme);
      else if (theme === themeName) BdApi.Themes.enable(theme);
    });
  }

  protected updateSettings(guildId: string, event: any): void {
    this.themeAssignments[guildId] = event.target.value;
    BdApi.setData(import.meta.env.VITE_PLUGIN_CODE, 'themeAssignments', this.themeAssignments);
    
    if (this.guildId === guildId) {
      this.loadServerTheme(guildId);
    }
  }

  public getName(): string {
    return import.meta.env.VITE_PLUGIN_NAME
  }

  public onSwitch(): void {
    this.loadServerTheme(this.guildId);
  }

  public start(): void {}

  public load(): void {
    this.themeAssignments = BdApi.loadData(import.meta.env.VITE_PLUGIN_CODE, 'themeAssignments') ?? {};
    this.guilds.forEach((guild: Guild) => {
      if (this.themeAssignments[guild.id] === undefined) {
        this.themeAssignments[guild.id] = 'Default';
      }
    });
  }

  public stop(): void {}

  public getSettingsPanel(): any {
    return React.createElement(SettingsPanel, {
      onChange: this.updateSettings.bind(this),
      themeAssignments: this.themeAssignments,
      guilds: this.guilds,
      themes: this.themes
    }, null);
  }
}
