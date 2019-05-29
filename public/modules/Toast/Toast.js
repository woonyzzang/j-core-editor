/**
 * [UPLEAT] UI Dev Team
 * @module Toast
 * @description 토스트팝업
 * @author Nam In Tae
 * @email nit@upleat.com
 * @create 2019.03.14
 * @version v1.0.0
 * @licence CC
 *
 * @param {Object} options - 옵션 (optional)
 * @param {String} Object.selector: 토스트팝업 선택자 (default - '.ui_toast')
 * @param {String} Object.direction: 토스트팝업 방향 (default - 'left') right,top,bottom
 * @param {Boolean} Object.center: 토스트팝업 센터 정렬 (default - false)
 * @param {String} Object.seconds: 토스트팝업 타임 속도  (default - '3000')
 *
 * @example
 * // HTML 구조
 * <button type="button" id="btnTest">클릭</button>
 *
 * <div class="toast ui_toast">
 *      <div class="inr">1 등록 되었습니다.</div>
 *      <button type="button" class="btn_close ui_btn_close"><span class="blind">닫기</span></button>
 * </div>
 */

;(function(global, doc, core, $, _) {
    'use strict';

    core.module.Toast = function(app) {
        app.toast = core.Class({
            __constructor: function(options) {
                var defaults = {
                    selector: '.ui_toast',
                    direction: 'left',
                    center: false,
                    seconds: 3000
                };

                options = _.extend(defaults, options);

                this.$toast = $(options.selector);
                this.$btnClose = this.$toast.children('.ui_btn_close');
                this.toastHeight = this.$toast.outerHeight();
                this.toastWidth = this.$toast.outerWidth();
                this.direction = options.direction;
                this.seconds = options.seconds;
                this.setTime = 0;
                this.is_animated = false;

                this._init(options);
                this.evtListener(options);
            },

            /**
             * @method show
             * @description 토스트팝업 보기
             */
            show: function() {
                var directionOpt = {};

                directionOpt[this.direction] = 0;

                if (!this.is_animated) {
                    this.$toast.stop().animate(directionOpt).attr({tabindex: 0, 'aria-hidden': false}).addClass('active');
                    this.timer();
                }

                this.is_animated = true;
            },

            /**
             * @method hide
             * @description 토스트팝업 숨김
             */
            hide: function() {
                var directionOpt = {};
                var _oriPos = 0;

                switch (this.direction) {
                    case 'left' :
                    case 'right' :
                        _oriPos = -this.toastWidth;
                        break;
                    case 'bottom' :
                    case 'top' :
                        _oriPos = -this.toastHeight;
                        break;
                }

                directionOpt[this.direction] = _oriPos;

                this.$toast.stop().animate(directionOpt, function() {
                    $(this).removeClass('active');
                }).attr({tabindex: -1, 'aria-hidden': true});

                this.is_animated = false;
            },

            /**
             * @method timer
             * @description 토스트팝업 타임 설정
             */
            timer: function() {
                var _this = this;

                this.setTime = setTimeout(function() {
                    _this.hide();
                }, this.seconds);
            },

            /* 초기화 */
            _init: function(options) {
                var directionOpt = {};

                switch (this.direction) {
                    case 'left' :
                    case 'right' :
                        directionOpt[this.direction] = -this.toastWidth;

                        this.$toast.css(directionOpt).attr({tabindex: -1, 'aria-hidden': true});

                        if (options.center) { this.$toast.css({top: '50%', marginTop: -this.toastHeight / 2}); }
                        break;
                    case 'bottom' :
                    case 'top' :
                        directionOpt[this.direction] = -this.toastHeight;

                        this.$toast.css(directionOpt).attr({tabindex: -1, 'aria-hidden': true});

                        if (options.center) { this.$toast.css({left: '50%', marginLeft: -this.toastWidth / 2}); }
                        if (this.direction === 'bottom') { this.$toast.css({top: 'auto'}); }
                        break;
                }
            },

            /* 이벤트 핸들러 */
            evtListener: function() {
                var _this = this;

                this.$btnClose.on('click', function() {
                    _this.hide();
                    clearTimeout(_this.setTime);
                });
            }
        });
    };
})(window, document, UPLEAT, jQuery, _);
