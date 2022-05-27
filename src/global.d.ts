declare module '*.scss';
declare module 'betterdiscord/bdapi';

declare const PACKAGE_VERSION: string;
declare const PACKAGE_DESCRIPTION: string;
declare const BETTERDISCORD_UPDATEURL: string;

interface SupportPanelProps {
  onChangeCallback?: any;
  themeAssignments: ThemeAssignments;
  themes: string[];
  guilds: Guild[];
}

interface ThemeAssignments {
  [key: string]: string;
}

interface Theme {
  added: number;
  author: string;
  css: string;
  description: string;
  donate?: string;
  filename: string;
  format: string;
  id: string;
  invite?: string;
  modified: number;
  name: string;
  size: number;
  version: string;
}

interface Guild {
  afkChannelId?: string | null;
  afkTimeout?: number;
  applicationCommandCounts?: {
    [key: number]: number;
  };
  application_id?: string | null;
  banner?: string;
  defaultMessageNotifications?: number;
  description?: string | null;
  discoverySplash?: string | null;
  explicitContentFilter?: number;
  features?: string[];
  icon?: string;
  id: string;
  joinedAt?: Date;
  maxMembers?: number;
  maxVideoChannelUsers?: number;
  mfaLevel?: number;
  name?: string;
  nsfwLevel?: number;
  ownerId?: string;
  preferredLocale?: string;
  premiumSubscriberCount?: number;
  premiumTier?: number;
  publicUpdatesChannelId?: string | null;
  region?: string;
  roles?: {
    [key: string]: object;
  }
  rulesChannelId?: string | null;
  splash?: string | null;
  systemChannelFlags?: number;
  systemChannelId?: string | null;
  vanityURLCode?: string | null;
  verificationLeve?: number;
}
