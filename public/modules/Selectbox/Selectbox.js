/**
 * [UPLEAT] UI Dev Team
 * @module Selectbox
 * @description 셀렉트박스
 * @author Song Min Gyu
 * @email pakage@upleat.com
 * @create 2019.03.12
 * @version v1.0.0
 * @licence CC
 *
 * @param {Object} | 옵션 (optional)
 * @param {String} | Object.selectWrap: 셀렉모듈 상위 Wrapper 클래스명 (default - 'select_wrap')
 * @param {String} | Object.selectHeader: 셀렉트모듈 헤더 클래스명 (default - 'select_header')
 * @param {String} | Object.selOptions: 셀렉트모듈 옵션 Wrapper 클래스명 (default - 'select_options')
 * @param {String} | Object.class: 셀렉트박스 클래스명 (default - '')
 * @param {Boolean} | Object.onChgLink: 셀렉트 OnChange 링크 이벤트유무 (default - 'false') // 미구현
 *
 * @example
 * // HTML 구조
 * <select class="ori-select">
 *     <option value="january">January</option>
 *     <option value="february">February</option>
 * </select>
 *
 * <select class="ori-select" data-width="200"> // data-width 값으로 임의의 넓이로 조정가능
 *     <option value="january">January</option>
 *     <option value="february">February</option>
 * </select>
 *
 * ;(function(global, doc, core, $) {
 *     'use strict';
 *
 *    core.modules(['SelectUI'], function(Module) {
 *      new Module.SelectUI({class: 'ori-select', onChgLink: 'false'});
 *    });
 * })(window, document, UPLEAT, jQuery);
 */

;(function(global, doc, core, $, _) {
    'use strict';

    core.module.Selectbox = function(app) {
        app.selectbox = core.Class({
            __constructor: function(options) {
                var defaults = {
                    selector: 'ui_selectbox',
                    selectHeader: 'select_header',
                    selOptions: 'select_options',
                    onChgLink: false
                };

                options = _.extend(defaults, options);

                this._init(options);
                this._evtListener(options);
            },

            /**
             * @method _targetWidth
             * @description 옵션길이에 따라 가로넓이 자동조절 (fix width일 경우 select에 data-width값을 넣어준다)\
             * @param {Object} el - 타겟 셀렉트박스
             * @param {Object} options - 옵션
             */
            _targetWidth: function(el, options) {
                var elWrap = $(el).parent();

                if ($(el).data('width')) {
                    elWrap.css('width', $(el).data('width'));
                } else {
                    elWrap.css('width', elWrap.find('select').width() + 25);
                }
            },

            /**
             * @method _headerUpDown
             * @description 셀렉트헤더에서 키보드 Up/Down 이벤트 처리
             * @param {Object} evtOptionList - 셀렉트 옵션리스트(li)
             * @param {Object} idx - 선택된 셀렉트 옵션리스트 index
             * @param {Object} obj - 셀렉트 헤더
             * @param {Object} keyCode - 키보드이벤트 keyCode 값
             */
            _headerUpDown: function(evtOptionList, idx, obj, keyCode) {
                if ((keyCode === 40) && (idx < evtOptionList.length - 1)) {
                    idx++;
                } else if ((keyCode === 38) && (idx > 0)) {
                    idx--;
                }

                obj.text(evtOptionList.eq(idx).text());
                evtOptionList.eq(idx).addClass('selected').siblings().removeClass('selected');
                obj.prev().children('option').eq(idx).prop('selected', true);
            },

            /**
             * @method _showOptions
             * @description 옵션리스트 열기/접기
             * @param {Object} el - 타겟 셀렉트 헤더
             * @param {Object} options - 옵션
             */
            _showOptions: function(el, options) {
                $('.' + options.selectHeader + '.active').not(this).each(function() {
                    $(this).removeClass('active').next('.' + options.selOptions).hide();
                });

                $(el).toggleClass('active').next('.' + options.selOptions).toggle();
            },

            /**
             * TODO: 미구현
             * @method _onChgLink
             * @description 셀렉트 onChange 이벤트 처리
             */
            // _onChgLink: function() {
            //     window.location.href='http://www.naver.com';
            // },

            /* 초기화 */
            _init: function(options) {
                var _this = this;
                var $frag = $(document.createDocumentFragment());

                _this.$selectList = $('select.' + options.selector);

                _.forEach(_this.$selectList, function(selects) {
                    var selectClassName = $(selects).attr('class');

                    $(selects).wrap('<div role="listbox" class="' + selectClassName + '">');
                    $(selects).addClass('select_hidden');

                    _this.$selectHeader = $('<div />', {
                        'tabindex': 0,
                        'aria-selected': true,
                        'class': options.selectHeader
                    }).insertAfter($(selects));

                    _this.$selectHeader.text($(selects).children('option').eq(0).text());

                    _this.$list = $('<ul />', {
                        'class': options.selOptions
                    }).insertAfter(_this.$selectHeader);

                    _.forEach($(selects).children('option'), function(el) {
                        $frag.append($(
                            '<li />', {
                                role: 'option',
                                rel: $(el).val(),
                                text: $(el).text()
                            }
                        ));
                    });

                    $frag.appendTo(_this.$list);
                    _this.$list.children('li').eq(0).addClass('selected');
                    _this._targetWidth(selects, options);
                });
            },

            /* 이벤트 핸들러 */
            _evtListener: function(options) {
                var _this = this;
                var optionHeader = _this.$selectList.next();
                var optionWrap = optionHeader.next();
                var optionList = optionWrap.children('li');

                $(doc).on('click', function(e) {
                    var container = $('.' + options.selector);

                    if (!container.has(e.target).length) { _this.$selectList.next('.select_header').removeClass('active').next().hide(); }
                });

                optionHeader.on('keydown mousedown', function(e) {
                    e.stopPropagation();

                    var $this = $.$(this);
                    var evtOptionList = $this.next().children('li');
                    var idx = $this.next().children('li.selected').index();

                    if ((e.type === 'mousedown') || (e.keyCode === 13)) {
                        if ($this.hasClass('active')) {
                            $this.removeClass('active');
                            $this.next().hide();
                        } else {
                            evtOptionList.removeClass('over');
                            _this._showOptions($this, options);
                        }
                    }

                    _this._headerUpDown(evtOptionList, idx, $this, e.keyCode);
                });

                optionList.on('mouseover', function() {
                    $(this).addClass('over').siblings().removeClass('over');
                });

                optionWrap.on('click', 'li', function(e) {
                    e.stopPropagation();

                    var $this = $.$(this);
                    var $selHeader = $this.parent('.' + options.selOptions).prev();

                    $selHeader.text($this.text()).removeClass('active').focus();
                    $this.addClass('selected').siblings().removeClass('selected').parent().hide().children('li').removeClass('over');
                    $selHeader.prev().children('option').eq($this.index()).prop('selected', true);

                    // TODO: 추후 구현 예정
                    // if (options.onChgLink) {
                    //     _this._onChgLink();
                    // }
                });
            }
        });
    };
})(window, document, UPLEAT, jQuery, _);
