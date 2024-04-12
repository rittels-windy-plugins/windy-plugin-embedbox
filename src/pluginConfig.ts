import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-embedbox',
    version: '0.1.1',
    icon: '📦',
    title: 'Embedded box',
    description: 'Show HTML in embedded box',
    author: 'Rittels',
    repository: 'github.com/rittels-windy-plugins/windy-plugin-embedbox.git',
    desktopUI: 'embedded',
    mobileUI: 'small',
    //routerPath: '/my-plugin',
};

export default config;
