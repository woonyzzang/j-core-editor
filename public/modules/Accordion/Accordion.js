/**
 * [UPLEAT] UI Dev Team
 * @module Accordion
 * @description 아코디언
 * @author CHO YEON SEUNG
 * @creat 2018.11.15
 * @version v1.0.0
 *
 * @param {Object} | 옵션 (optional)
 * @param {String} | Object.selector: 아코디언틀 선택자 (default - '.ui_accordion_wrap')
 * @param {String} | Object.title: 아코디언 타이틀 클래스명 (default - 'ui_accordion_tit')
 * @param {String} | Object.content: 아코디언 콘텐츠 클래스명  (default - 'ui_accordion_cont')
 * @param {Boolean} | Object.sliding: 아코디언 슬라이딩 효과 유무 (default - false)
 * @param {String} | Object.easing: 아코디언 슬라이딩 효과  (default - 'swing')
 * @param {String} | Object.seconds: 아코디언 슬라이딩 속도  (default - '400')
 * @param {Boolean} | Object.multi: 아코디언 열고닫힘 멀티유무 (default - true)
 *
 * @example
 *  // HTML 구조
 *  <html>
 *  <body>
 *      <ul class="accordion_wrap">
 <li>
 <a href="#" role="button">타이틀 영역</a>
 <div>콘텐츠 영역</div>
 </li>
 <li>
 <button type="button">타이틀 영역</button>
 <div>콘텐츠 영역</div>
 </li>
 </ul>
 *  </body>
 *  </html>
 */

;(function(global, doc, core, $) {
    'use strict';

    core.module.Accordion = function(app) {
        app.accordion = core.Class({
            __constructor: function(options) {

                var defaults = {
                    selector: '.ui_accordion_wrap', // 아코디언 틀 선택자
                    title: 'ui_accordion_tit', // 아코디언 타이틀 클래스명
                    content: 'ui_accordion_cont', //아코디언 콘텐츠 클래스명
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
                this.$titActive = $('.' + options.title + '.active');
                this.$cont = $('.' + options.content);
                this.$sliding = options.sliding;
                this.$easing = options.easing;
                this.$sec = options.seconds;
                this.init();
                this.evtListener(options);
            },

            // 초기화
            init: function() {
                this.$tit.attr({"title":"비활성화", "role":"heading", "aria-expanded":false}); // 접근성관련 타이틀 헤딩태그
                this.$cont.attr({"tabindex":"-1", "role":"region", "aria-hidden":true}); // 접근성관련 콘텐츠 헤딩태그
            },

            // 접기
            panelCollapse: function(elem, options) {
                var $elem = $(elem);
                if (!this.$sliding) {
                    $elem.attr({"title":"비활성화", "aria-expanded":false}).removeClass('active').next(this.$cont).attr({"tabindex":"-1", "aria-hidden":true}).hide();
                    if (options === 'all') {  // 전체접기(hide)
                        this.$tit.each(function() {
                            $.$(this).attr({"title":"비활성화", "aria-expanded":false}).removeClass('active').next(this.$cont).attr({"tabindex":"-1", "aria-hidden":true}).hide();
                        });
                    }
                } else {
                    $elem.attr({"title":"비활성화", "aria-expanded":false}).removeClass('active').next(this.$cont).attr({"tabindex":"-1", "aria-hidden":true}).slideUp(this.$sec, this.$easing);
                    if (options === 'all') { // 전체접기(sliding)
                        this.$tit.each(function() {
                            $.$(this).attr({"title":"비활성화", "aria-expanded":false}).removeClass('active').next(this.$cont).attr({"tabindex":"-1", "aria-hidden":true}).slideUp(this.$sec, this.$easing);
                        });
                    }
                }
            },

            // 펼치기
            panelExpansion: function(elem, options) {
                var $elem = $(elem);
                if (!this.$sliding) {
                    if (options.multi) { // 한 패널 선택시 다른 패널은 자동으로 닫힘
                        $elem.attr({"title":"활성화", "aria-expanded":true}).addClass('active').next(this.$cont).attr({"tabindex":"0", "aria-hidden":false}).show();
                        $elem.parent().siblings().children('a, button').attr({"title":"비활성화", "aria-expanded":false}).removeClass('active').next(this.$cont).attr({"tabindex":"-1","aria-hidden":true}).hide();
                    } else { // 한 패널 선택시 다른 패널 그대로 열려있음
                        $elem.attr({"title":"활성화", "aria-expanded":true}).addClass('active').next(this.$cont).attr({"tabindex":"0", "aria-hidden":false}).show();
                    }

                    if (options === 'all') { // 전체펼치기(hide)
                        this.$tit.each(function() {
                            $.$(this).attr({"title":"활성화", "aria-expanded":true}).addClass('active').next(this.$cont).attr({"tabindex":"0", "aria-hidden":false}).show();
                        });
                    }
                } else {
                    if (options.multi) { // 한 패널 선택시 다른 패널은 자동으로 닫힘
                        $elem.attr({"title":"활성화", "aria-expanded":true}).addClass('active').next(this.$cont).attr({"tabindex":"0", "aria-hidden":false}).slideDown(this.$sec, this.$easing);
                        $elem.parent().siblings().children('a, button').attr({"title":"비활성화", "aria-expanded":false}).removeClass('active').next(this.$cont).attr({"tabindex":"-1", "aria-hidden":true}).slideUp(this.$sec, this.$easing);
                    } else { // 한 패널 선택시 다른 패널 그대로 열려있음
                        $elem.attr({"title":"활성화", "aria-expanded":true}).addClass('active').next(this.$cont).attr({"tabindex":"0", "aria-hidden":false}).slideDown(this.$sec, this.$easing);
                    }

                    if (options === 'all') { // 전체펼치기(sliding)
                        this.$tit.each(function() {
                            $.$(this).attr({"title":"활성화", "aria-expanded":true}).addClass('active').next(this.$cont).attr({"tabindex":"0", "aria-hidden":false}).slideDown(this.$sec, this.$easing);
                        });
                    }
                }
            },

            // 이벤트
            evtListener: function(options) {
                var _this = this;
                _this.$tit.on('click', function(e) {
                    e.preventDefault();
                    if(!$(this).next(this.$cont).is(':animated')){
                        if (!$(this).is('.active')) {
                            _this.panelExpansion(this, options);
                        } else {
                            _this.panelCollapse(this, options);
                        }
                    }
                });
            }
        });
    };
})(window, document, UPLEAT, jQuery);