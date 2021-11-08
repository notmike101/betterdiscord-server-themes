/**
 * @name serverthemes
 * @version 2.2.0
 * @description Apply specific themes when viewing specific server
 * @author DeNial
 * @authorLink https://mikeorozco.dev
 * @authorId 142347724392497152
 * @updateUrl https://raw.githubusercontent.com/notmike101/betterdiscord-server-themes/release/serverthemes.plugin.js
 * @website https://mikeorozco.dev
 * @source https://github.com/notmike101/betterdiscord-server-themes
 */

'use strict';

var SettingsPanelStylesheet = ".container {\n  display: flex;\n  flex-direction: column;\n  background-color: var(--background-primary);\n}\n.container .row {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 5px;\n}\n.container .row .serverName {\n  width: auto;\n  color: var(--text-normal);\n  display: inline-block;\n}\n.container .row .themeChoice {\n  display: flex;\n  flex: 1;\n  margin-left: 10px;\n  background-color: var(--interactive-hover);\n  padding: 5px;\n}";

const BdApi$1 = window.BdApi;
const React$1 = BdApi$1.React;
class SettingsPanel extends React$1.Component {
  constructor(props) {
    super(props);
    this.state = {
      themeAssignments: { ...this.props.themeAssignments }
    };
  }
  componentDidMount() {
    BdApi$1.injectCSS("ServerThemes" + "settings-panel", SettingsPanelStylesheet);
  }
  componentWillUnmount() {
    BdApi$1.clearCSS("ServerThemes" + "settings-panel");
  }
  render() {
    return /* @__PURE__ */ React$1.createElement("div", {
      className: "container"
    }, this.props.guilds.map((guild, index) => /* @__PURE__ */ React$1.createElement("div", {
      key: index,
      className: "row"
    }, /* @__PURE__ */ React$1.createElement("span", {
      className: "serverName"
    }, guild.name), /* @__PURE__ */ React$1.createElement("select", {
      className: "themeChoice",
      onChange: (e) => {
        this.setState((oldState) => {
          const newState = { ...oldState };
          newState.themeAssignments[guild.id] = e.target.value;
          return newState;
        });
        this.props.onChange(guild.id, e);
      },
      value: this.state.themeAssignments[guild.id] ?? "Default"
    }, this.props.themes.map((theme, index2) => /* @__PURE__ */ React$1.createElement("option", {
      key: index2,
      value: theme
    }, theme))))));
  }
}

const BdApi = window.BdApi;
const React = BdApi.React;
module.exports = class DiscordPlugin {
  themeAssignments;
  constructor() {
    this.themeAssignments = {};
  }
  get guildId() {
    const history = BdApi.findModuleByProps("getHistory").getHistory();
    let guildId = history.location.pathname.split("/").filter(Boolean)[1];
    if (!guildId || guildId === "@me") {
      guildId = "noguild";
    }
    return guildId;
  }
  get themes() {
    const themes = BdApi.Themes.getAll().map(({ id: themeId }) => themeId);
    themes.unshift("Default");
    return themes;
  }
  get guilds() {
    const guilds = Object.values(BdApi.findModuleByProps("getGuild").getGuilds());
    const noServer = {
      id: "noguild",
      name: "No guild"
    };
    guilds.unshift(noServer);
    return guilds;
  }
  loadServerTheme(guildId) {
    const themeName = this.themeAssignments[guildId ?? "Default"];
    this.themes.forEach((theme) => {
      BdApi.Themes[theme === themeName ? "enable" : "disable"](theme);
    });
  }
  updateSettings(guildId, event) {
    this.themeAssignments[guildId] = event.target.value;
    BdApi.setData("ServerThemes", "themeAssignments", this.themeAssignments);
    if (this.guildId === guildId) {
      this.loadServerTheme(guildId);
    }
  }
  getName() {
    return "Server Themes";
  }
  onSwitch() {
    this.loadServerTheme(this.guildId);
  }
  start() {
  }
  load() {
    this.themeAssignments = BdApi.loadData("ServerThemes", "themeAssignments") ?? {};
    this.guilds.forEach(({ id: guildId }) => {
      if (this.themeAssignments[guildId] === void 0) {
        this.themeAssignments[guildId] = "Default";
      }
    });
  }
  stop() {
  }
  getSettingsPanel() {
    return React.createElement(SettingsPanel, {
      onChange: this.updateSettings.bind(this),
      themeAssignments: this.themeAssignments,
      guilds: this.guilds,
      themes: this.themes
    }, null);
  }
};
