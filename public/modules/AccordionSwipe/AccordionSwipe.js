/**
 * [UPLEAT] UI Dev Team
 * @module AccordionSwipe
 * @description 아코디언 스와이프
 * @author Joe Seung Woon
 * @email seungwoon@upleat.com
 * @create 2019.02.20
 * @version v1.0.0
 * @licence CC
 *
 * @param {Object} options - 옵션 (optional)
 * @param {String} Object.selector: 아코디언 스와이프 선택자 (default - '.ui_accordion_swipe')
 * @param {Number} Object.maxHeight: 아코디언 스와이프 컨텐츠 펼침 높이값 (default - -150)
 * @param {Number} Object.distance: 아코디언 스와이프 터치 asixY 오차범위 값  (default - 40)
 * @param {Number} Object.speed: 아코디언 스와이프 슬라이딩 속도  (default - 250)
 *
 * @example
 * // HTML 구조
 * <div class="accordion_swipe ui_accordion_swipe">
 *     <div class="item">
 *         <div class="menu">
 *             <div class="hgroup">{{타이틀 영역}}</div>
 *             <div class="cont">{{컨텐츠 영역}}</div>
 *         </div>
 *     </div>
 * </div>
 *
 * // JavaScript 모듈 사용
 * {{LIB_NAME}}.accordionSwipe();
 * {{LIB_NAME}}.accordionSwipe({
 *     selector: '.ui_accordion_swipe', // 아코디언 스와이프 DOM 셀렉터
 *     maxHeight: -150, // 컨텐츠 펼침 상태 높이값(음수값)
 *     distance: 40, // 터치 asixY 오차범위 값
 *     speed: 250 // 슬라이딩 속도
 * });
 *
 * ;(function(global, doc, core, $) {
 *     'use strict';
 *
 *      core.modules(['AccordionSwipe'], function(Module) {
 *          new Module.accordionSwipe();
 *      });
 * })(window, document, UPLEAT, jQuery);
 */

;(function(global, doc, core, $, _) {
    'use strict';

    core.module.AccordionSwipe = function(app) {
        app.accordionSwipe = core.Class({
            __constructor: function(options) {
                var defaults = {
                    selector: '.ui_accordion_swipe', // DOM 선택자
                    maxHeight: -150, // asixY 축 높이값
                    distance: 40, // 오차범위
                    speed: 250 // 슬라이딩 속도
                };

                options = _.extend(defaults, options);

                this.$accordionSwipe = $(options.selector);
                this.$accordionSwipeItem = this.$accordionSwipe.find('.menu');
                this.MAX_HEIGHT = options.maxHeight;
                this.DISTANCE = options.distance;
                this.SPEED = options.speed;
                this.distance = 0;

                this.evtListener();
            },

            /**
             * @method move
             * @description 스와이프 AsixY 축 이동
             * @param {Object} $selector - jQuery DOM셀렉터
             * @param {Object} posY - Y축 이동거리
             */
            move: function($selector, posY) {
                $selector.animate({top: posY}, this.SPEED);
            },

            /* 이벤트 핸들러 */
            evtListener: function() {
                var _that = this;

                this.$accordionSwipeItem.swipe({
                    swipeStatus: function(event, phase, direction, distance) {
                        var $this = $(this);
                        var $item = $this.closest('.item'),
                            $accordionSwipeItemPrevs = $item.prevAll('.item').find('.menu'),
                            $accordionSwipeItemNexts = $item.nextAll('.item').find('.menu');

                        if (_.isEqual(phase, 'start')) {
                            _that.distance = 0;
                        } else if (!_.isEqual(phase, 'cancel') && !_.isEqual(phase, 'end')) {
                            var currentPosY = _.parseInt($this.css('top')),
                                updateDistance = _that.distance - distance;

                            if (_.isEqual(direction, 'up') && !_.isEqual(currentPosY, updateDistance)) {
                                currentPosY += updateDistance;

                                if (currentPosY <= _that.MAX_HEIGHT) { return; }
                            } else if (_.isEqual(direction, 'down') && !_.isEqual(currentPosY, -updateDistance)) {
                                currentPosY -= updateDistance;

                                if (currentPosY >= 0) { return; }
                            }

                            _that.distance = distance;

                            switch (direction) {
                                case 'up':
                                    _.forEach($accordionSwipeItemPrevs, function(elem) {
                                        if (_.parseInt($(elem).css('top')) > _that.MAX_HEIGHT) {
                                            $(elem).css('top', currentPosY);
                                        }
                                    });
                                    break;
                                case 'down':
                                    _.forEach($accordionSwipeItemNexts, function(elem) {
                                        if (_.parseInt($(elem).css('top')) < 0) {
                                            $(elem).css('top', currentPosY);
                                        }
                                    });
                                    break;
                            }

                            $this.css('top', currentPosY);
                        } else if (_.isEqual(phase, 'cancel')) {
                            switch (direction) {
                                case 'up':
                                    // 이미 펼침 상태일 경우 move cancel 방지
                                    if (_.isEqual(_.parseInt($this.css('top')), _that.MAX_HEIGHT)) { return; }

                                    if (distance <= _that.DISTANCE) {
                                        var _is_expanded = false;

                                        // PREV 방향의 형제 .menu 엘리먼트 펼침 상태 유/무 확인
                                        _.forEach($accordionSwipeItemPrevs, function(elem) {
                                            if (_.parseInt($(elem).css('top')) <= _that.MAX_HEIGHT) {
                                                _is_expanded = true;

                                                return false;
                                            }
                                        });

                                        if (_is_expanded) {
                                            _that.move($this, 0);
                                        } else {
                                            _that.move($this, 0);
                                            _that.move($accordionSwipeItemPrevs, 0);
                                        }
                                    } else {
                                        _that.move($accordionSwipeItemPrevs, _that.MAX_HEIGHT);
                                        _that.move($this, _that.MAX_HEIGHT);
                                    }
                                    break;
                                case 'down':
                                    if (distance <= _that.DISTANCE) {
                                        var _is_expanded  = false;

                                        // NEXT 방향의 형제 .menu 엘리먼트 펼침 상태 유/무 확인
                                        _.forEach($accordionSwipeItemNexts, function(elem) {
                                            if (_.parseInt($(elem).css('top')) >= 0) {
                                                _is_expanded = true;

                                                return false;
                                            }
                                        });

                                        if (_is_expanded) {
                                            _that.move($this, _that.MAX_HEIGHT);

                                            // 펼침 상태의 형제 .menu 엘리먼트 위치 원복
                                            _.forEach($accordionSwipeItemNexts, function(elem) {
                                                if (!_.isEqual(_.parseInt($(elem).css('top')), 0)) {
                                                    _that.move($(elem), _that.MAX_HEIGHT);
                                                }
                                            });
                                        } else {
                                            _that.move($this, _that.MAX_HEIGHT);
                                            _that.move($accordionSwipeItemNexts, _that.MAX_HEIGHT);
                                        }
                                    } else {
                                        _that.move($accordionSwipeItemNexts, 0);
                                        _that.move($this, 0);
                                    }
                                    break;
                            }
                        } else if (_.isEqual(phase, 'end')) {
                            switch (direction) {
                                case 'up':
                                    _that.move($accordionSwipeItemPrevs, _that.MAX_HEIGHT);
                                    _that.move($this, _that.MAX_HEIGHT);
                                    break;
                                case 'down':
                                    _that.move($accordionSwipeItemNexts, 0);
                                    _that.move($this, 0);
                                    break;
                            }
                        }
                    },
                    threshold: 200
                });
            }
        });
    };
})(window, document, UPLEAT, jQuery, _);