/**
 * [UPLEAT] UI Dev Team
 * @module Accordion
 * @description 아코디언
 * @author Cho Yeon Seung
 * @email irene@upleat.com
 * @create 2018.11.15
 * @version v1.0.0
 * @licence CC
 *
 * @param {Object} options - 옵션 (optional)
 * @param {String} Object.selector: 아코디언틀 선택자 (default - '.ui_accordion_area')
 * @param {String} Object.title: 아코디언 타이틀 클래스명 (default - 'accordion_tit')
 * @param {String} Object.content: 아코디언 콘텐츠 클래스명  (default - 'accordion_cont')
 * @param {Boolean} Object.sliding: 아코디언 슬라이딩 효과 유무 (default - false)
 * @param {String} Object.easing: 아코디언 슬라이딩 효과  (default - 'swing')
 * @param {String} Object.seconds: 아코디언 슬라이딩 속도  (default - '400')
 * @param {Boolean} Object.multi: 아코디언 열고닫힘 멀티유무 (default - true)
 *
 * @example
 * // HTML 구조
 * <ul class="accordion_wrap">
 *     <li>
 *         <a href="#" role="button">타이틀 영역</a>
 *         <div>콘텐츠 영역</div>
 *     </li>
 * </ul>
 */

;(function(global, doc, core, $) {
    'use strict';

    core.module.Accordion = function(app) {
        app.accordion = core.Class({
            __constructor: function(options) {
                var defaults = {
                    selector: '.ui_accordion_area', // 아코디언 틀 선택자
                    title: 'accordion_tit', // 아코디언 타이틀 클래스명
                    content: 'accordion_cont', //아코디언 콘텐츠 클래스명
                    sliding: false, // 아코디언 슬라이딩 효과 유무
                    easing: 'swing', // 아코디언 슬라이딩 효과
                    seconds: 400, // 아코디언 슬라이딩 속도
                    multi: true // 아코디언 열고닫힘 멀티 유무
                };

                options = _.extend(defaults, options);

                var $accordionList = $(options.selector).children();

                $accordionList.children().addClass(options.content);

                if ($accordionList.children('a, button')) { $accordionList.children('a, button').removeClass(options.content).addClass(options.title); }

                this.$accordionWrap = $(options.selector);
                this.$tit = this.$accordionWrap.find('.' + options.title);
                this.$cont = this.$accordionWrap.find('.' + options.content);
                this.$sliding = options.sliding;
                this.$easing = options.easing;
                this.$sec = options.seconds;

                this._init();
                this.evtListener(options);
            },

            /**
             * @method panelCollapse
             * @description 패널 접기
             * @param {Object} elem - DOM셀렉터
             * @param {Object} options - 옵션
             */
            panelCollapse: function(elem, options) {
                var $elem = $(elem);

                if (!this.$sliding) {
                    $elem.attr({title: '비활성화', 'aria-expanded': false}).removeClass('active').next(this.$cont).attr({tabindex: -1, 'aria-hidden': true}).hide();
                    if (options === 'all') { // 전체접기(hide)
                        this.$tit.each(function() {
                            $.$(this).attr({title: '비활성화', 'aria-expanded': false}).removeClass('active').next(this.$cont).attr({tabindex: -1, 'aria-hidden': true}).hide();
                        });
                    }
                } else {
                    $elem.attr({title: '비활성화', 'aria-expanded': false}).removeClass('active').next(this.$cont).attr({tabindex: -1, 'aria-hidden': true}).slideUp(this.$sec, this.$easing);

                    if (options === 'all') { // 전체접기(sliding)
                        this.$tit.each(function() {
                            $.$(this).attr({title: '비활성화', 'aria-expanded': false}).removeClass('active').next(this.$cont).attr({tabindex: -1, 'aria-hidden': true}).slideUp(this.$sec, this.$easing);
                        });
                    }
                }
            },

            /**
             * @method panelExpansion
             * @description 패널 펼치기
             * @param {Object} elem - DOM셀렉터
             * @param {Object} options - 옵션
             */
            panelExpansion: function(elem, options) {
                var $elem = $(elem);
                
                if (!this.$sliding) {
                    if (options.multi) { // 한 패널 선택시 다른 패널은 자동으로 닫힘
                        $elem.attr({title: '활성화', 'aria-expanded': true}).addClass('active').next(this.$cont).attr({tabindex: 0, 'aria-hidden': false}).show();
                        $elem.parent().siblings().children('a, button').attr({title: '비활성화', 'aria-expanded': false}).removeClass('active').next(this.$cont).attr({'tabindex': -1, 'aria-hidden': true}).hide();
                    } else { // 한 패널 선택시 다른 패널 그대로 열려있음
                        $elem.attr({title: '활성화', 'aria-expanded': true}).addClass('active').next(this.$cont).attr({tabindex: 0, 'aria-hidden': false}).show();
                    }

                    if (options === 'all') { // 전체펼치기(hide)
                        this.$tit.each(function() {
                            $.$(this).attr({title: '활성화', 'aria-expanded': true}).addClass('active').next(this.$cont).attr({tabindex: 0, 'aria-hidden': false}).show();
                        });
                    }
                } else {
                    if (options.multi) { // 한 패널 선택시 다른 패널은 자동으로 닫힘
                        $elem.attr({title: '활성화', 'aria-expanded': true}).addClass('active').next(this.$cont).attr({tabindex: 0, 'aria-hidden': false}).slideDown(this.$sec, this.$easing);
                        $elem.parent().siblings().children('a, button').attr({title: '비활성화', 'aria-expanded': false}).removeClass('active').next(this.$cont).attr({tabindex: -1, 'aria-hidden': true}).slideUp(this.$sec, this.$easing);
                    } else { // 한 패널 선택시 다른 패널 그대로 열려있음
                        $elem.attr({title: '활성화', 'aria-expanded': true}).addClass('active').next(this.$cont).attr({tabindex: 0, 'aria-hidden': false}).slideDown(this.$sec, this.$easing);
                    }

                    if (options === 'all') { // 전체펼치기(sliding)
                        this.$tit.each(function() {
                            $.$(this).attr({title: '활성화', 'aria-expanded': true}).addClass('active').next(this.$cont).attr({tabindex: 0, 'aria-hidden': false}).slideDown(this.$sec, this.$easing);
                        });
                    }
                }
            },

            /** 초기화 */
            _init: function() {
                this.$tit.attr({title: '비활성화', role: 'heading', 'aria-expanded': false}); // 접근성관련 타이틀 헤딩태그
                this.$cont.attr({tabindex: -1, role: 'region', 'aria-hidden': true}); // 접근성관련 콘텐츠 헤딩태그
            },

            /** 이벤트 핸들러 */
            evtListener: function(options) {
                var _this = this;

                _this.$tit.on('click', function(e) {
                    e.preventDefault();

                    if (!$(this).next(this.$cont).is(':animated')) {
                        (!$(this).is('.active'))? _this.panelExpansion(this, options) : _this.panelCollapse(this, options);
                    }
                });
            }
        });
    };
})(window, document, UPLEAT, jQuery);