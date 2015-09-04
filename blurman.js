(function(window, document, $) {
  'use strict';

  var BlurMan = function(element, customOptions) {

    var defaults = {
          deep: 0
        },
        cache = {
          filterId: 0
        };
    var prefixes = ['', '-moz-', '-webkit-', '-o-', '-ms-', '-khtml-'];
    var cssProperty = '',
        filterId,
        svgGaussianFilter,
        $body = $('body');

    // Modernizr.js
    var detectCompatibility = {
      // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/css/filters.js
      cssFilter: function () {
        var el = document.createElement('a');

        el.style.cssText = prefixes.join('filter:blur(2px); ');
        // https://github.com/Modernizr/Modernizr/issues/615
        // documentMode is needed for false positives in oldIE, please see issue above
        return !!el.style.length && ((document.documentMode === undefined || document.documentMode > 9));
      },

      // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/svg/filters.js
      svgFilter: function () {
        var result = false;
        try {
          result = 'SVGFEColorMatrixElement' in window &&
            SVGFEColorMatrixElement.SVG_FECOLORMATRIX_TYPE_SATURATE == 2;
        }
        catch (e) {}
        return result;
      }
    };

    function getCssPrefixr () {
      var el = document.createElement('a'),
          cssPrefix = '';
      for (var i = 0; i < prefixes.length; i++) {
        var _cssPrefix = prefixes[i].replace(/\-/g, '')
                                    .replace(/(\w)/, function ($) {
                                      if ($ != 'm') {
                                        return $.toUpperCase();
                                      } else {
                                        return $;
                                      }
                                    });
        if (el.style[_cssPrefix + 'Filter'] != undefined) {
          cssPrefix = prefixes[i];
        }
      };

      return cssPrefix;
    };

    function createSvgFilter () {
      var createSvgElement = function(tagName) {
        return document.createElementNS('http://www.w3.org/2000/svg', tagName);
      };

      var svg = createSvgElement('svg'),
        filter = createSvgElement('filter');

      svgGaussianFilter = createSvgElement('feGaussianBlur');

      svg.setAttribute('style', 'position:absolute');
      svg.setAttribute('width', '0');
      svg.setAttribute('height', '0');

      filter.setAttribute('id', 'blurman-id-' + cache.filterId);

      filter.appendChild(svgGaussianFilter);
      svg.appendChild(filter);

      $body.append(svg);
    }

    // init blur man
    this.init = function() {

      $.extend(defaults, customOptions);

      if (detectCompatibility.svgFilter()) {
        createSvgFilter();
      }

      filterId = cache.filterId;

      cache.filterId++;

      this.blur();

      return this;
    };

    this.blur = function() {
      var pref = getCssPrefixr();

      // set the completely css property
      cssProperty = pref + 'filter';

      // css filter
      if (detectCompatibility.cssFilter()) {
        element.css(cssProperty, 'blur(' + defaults.deep + 'px)')
      }

      // svg filter
      else if (detectCompatibility.svgFilter()) {
        svgGaussianFilter.setAttribute('stdDeviation', options.intensity);
        element.css('filter', 'url(' + svgUrl + '#blurman-id-' + filterId + ')');
      }

      // IE
      else {
        element.css('filter', 'progid:DXImageTransform.Microsoft.Blur(pixelradius=' + defaults.deeep + ')');
      }

      return this;
    };

    this.unblur = function () {
      element.css(cssProperty, 'none');
      return this;
    }

    // init the plugin
    return this.init();
  };

  // add blur man
  $.fn.BlurMan = function(options) {
    return new BlurMan(this, options);
  };

}(window, document, jQuery));