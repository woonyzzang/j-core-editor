/**
 * [UPLEAT] UI Dev Team
 * @module Modal
 * @description 모달 팝업
 * @author Baek, Eun Sook
 * @email esbaek@upleat.com
 * @create 2019.3.7
 * @version v1.0.0
 * @licence CC
 *
 * @example
 * // css
 * .dimmed{position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,.5);background:#000;opacity:0.5;filter: alpha(opacity=50);z-index:-1}
 *
 *  body.modal_on{overflow:hidden}
 * .ly_pop{position:fixed;top:0;left:0;width:100%;height:100%;z-index:1}
 * .ly_pop[aria-hidden=true]{display:none}
 * .ly_pop_wrap{overflow-y:auto;position:absolute;top:0;left:0;right:0;bottom:0;width:50%;height:250px;min-height:200px;margin:auto;padding:50px;background:#fff;border:5px solid #666;border-radius:20px;color:#000}
 * .ly_pop_content,
 * .ly_pop_footer{margin-top:10px}
 * .ly_pop_footer .btn_pop_close{border:1px solid}
 *
 * // HTML 구조
 *<!-- 본문 -->
 *<div id="wrap">
 *    <h1>Modal Layer Popup</h1>
 *    <button type="button" data-modal-target="#layer1" data-dimmed-show="true" title="새창" class="btn_pop_open ui_btn_pop_open">레이어팝업 열기</button>
 *    <button type="button" data-modal-target="#layer1" data-dimmed-show="false" title="새창" class="btn_pop_open ui_btn_pop_open">레이어팝업 열기</button>
 *    <button type="button" data-modal-target="#layer1" title="새창" class="btn_pop_open ui_btn_pop_open">레이어팝업 열기</button>
 *</div>
 *
 *<!-- 레이어팝업 -->
 *<div role="dialog" aria-hidden="true" aria-labelledby="popTitle1" id="layer1" class="ly_pop ui_ly_pop">
 *    <div class="ly_pop_wrap">
 *        <div class="ly_pop_header">레이어팝업 헤더 영역</div>
 *        <div class="ly_pop_container">
 *            <div class="ly_pop_content">레이어팝업 콘텐츠 영역</div>
 *        </div>
 *        <div class="ly_pop_footer">레이어팝업 푸터 영역</div>
 *    </div>
 *</div>
 */

;(function(global, doc, core, $, _) {
    'use strict';

    core.module.Modal = function(app) {
        app.modal = core.Class({
            __constructor: function(options) {
                var defaults = {
                    dimmed: '#dimmed' // 딤드레이어
                };

                options = _.extend(defaults, options);

                this.$body = $('body');
                this.$wrap = $('#wrap');
                this.$select = null;
                this.target = null;
                this.$dimmed = $(options.dimmed);
                this.$btnPopOpen = $('.ui_btn_pop_open');
                this.$lyPop = $('.ui_ly_pop');
                this.$lyPopWrap = this.$lyPop.children('.ly_pop_wrap');
                this.$btnPopClose = this.$lyPop.find('.btn_pop_close');

                this._init(options);
                this.evtListener();
            },

            /**
             * @method open
             * @description 레이어 팝업 열기
             * @param {Object} selector - DOM셀렉터
             * @param {String} target - 모달타켓
             */
            open: function(selector, target) {
                this.$select = $(selector);
                this.target = target;

                this.$body.addClass('modal_on');
                this.$wrap.attr('aria-hidden', true);

                (typeof this.$select.data('dimmedShow') === 'undefined' || this.$select.data('dimmedShow')) ? this.$dimmed.show() : this.$dimmed.hide();
                
                $(this.target).attr('aria-hidden', false).show().find('a').eq(0).focus();
            },

            /**
             * @method hide
             * @description 레이어 팝업 닫기
             */
            hide: function() {
                this.$body.removeClass('modal_on');
                this.$wrap.attr('aria-hidden', false);
                this.$dimmed.hide();
                $(this.target).attr('aria-hidden', true).hide();
                this.$select.focus();
            },

            /* 초기화 */
            _init: function(options) {
                if (!this.$dimmed.length) {
                    this.$body.append('<div id="dimmed" class="dimmed" style="display:none"></div>');

                    this.$dimmed = $(options.dimmed);
                }
            },

            /* 이벤트 핸들러 */
            evtListener: function() {
                var _this = this;

                // 팝업 호출 버튼 클릭했을 때
                this.$btnPopOpen.on('click', function(e) {
                    e.preventDefault();

                    _this.open(this, $(this).data('modalTarget'));
                });

                // 팝업에서 닫기 버튼 클릭했을 때
                this.$btnPopClose.on('click', function(e) {
                    e.preventDefault();

                    _this.hide();
                });

                // 팝업 닫기버튼 키보드 제어(선택)
                this.$btnPopClose.on('keydown', function(e) {
                    var keyCode = e.keyCode || e.which;

                    if (e.shiftKey && keyCode === 9) { // shift+tab 키
                        $(this).prev().focus();
                    } else if (keyCode === 9) { // 탭키
                        e.preventDefault();

                        $(this).parents(this.$lyPopWrap).find('a').eq(0).focus();
                    }
                });

                // 팝업 첫번째 링크에 갔을 때 키보드 제어(선택)
                this.$lyPopWrap.find('a:first').on('keydown', function(e) {
                    var keyCode = e.keyCode || e.which;

                    if (e.shiftKey && keyCode === 9) { // shift+tab 키
                        e.preventDefault();

                        $(this).children(this.$btnPopClose).focus();
                    }
                });
            }
        });
    };
})(window, document, UPLEAT, jQuery, _);
