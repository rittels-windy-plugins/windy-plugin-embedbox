{@html embedHTML}

<script>
    //import bcast from '@windy/broadcast';
    //import { onDestroy, onMount } from 'svelte';
    import plugins from '@windy/plugins';

    import config from './pluginConfig';

    //import { globalCssNode, insertGlobalCss, removeGlobalCss } from './globalCss.js';

    const { name } = config;

   // let refs = {};

    let embedHTML = '';

    /*
    export const onopen = _params => {
    };

    onMount(() => {
        insertGlobalCss();
    });

    onDestroy(() => {
        removeGlobalCss();
    });

    */
    plugins[name].exports = {
        html: str=>{ embedHTML = str }
    };
    
</script>

<style lang="less">
    @import 'embedbox.less';
</style>
