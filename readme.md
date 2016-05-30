# Easyllipsis 1.0.1
A jQuery Plugin that produces a gradient ellipsis effect on specified elements

##### What is required:

This plugin only needs to know the height of the target element. This height can be set by `height` or `max-height`. Using both values works too.
It is recommended (**not required**) the use of `line-height`. If this value does not exist, the plugin will apply it with the font size value.

##### What won't work:

At the moment this plugin does not recognize `em` measures, but root ones (`rem`) are valid.

##### Basic usage:

This plugin is thought for an easy implementation, so in the most of cases is not necessary the use of options.

`$('p.ellipsis').easyllipsis();` will apply the plugin to all paragraphs with *ellipsis* class.
`$('p.ellipsis').easyllipsis(true);` will destroy (remove) the ellipsis on such elements.

The CSS file has the gradient style and its width by default. Better, instead of change the default values, override them in your own CSS. 

##### Usage with Options (explanation):

```
$('p.ellipsis').easyllipsis({
    watch: true, // the plugin will look for dom changes to re-apply the ellipsis
    allow_css_ellipsis: true, // if an element has its own ellipsis made with css, the plugin will avoid this element
    ending: {
        type: 'gradient' // type of ending, currently there is only gradient. let's see in the future
    },
    observe: { // this properties belong to DOM MutationObserver (see References)
        attributes: true,
        childList: true,
        characterData: true,
        subtree: false
    }
});
```

&nbsp;
---
###### References
1. [jQuery](https://jquery.com/)
2. [MutationObserver - MDN](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
3. [CSS linear-gradient() - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient)