/**
 * [UPLEAT] UI Dev Team
 * @module ProgressScrollIndicator
 * @description 스크롤 진행률바
 * @author Joe Seung Woon
 * @email seungwoon@upleat.com
 * @create 2019.05.29
 * @version v1.0.0
 * @licence CC
 *
 * @param {Object} options - 옵션 (optional)
 * @param {String} Object.selector: 프로그레스 인디케이터 선택자 (default - '.ui_progress_scroll_indicator')
 * @param {String} Object.direction: 프로그레스 인디케이터 방향 (default - horizontal)
 * @param {Boolean} Object.percentageEnabled: 프로그레스 인디케이터 진행률 표시여부 (default - false)
 * @param {Function} Object.onStart: 프로그레스 인디케이터 스크롤 시작일 시 콜백함수
 * @param {Function} Object.onProgress: 프로그레스 인디케이터 스크롤 중일 시 콜백함수 ({Number} 진행률값 매개변수 반환)
 * @param {Function} Object.onEnd: 프로그레스 인디케이터 진행률 스크롤 마지막일 시 콜백함수
 *
 * @example
 * // HTML 구조
 * <div class="progress_scroll_indicator ui_progress_scroll_indicator">
 *     <div class="progress_scroll_bar"></div>
 * </div>
 *
 * // JavaScript 모듈 사용
 * ;(function(global, doc, core, $) {
 *     'use strict';
 *
 *     core.modules(['ProgressScrollIndicator'], function(Module) {
 *         new Module.progressScrollIndicator({
 *             selector: '.ui_progress_scroll_indicator', // DOM 선택자
 *             direction: 'vertical', // 프로그레스 인디케이터 방향
 *             percentageEnabled: true, // 프로그레스 인디케이터 진행률 표시여부
 *             onStart: function() { // 스크롤 시작일 시 콜백함수
 *                 console.log('onStart');
 *             },
 *             onProgress: function(per) { // 스크롤 중일 시 콜백함수
 *                 console.log(per);
 *             },
 *             onEnd: function() { // 스크롤 마지막일 시 콜백함수
 *                 console.log('onEnd');
 *             }
 *         });
 *     });
 * })(window, document, UPLEAT, jQuery);
 */

;(function(global, doc, core, $, _) {
    'use strict';

    core.module.ProgressScrollIndicator = function(app) {
        app.progressScrollIndicator = core.Class({
            __constructor: function(options) {
                var defaults = {
                    selector: '.ui_progress_scroll_indicator',
                    direction: 'horizontal',
                    percentageEnabled : false,
                    onStart : null,
                    onProgress : null,
                    onEnd : null
                };

                options = _.extend(defaults, options);

                this.$progressScrollIndicator = $(options.selector);
                this.$progressScrollBar = this.$progressScrollIndicator.children('.progress_scroll_bar');
                this.$progressScrollOutput = $('<span />', {'class': 'progress_scroll_output'});
                this.data = {
                    percentage: 0
                };

                this._init(options);
                this.evtListener(options);
            },

            /**
             * horizontalMove
             * @description 가로방향 바 이동
             * @param {Number} per - 스크롤 진행률 퍼센트값
             */
            horizontalMove: function(per) {
                if (core.css3.support3D) {
                    this.$progressScrollBar.css(core.css3.prefix('transform'), 'translate3d(-' + (100 - per) + '%, 0, 0)');
                } else {
                    this.$progressScrollBar.css('left', -(100 - per) + '%');
                }
            },

            /**
             * verticalMove
             * @description 세로방향 바 이동
             * @param {Number} per - 스크롤 진행률 퍼센트값
             */
            verticalMove: function(per) {
                if (core.css3.support3D) {
                    this.$progressScrollBar.css(core.css3.prefix('transform'), 'translate3d(0, -' + (100 - per) + '%, 0)');
                } else {
                    this.$progressScrollBar.css('top', -(100 - per) + '%');
                }
            },

            /** 초기화 */
            _init: function(options) {
                this.$progressScrollIndicator.data('direction', options.direction).attr('data-direction', options.direction);

                switch (this.$progressScrollIndicator.data('direction')) {
                    case 'horizontal':
                        (core.css3.support3D) ? this.$progressScrollBar.css({transform: 'translate3d(-100%, 0, 0)'}) : this.$progressScrollBar.css({left: '-100%'});
                        break;
                    case 'vertical':
                        (core.css3.support3D) ? this.$progressScrollBar.css({transform: 'translate3d(0, -100%, 0)'}) : this.$progressScrollBar.css({top: '-100%'});
                        break;
                }

                global.setTimeout(_.bind(function() {
                    if (core.css3.support3D) {
                        this.$progressScrollBar.css({transition: 'transform .4s cubic-bezier(.14,.52,.4,.78)', willChange: 'transform'});
                    } else {
                        this.$progressScrollBar.css({position: 'absolute', width: '100%'});
                    }
                }, this), 0);

                if (options.percentageEnabled) {
                    this.$progressScrollOutput.attr('title', '진행률').text('0%');
                    this.$progressScrollBar.append(this.$progressScrollOutput);
                }
            },

            /** 이벤트 핸들러  */
            evtListener: function(options) {
                var _that = this;

                $(global).on('scroll', _.debounce(function() {
                    var $this = $(this);
                    var dataset = _.clone(_that.data);

                    dataset.percentage = ($this.scrollTop() / ($(doc).outerHeight() - $this.height())) * 100;

                    switch (_that.$progressScrollIndicator.data('direction')) {
                        case 'horizontal':
                            _that.horizontalMove(dataset.percentage);
                            break;
                        case 'vertical':
                            _that.verticalMove(dataset.percentage);
                            break;
                    }

                    if (options.percentageEnabled && !_.isNaN(dataset.percentage)) { _that.$progressScrollOutput.text(_.parseInt(dataset.percentage) + '%'); }

                    if (_.isEqual(dataset.percentage, 0)) {
                        _.isFunction(options.onStart) && options.onStart();
                    } else if (_.isEqual(dataset.percentage, 100)) {
                        _.isFunction(options.onEnd) && options.onEnd();
                    } else {
                        _.isFunction(options.onProgress) && options.onProgress(_.parseInt(dataset.percentage));
                    }
                }, 15)).trigger('scroll');
            }
        });
    };
})(window, document, UPLEAT, jQuery, _);