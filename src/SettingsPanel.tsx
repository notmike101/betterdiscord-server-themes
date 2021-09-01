import { BdApi as BdApiNamespace } from './bdapi';
import { Guild } from './GuildInterface';
import SettingsPanelStylesheet from './styles/SettingsPanel.scss';

const BdApi: typeof BdApiNamespace = (window as any).BdApi;
const React = BdApi.React;

type Props = {
  onChange: (guildId: string, e: React.ChangeEvent<HTMLSelectElement>) => void;
  themeAssignments: { [guildId: string]: string | null };
  guilds: Guild[];
  themes: string[];
};

type State = {
  themeAssignments: { [guildId: string]: string | null };
};

export default class SettingsPanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      themeAssignments: { ...this.props.themeAssignments },
    }
  }

  componentDidMount() {
    BdApi.injectCSS(import.meta.env.VITE_PLUGIN_CODE + 'settings-panel', SettingsPanelStylesheet);
  }

  componentWillUnmount() {
    BdApi.clearCSS(import.meta.env.VITE_PLUGIN_CODE + 'settings-panel');
  }

  render() {
    return (
      <div className="container">
        {this.props.guilds.map((guild: Guild, index: number) => (
          <div key={ index } className="row">
            <span className="serverName">{ guild.name }</span>
            <select
              className="themeChoice"
              onChange={
                (e) => {
                  this.setState((oldState) => {
                    const newState = { ...oldState };
                    newState.themeAssignments[guild.id] = e.target.value;
                    return newState;
                  });

                  this.props.onChange(guild.id, e);
                }
              }
              value={
                this.state.themeAssignments[guild.id] ?? 'Default'
              }
            >
              {this.props.themes.map((theme: string, index: number) => (
                <option key={ index } value={ theme }>{ theme }</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    );
  }
}
