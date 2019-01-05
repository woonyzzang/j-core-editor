/**
 * [UPLEAT] UI Dev Team
 * @module Menu
 * @description 모바일 전체 메뉴
 * @author Oh Ji Hwan
 * @email ohjihwan@upleat.com
 * @create {{년도.월.일}}
 *
 * @param {{{타입}}} | {{설명}}
 *
 * @example
 * {{예제코드}}
 */

;(function(global, doc, core, $, _) {
    'use strict';

    core.module.Menu = function(app) {
        app.menu = core.Class({
            __constructor: function() {
                this._init();
                this.evtListener();
            },

            /**
             * @method setting
             * @description 셋팅
             */
            setting: function() {
                var widArea = $('.menuCont').data('wid');

                $('.menuCont nav').css('width', widArea + '%');
            },

            /** 초기화 */
            _init: function() {
                this.setting();
            },

            /** 이벤트 핸들러 */
            evtListener: function() {
                // 익스8 하위 브라우저 적용 속도제한 이슈 X 제이쿼리 사용
                $('.ui_btn_switch').on('click', function() {
                    var $this = $.$(this);

                    if (!$this.hasClass('on')) {
                        $this.addClass('on');
                        $('.menu_cont').show();
                    } else {
                        $this.removeClass('on');
                        $('.menu_cont').hide();
                    }

                    $('.menuCont nav').animate({width: 'toggle', opacity: 'toggle'},150);
                });

                // // 익스 10 이상이며 에니메이트 변화가 필요한
                // $('.btn_switch.ani').prepend('<span></span><span></span><span></span>');
                //
                // $('.btn_switch.ani').on('click', function() {
                //     $('.menuCont.css').toggleClass('show');
                // });
            }
        });
    };
})(window, document, UPLEAT, jQuery, _);