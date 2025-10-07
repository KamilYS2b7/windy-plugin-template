import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-my-plugin',
    version: '0.1.0',
    icon: '🪂',
    title: 'Fly Ireland',
    description: 'Fly Ireland',
    author: 'Kamil (optional company name)',
    repository: 'https://github.com/windycom/windy-plugin-template',
    desktopUI: 'embedded',
    mobileUI: 'embedded',
    routerPath: '/my-plugin',
    private: False,
};

export default config;


