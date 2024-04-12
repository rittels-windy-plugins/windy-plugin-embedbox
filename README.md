## Embedded box tools

This is an internal plugin,  to be used by other plugins.  

It provides a list of active plugins.  Which can be opened or closed completely.   

It provides a box where plugins can send HTML to the embedded window.   

If another plugin uses this box,   it will be replaced.  

It exports the following methods,  which can be found at:

```W.plugins["windy-plugin-embedbox"].exports```

- setHTML ( string which is parsed by svelte as @html , name-of-the-plugin)

- clearHTML (name-of-the-plugin)  




