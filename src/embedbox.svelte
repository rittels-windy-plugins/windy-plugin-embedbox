{#if embedHTML}
    <div bind:this={embedDiv} style:padding-bottom="3px">
        {@html embedHTML}
    </div>
{/if}

<div class="active-plugins">
    {#each activePlugins as name}
        <span>
            <button class:highlight={focused == name} on:click={() => bcast.fire('rqstOpen', name)}
                >{plugins[name].title}</button
            >
            <button
                class="closing-x"
                on:click={() => {
                    plugins[name].closeCompletely();
                    plugins[name].isActive = false; //should also be done in closeCompletely()
                    updateActivePlugins(name);
                }}
            ></button>
        </span>
    {/each}
</div>

<script>
    import { onDestroy, onMount } from 'svelte';
    import plugins from '@windy/plugins';
    import config from './pluginConfig';
    import bcast from '@windy/broadcast';
    import store from '@windy/store';
    import { getRefs } from '@windy/utils';

    const { name } = config;
    const thisPlugin = plugins[name];

    let activePlugins = [];
    /** last plugin opened and active,  it may be closed,  but no other plugin has been opened since */
    let focused;
    let embedDiv;
    /** last plugin to have sent html to embedDiv */
    let embedDivPlugin;
    let embedHTML = '';

    function checkFocused(plugin) {
        return (
            plugin &&
            plugin.includes('windy-plugin') &&
            plugin !== 'windy-plugin-picker-tools' &&
            plugin !== 'windy-plugin-embedbox' &&
            plugins[plugin].isOpen &&
            plugins[plugin].isActive
        );
    }

    function updateActivePlugins(plugin) {
        console.log('UPDATE ACT PLUGINS', plugin);
        if (!plugin.includes('windy-plugin')) return;

        // if closed,  then isOpen will be false,  focused will not be changed.
        if (checkFocused(plugin)) focused = plugin;

        activePlugins = Object.keys(plugins).filter(
            k =>
                k !== 'windy-plugin-picker-tools' &&
                k !== 'windy-plugin-embedbox' &&
                plugins[k].isActive,
        );

        // close this if no active plugins left
        if (activePlugins.length == 0) bcast.fire('rqstClose', name);
    }

    onMount(() => {
        // necessary?
        thisPlugin.isActive = true;

        // Remove plugin from stored installedPlugins,  so that it does not appear in the menu.
        // An pluginConfig option to specify whether should appear in menu would be useful
        setTimeout(() => {
            let installedPlugins = store.get('installedPlugins');
            let filteredPlugins = installedPlugins.filter(e => e.name !== name);
            if (filteredPlugins.length < installedPlugins.length) {
                store.remove('installedPlugins');
                store.set('installedPlugins', filteredPlugins);
            }
        });

        for (let p in plugins) {
            if (checkFocused(p)) focused = p;
        }
        bcast.on('pluginOpened', updateActivePlugins);
        bcast.on('pluginClosed', updateActivePlugins);
    });

    onDestroy(() => {
        thisPlugin.isActive = false;
        bcast.off('pluginOpened', updateActivePlugins);
        bcast.off('pluginClosed', updateActivePlugins);
    });

    plugins[name].exports = {
        setHTML: (str, n) => {
            console.log('setting HTML', n);
            embedHTML = str;
            embedDivPlugin = n;

            return new Promise((res, rej) => {
                setTimeout(() => {
                    const refs = getRefs(embedDiv);
                    res(refs);
                });
            });
        },

        // this should be called on closeCompletely by the using plugin
        clearHTML: n => {
            if (n == embedDivPlugin) embedHTML = '';
        },
    };
</script>

<style lang="less">
    @import 'embedbox.less?1712932225059';
</style>
