/**
 * [UPLEAT] UI Dev Team
 * @module Menu
 * @description 메뉴
 * @author Oh Ji Hwan
 * @email ohjihwan@upleat.com
 * @create 2019.01.23
 * @version v1.0.0
 * @licence CC
 *
 * @param {String} | {최상위 틀 선택자} (selector) - (default - '.ui_ham_menu_area')
 * @param {String} | {메뉴 토글 버튼 (menuBtn) - (default - '.ui_menu_btn')
 * @param {String} | {메뉴 바닥에 딤} (menuDim) - (default - '.ui_menu_dim')
 * @param {String} | {메뉴 컨텐츠 박스} (menuCont) - (default - '.ui_menu_cont')
 * @param {Number} | {메뉴 쇼, 하이드 속도} (speed) - (default - 400)
 *
 * @example
 * <div class="ui_ham_menu_area">
 *     <button type="button" aria-label="메뉴" class="btn_menu menu_btn_ani ui_btn_menu"></button>
 *     <div class="dim_menu closer ui_dim_menu"></div>
 *     <div data-wid="80" class="cont ui_cont_menu"></div>
 * </div>
 */

;(function(global, doc, core, $, _) {
    'use strict';

    core.module.HamMenu = function(app) {
        app.hamMenu = core.Class({
            __constructor: function(options) {
                var defaults = {
                    menuArea: '.ui_ham_menu_area',    // 메뉴 버튼 클래스
                    menuBtn: '.ui_btn_menu',          // 메뉴 버튼 클래스
                    menuDim: '.ui_dim_menu',          // 메뉴 바닥(딤드) 클래스
                    menuCont: '.ui_cont_menu',        // 메뉴 컨텐츠 클래스
                    moveLeft: '.ui_left_move',        // 메뉴 이동 클래스
                    speed: 150                        // 메뉴가 튀어나오는 시간 조절
                };

                options = _.extend(defaults, options);

                this.$menuArea = $(options.menuArea);
                this.$menuBtn = this.$menuArea.children(options.menuBtn);
                this.$menuDim = this.$menuArea.children(options.menuDim);
                this.$menuCont = this.$menuArea.children(options.menuCont);
                this.$contCloser = null;
                this.$moveLeft = this.$menuArea.children(options.moveLeft);
                this.menuSpeed = options.speed;

                this._init();
                this.evtListener();
            },

            /** 초기화 */
            _init: function() {
                var _that = this;

                this.$menuBtn.attr('title', '메뉴 열기').prepend('<i class="bar"></i><i class="bar"></i><i class="bar"></i>');
                this.$menuCont.attr('aria-hidden', true).append('<button type="button" class="ui_menu_cont_closer">메뉴 닫기</button>').hide();
                this.$contCloser = this.$menuCont.children('.ui_menu_cont_closer');
                this.$contCloser.css({overflow: 'hidden', width: 0, height: 0, border: 0, fontSize: 0});

                if (this.$moveLeft.length > 0) {
                    _that.$moveLeft.css('left', 0);
                }
            },

            /** 이벤트 핸들러 */
            evtListener: function() {
                var _that = this;

                // 열려있는 햄버거 메뉴 안에서 포커스가 돌게하는 스크립트
                this.$contCloser.on('focus', function() {
                    _that.$menuBtn.focus();
                });

                // DIM 처리 부분을 클릭해서 닫는 기능
                this.$menuArea.children('.closer').on('click', function() {
                    _that.$menuBtn.removeClass('on').attr('title', '메뉴 닫기');
                    _that.$menuDim.hide();
                    _that.$menuCont.stop().animate({
                        width: 'toggle',
                        opacity: 'toggle'
                    }, _that.menuSpeed);
                });

                // 버튼 토글 스크립트
                this.$menuBtn.on('click', function() {
                    if (!$(this).hasClass('on')) {
                        _that.$menuBtn.addClass('on').attr('title', '메뉴 닫기');
                        _that.$menuDim.show();
                        _that.$menuCont.attr('aria-hidden', false).css({width: _that.$menuCont.data('wid') + '%', height: _that.$menuCont.data('height') + '%'});
                    } else {
                        _that.$menuBtn.removeClass('on').attr('title', '메뉴 열기');
                        _that.$menuDim.hide();
                        _that.$menuCont.attr('aria-hidden', true);
                    }

                    // 버튼 토글 에니메이션
                    _that.$menuCont.stop().animate({
                        width: 'toggle',
                        opacity: 'toggle'
                    }, _that.menuSpeed);
                });
            }
        });
    };
})(window, document, UPLEAT, jQuery, _);