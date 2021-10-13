export interface Guild {
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
