const packageJson = require('./package.json');

if (!packageJson.name) throw new Error('No package name found, please enter a package name in package.json');

const metaComment = Object.entries({
  name: packageJson.name,
  version: packageJson.version ?? undefined,
  description: packageJson.description ?? undefined,
  author: packageJson.betterdiscord?.display_name ?? packageJson.author?.name ?? packageJson.author ?? undefined,
  authorLink: packageJson.author?.url ?? packageJson.homepage ?? undefined,
  authorId: packageJson.betterdiscord?.discord_snowflake ?? undefined,
  updateUrl: packageJson.betterdiscord?.update_url ?? undefined,
  website: packageJson.betterdiscord?.website ?? undefined,
  source: packageJson.betterdiscord?.source ?? undefined,
  invite: packageJson.betterdiscord?.invite ?? undefined,
  donate: packageJson.betterdiscord?.donate ?? undefined,
  patreon: packageJson.betterdiscord?.patreon ?? undefined,
}).reduce((acc, [key, value]) => {
  if (!acc) acc = {};
  if (value === undefined) return acc;

  acc[key] = value;
  return acc;
}, {});

export const banner = Object.entries(metaComment).reduce(
  (acc, [key, value]) => `${acc}\n * @${key} ${value}`,
  '/**'
) + '\n */\n';

export const name = packageJson.name.replace('-', '');
export const main = packageJson.main;
