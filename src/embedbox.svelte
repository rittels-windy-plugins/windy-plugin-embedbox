<div id="{name}-in-embed-box">
    {@html embedHTML}
</div>

<script>
    import { onDestroy, onMount } from 'svelte';
    import plugins from '@windy/plugins';
    import config from './pluginConfig';
    import bcast from '@windy/broadcast';
    import store from '@windy/store';

    const { name } = config;
    const thisPlugin = plugins[name];

    let embedHTML = 'contents',
        /** pluginName is the name of the controlling plugin */
        pluginName = 'no-name';

    onMount(() => {
        thisPlugin.isActive = true;

        // Close immediately,  once the html has appeared in DOM.
        // Also remove plugin from stored installedPlugins,  so that it does not appear in the menu.
        // An pluginConfig option to specify whether should appear in menu would be useful
        setTimeout(() => {
            let installedPlugins = store.get('installedPlugins');
            let ix = installedPlugins.findIndex(e => e.name == name);
            if (ix >= 0) {
                installedPlugins.splice(ix, 1);
                store.remove('installedPlugins');
                store.set('installedPlugins', installedPlugins);
            }
        });
    });

    onDestroy(()=>{
        thisPlugin.isActive = false;
    })

    plugins[name].exports = {
        setHTML: (str, n) => {
            embedHTML = str;
            pluginName = n;

            if (plugins[pluginName] && plugins[pluginName].closeCompletely) {
                let cxs = thisPlugin.window.node.querySelectorAll('.closing-x');
                let closingX = cxs[cxs.length - 1];
                closingX.addEventListener('click', () => {
                    bcast.fire('rqstClose', pluginName);
                    plugins[pluginName].closeCompletely();
                });
            }

            return plugins[name].window.node;
        },
        node: plugins[name].window.node,
    };
</script>

<style lang="less">
    @import 'embedbox.less';
</style>
