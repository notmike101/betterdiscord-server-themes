import { React, injectCSS, clearCSS } from 'betterdiscord/bdapi';
import settingStyles from './styles.scss';

export const SettingsPanel = (props: SupportPanelProps): JSX.Element => {
  const guilds: Guild[] = props.guilds;
  const themes: string[] = props.themes;
  const onChangeCallback: any = props.onChangeCallback;
  const [ themeAssignments , setThemeAssignments ] = React.useState(props.themeAssignments);
  const isMounted = React.useRef(false);

  const mountHandler = (): void => {
    isMounted.current = true;
    injectCSS('betterdiscord-serverthemes-settings-panel', settingStyles);
  };

  const unmountHandler = (): void => {
    isMounted.current = false;
    clearCSS('betterdiscord-serverthemes-settings-panel');
  };

  React.useEffect((): Function => {
    if (isMounted.current === false) {
      mountHandler();
    }

    return unmountHandler;
  }, []);

  return (
    <div className="settings-panel">
      <div className="settings-panel-body">
        {guilds.map((guild: Guild, index: number ) => (
          <div key={index} className="settings-panel-row">
            <span className="server-name">{ guild.name }</span>
            <select
              className="theme-select"
              onChange={(e) => {
                setThemeAssignments({
                  ...themeAssignments,
                  [guild.id]: e.target.value,
                });

                if (onChangeCallback) onChangeCallback(guild.name, e.target.value);
              }}
              value={themeAssignments[guild.id] ?? 'Default'}
            >
              {themes.map((theme: string, index: number) => (
                <option key={index} value={theme}>{theme}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};
