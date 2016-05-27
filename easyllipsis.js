/**
 * Easyllipsis 1.0.0 - A jQuery Plugin that produces a gradient ellipsis effect on specified elements
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
            type: 'gradient',
            width: 80 // overrides css
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

        if (height !== 0) {
            var html = $ele.html();
            $ele.empty().append('<div class="easyllipsis">' + html + '</div>');
            $this = $('.easyllipsis', $ele);

            if (!$this.hasClass('easyllipsis')) $this.addClass('easyllipsis');

            $this.append('<easyllipsis style="height: ' + line_height + 'px"></easyllipsis>');
            $this.height(height).attr('data-with', settings.ending.type);
            $('easyllipsis', $this).width(settings.ending.width);
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
 * @param {jQuery} $e
 * @return bool
 */
$.fn.easyllipsis.CheckIfExist = function($e){
    return !!$('easyllipsis', $e).length;
};

/**
 * @param {jQuery} $e
 * @return bool
 */
$.fn.easyllipsis.CheckCssEllipsis = function($e){
    return $e.css('overflow') == "hidden" && $e.css('white-space') == "nowrap" && $e.css('text-overflow') == "ellipsis";
};

/**
 * @param {jQuery} $e
 * @return number
 */
$.fn.easyllipsis.GetLineHeight = function ($e) {
    var lnh = $e.css('line-height') == "normal" ? parseInt($e.css('font-size').replace(/[A-z]+/, '')) + 2 + 'px' : $e.css('line-height');
    var h, $span = $('<span style="display: block; opacity: 0; position: absolute; font-family: '+ $e.css('font-family') +'; font-size: ' + parseInt($e.css('font-size').replace(/[A-z]/, '')) + 'px' + '; line-height: '+ lnh +';">' + $e.text().trim().substr(0, 10) + '</span>');
    $span.appendTo($e.parent());
    h = $span.height();
    $span.remove();
    return h;
};

/**
 * @param {jQuery} $e
 * @return array
 */
$.fn.easyllipsis.GetMaxSize = function ($e) {
    var w, h;
    w = !!$e.css('max-width').length && $e.css('max-width') != "none" ? $e.css('max-width') : $e.width() !== 0 ? $e.width().toString() : '0';
    h = !!$e.css('max-height').length && $e.css('max-height') != "none" ? $e.css('max-height') : $e.height() !== 0 ? $e.height().toString() : '0';
    w = parseInt(w.replace(/px/, ''));
    h = parseInt(h.replace(/px/, ''));
    if (isNaN(w)) w = 0;
    if (isNaN(h)) h = 0;
    return [w, h];
};

/**
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
 * @param {jQuery} $e
 * @return void
 */
$.fn.easyllipsis.Remove = function($e){
    $e.attr('data-avoidmutation', true);
    $('easyllipsis', $e).remove();
    var html = $('.easyllipsis', $e).html();
    $e.html(html);
};