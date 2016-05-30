/**
 * Easyllipsis 1.0.1 - A jQuery Plugin that produces a gradient ellipsis effect on specified elements
 * kmsdev.net
 *
 * Copyright © 2015 kmsdev.net
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Initializer
 * @param {boolean} [destroy]
 * @param {object} [opts]
 * @returns {*}
 */
$.fn.easyllipsis = function (destroy, opts) {
    if( typeof destroy === "object" ){
        opts = destroy;
        destroy = null;
    }
    var settings = $.extend({
        watch: true,
        allow_css_ellipsis: true,
        ending: {
            type: 'gradient'
        },
        observe: {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: false
        }
    }, opts);
    return this.each(function () {
        var $ele = $(this);
        var $this;

        if( destroy ){
            $.fn.easyllipsis.Remove($ele);
            return;
        }
        if( !$ele.is(':visible') ) return;
        if( $.fn.easyllipsis.CheckIfExist($ele) ) return;
        if( settings.allow_css_ellipsis && $.fn.easyllipsis.CheckCssEllipsis($ele) ) return;

        if( $ele.attr('data-avoidmutation') ) $ele.removeAttr('data-avoidmutation');

        var line_height = $.fn.easyllipsis.GetLineHeight($ele);
        var max_size = $.fn.easyllipsis.GetMaxSize($ele);

        var height = $.fn.easyllipsis.CalcHeight(max_size[1], line_height);

        if( height !== 0 && $.fn.easyllipsis.AllowElement($ele, max_size[2], height, line_height) ) {
            var html = $ele.html();
            $ele.empty().append('<div class="easyllipsis">' + html + '</div>');
            $this = $('.easyllipsis', $ele);

            if (!$this.hasClass('easyllipsis')) $this.addClass('easyllipsis');

            $this.append('<easyllipsis style="height: ' + line_height + 'px"></easyllipsis>');
            $this.height(height).attr('data-with', settings.ending.type);
        }
        if( settings.watch && (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver) ){
            setTimeout(function(){
                var target = $ele[0];
                var ob = new MutationObserver(function(mutations){
                    mutations.forEach(function(mutation){
                        if( $(mutation.target).attr('data-avoidmutation') ) return;
                        clearTimeout($.data(this, 'easyllipsis_mutation'));
                        $.data(this, 'easyllipsis_mutation', setTimeout(function () {
                            $.fn.easyllipsis.Renew($(mutation.target), opts);
                        }, 200));
                    });
                });
                ob.observe(target, settings.observe);
            }, 200);
        }
    });
};

/**
 * Check if an element has easyllipsis already
 * @param {jQuery} $e
 * @return bool
 */
$.fn.easyllipsis.CheckIfExist = function($e){
    return !!$('easyllipsis', $e).length;
};

/**
 * Allow an element to have ellipsis
 * @param {jQuery} $e
 * @param {number} max_height
 * @param {number} height
 * @param {number} line_height
 * @return boolean
 */
$.fn.easyllipsis.AllowElement = function($e, max_height, height, line_height){
    var real_height, current_lines, total_lines;
    var $clone = $e.clone();
    $clone.insertAfter($e);
    $clone.height('auto').css('maxHeight', 'none');
    real_height = $clone.height();
    $clone.remove();
    current_lines = height / line_height;
    total_lines = real_height / line_height;
    return !(current_lines == total_lines);
};

/**
 * Check if an element has simple css ellipsis
 * @param {jQuery} $e
 * @return bool
 */
$.fn.easyllipsis.CheckCssEllipsis = function($e){
    return $e.css('overflow') == "hidden" && $e.css('white-space') == "nowrap" && $e.css('text-overflow') == "ellipsis";
};

/**
 * Calculate the line height of an element
 * @param {jQuery} $e
 * @return number
 */
$.fn.easyllipsis.GetLineHeight = function ($e) {
    var line_height = $e.css('lineHeight').replace(/px/, '');
    if( isNaN(line_height) ){
        var fontsize = $e.css('fontSize');
        if( /rem/.test(fontsize) ){
            fontsize = parseFloat(fontsize.replace(/rem/, '')) * parseInt($('html').css('fontSize').replace(/px/, '')) + 'px';
        }
        if( /normal/.test($e.css('lineHeight')) ){
            line_height = fontsize.replace(/px/, '');
            $e.css('lineHeight', $e.css('fontSize'));
        }
        else if( /%/.test($e.css('lineHeight')) ){
            line_height = fontsize.replace(/px/, '') * $e.css('lineHeight').replace(/%/, '');
        }
    }
    return parseInt(line_height);
};

/**
 * Calculate the measures of an element (widht, height and max height)
 * @param {jQuery} $e
 * @return array
 */
$.fn.easyllipsis.GetMaxSize = function ($e) {
    var w, h, mh;
    w = !!$e.css('max-width').length && $e.css('max-width') != "none" ? $e.css('max-width') : $e.width() !== 0 ? $e.width().toString() : '0';
    h = $e.height() !== 0 ? $e.height().toString() : '0';
    mh = !!$e.css('max-height').length && $e.css('max-height') != "none" ? $e.css('max-height') : h;
    w = parseInt(w.replace(/px/, ''));
    h = parseInt(h.replace(/px/, ''));
    mh = parseInt(mh.replace(/px/, ''));
    if (isNaN(w)) w = 0;
    if (isNaN(h)) h = 0;
    if (isNaN(mh)) mh = 0;
    return [w, h, mh];
};

/**
 * Calculate the real height based on the max height and the line height
 * @param {number} max
 * @param {number} lineheight
 * @return number
 */
$.fn.easyllipsis.CalcHeight = function (max, lineheight) {
    var result = 0;
    for (var i = max; i > 1; i--) {
        if (i > 0 && i % lineheight === 0) {
            result = i;
            break;
        }
    }
    return result;
};

/**
 * Remove and set again easyllipsis
 * @param {jQuery} $e
 * @param {function} options
 * @return void
 */
$.fn.easyllipsis.Renew = function($e, options){
    $e.attr('data-avoidmutation', true);
    $('easyllipsis', $e).remove();
    var html = $('.easyllipsis', $e).html();
    $e.html(html);
    $e.easyllipsis(options);
};

/**
 * Remove easyllipsis
 * @param {jQuery} $e
 * @return void
 */
$.fn.easyllipsis.Remove = function($e){
    $e.attr('data-avoidmutation', true);
    $('easyllipsis', $e).remove();
    var html = $('.easyllipsis', $e).html();
    $e.html(html);
};