/**
 * [UPLEAT] UI Dev Team
 * @module VisualRolling
 * @description 롤링 스크립트 제작
 * @author 노영일
 * @email dol_brain@upleat.com
 * @create 2018.12.18
 * @version v1.0.0
 * @licence CC
 *
 * @param {String} | {최상위 틀 선택자} (selector) - (default - '.ui_rolling_banner_area')
 * @param {String} | {bannerWrap의 틀 선택자} (bannerArea) - (default - '.rolling_banner_group')
 * @param {String} | {배너를 감싼 선택자} (bannerWrap) - (default - '.rolling_banner')
 * @param {String} | {실제 보이는 배너 선택자} (bannerEach) - (default - '.banner')
 * @param {String} | {실행 버튼 선택자} (playBtn) - (default - '.ui_rolling_play')
 * @param {String} | {정지 버튼 선택자} (stopBtn) - (default - '.ui_rolling_stop')
 * @param {String} | {이전으로 슬라이드 버튼 선택자} (nextBtn) - (default - '.ui_rolling_prev')
 * @param {String} | {다음으로 슬라이드 버튼 선택자} (prevBtn) - (default - '.ui_rolling_next')
 * @param {Number} | {슬라이드 이동속도} (SPEED) - (default - 500)
 * @param {Number} | {슬라이드 정지시간(표출시간)} (TIMER) - (default - 1500)
 * @param {String} | {슬라이드 진행방향 'left'일 경우 다음, 'right'일 경우 이전} (direction) - (default - 'left')
 *
 * @example
 * <div class="rolling_banner_area ui_rolling_banner_area">
 *     <div class="rolling_banner_group">
 *         <div class="rolling_banner">
 *         <div class="banner" style="background-color:red;">1</div>
 *         <div class="banner" style="background-color:yellow;">2</div>
 *         <div class="banner" style="background-color:green;">3</div>
 *         <div class="banner" style="background-color:red;">4</div>
 *         <div class="banner" style="background-color:aqua;">5</div>
 *         <div class="banner" style="background-color:silver;">6</div>
 *     </div>
 *     <div class="rolling_banner_btns">
 *         <button type="button" class="ui_rolling_stop">정지</button>
 *         <button type="button" class="ui_rolling_play">실행</button>
 *         <button type="button" class="ui_rolling_next">다음으로 슬라이드</button>
 *         <button type="button" class="ui_rolling_prev">이전으로 슬라이드</button>
 *     </div>
 * </div>
 */

; (function(global, doc, core, $, _) {
    'use strict';

    core.module.VisualRolling = function(app) {
        app.visualRolling = core.Class({
            __constructor: function(options) {
                var defaults = {
                    selector: '.ui_rolling_banner_area', // 최상위 틀 class
                    bannerArea: '.rolling_banner_group', // bannerWrap의 틀 class
                    bannerWrap: '.rolling_banner', // 배너를 감싼 class
                    bannerEach: '.banner', // 실제 보이는 배너 class
                    playBtn: '.ui_rolling_play', // 실행 버튼 class
                    stopBtn: '.ui_rolling_stop', // 정지 버튼 class
                    prevBtn: '.ui_rolling_prev', // 이전으로 슬라이드 버튼 class
                    nextBtn: '.ui_rolling_next', // 다음으로 슬라이드 버튼 class
                    SPEED: 500, // 슬라이드 이동속도
                    TIMER: 1500, // 슬라이드 정지시간(표출시간)
                    direction: 'left' // 롤링 진행방향 'left'일 경우 오른쪽>왼쪽, 'right'일 경우 오른쪽<왼쪽
                };

                options = _.extend(defaults, options);

                this.$selector = $(options.selector);
                this.$bannerArea = this.$selector.children(options.bannerArea);
                this.$rollingBanner = this.$bannerArea.children(options.bannerWrap);
                this.$banners = this.$rollingBanner.children(options.bannerEach);
                this.rollingNow = 1;
                this.rollingSet = false;

                this._init();
                this.evtListener(options, this);
            },

            /**
             * @method test
             * @description 테스트를 위한 함수
             * @param {Object} _this - visualRolling 클래스
             */
            test: function(_this) {
                $.log(_this.rollingNow + '||');
            },

            /**
             * @method rolling
             * @description 배너의 롤링을 위한 함수
             * @param {Object} options - 옵션
             * @param {Object} _this - visualRolling 클래스
             */
            rolling: function(options, _this) {
                if (options.direction === 'left') {
                    this.$rollingBanner.animate({
                        left: -(this.$rollingBanner.width() / this.$rollingBanner.children().length) * ++_this.rollingNow
                    }, options.SPEED, function() {
                        if (_this.rollingNow >= _this.$rollingBanner.children().length - 1) {
                            _this.rollingNow = 1;
                            _this.$rollingBanner.css('left', '-' + _this.$bannerArea.css('width'));
                        }
                    });
                } else if (options.direction === 'right') {
                    this.$rollingBanner.animate({
                        left: -(this.$rollingBanner.width() / this.$rollingBanner.children().length) * --_this.rollingNow
                    }, options.SPEED, function() {
                        if (_this.rollingNow <= 0) {
                            _this.rollingNow = _this.$rollingBanner.children().length - 2;
                            _this.$rollingBanner.css('left', '-' + (_this.$bannerArea.width() * (_this.$rollingBanner.children().length - 2)) + 'px');
                        }
                    });
                }
            },

            /**
             * @method setting
             * @description CSS 초기화 세팅
             */
            setting: function() {
                var $firstBanner = null,
                    $lastBanner = null;

                // 배너 관련 CSS 초기화
                this.$bannerArea.css({overflow: 'hidden', position: 'relative'});
                this.$banners.css({float: 'left', width: this.$bannerArea.css('width'), height: this.$bannerArea.css('height')});

                $firstBanner = this.$banners.eq(0).clone();
                $lastBanner = this.$banners.eq(this.$banners.length - 1).clone();

                this.$rollingBanner
                    .append($firstBanner)
                    .prepend($lastBanner)
                    .css({
                        overflow: 'hidden',
                        position: 'absolute',
                        left: '-' + this.$bannerArea.css('width'),
                        width: (this.$rollingBanner.children().length * 100) + '%'
                    });
            },

            /* 초기화 */
            _init: function() {
                this.setting();
            },

            /* 이벤트 핸들러 */
            evtListener: function(options, _this) {
                var _rolling;

                function rolling() {
                    _this.rollingSet = true;

                    _rolling = setInterval(function() {
                        _this.rolling(options, _this);
                    }, options.TIMER);
                }

                function rollingEach(direction) {
                    if (!(options.direction === direction)) {
                        var curDirection = options.direction;

                        options.direction = direction;

                        _this.rolling(options, _this);

                        options.direction = curDirection;
                    } else {
                        _this.rolling(options, _this);
                    }
                }

                $(options.playBtn).on('click', function() {
                    if (!$(options.bannerWrap).is(':animated') && !_this.rollingSet) { rolling(); }
                });

                $(options.stopBtn).on('click', function() {
                    _this.rollingSet = false;

                    clearInterval(_rolling);
                });

                $(options.nextBtn).on('click', function() {
                    if (!$(options.bannerWrap).is(':animated')) {
                        rollingEach('left');
                    } else if (_this.rollingSet) {
                        clearInterval(_rolling);

                        setTimeout(function() {
                            if (!$(options.bannerWrap).is(':animated')) {
                                rollingEach('left');
                                setTimeout(rolling(), (options.TIMER + options.SPEED));
                            }
                        }, options.SPEED);
                    }
                });

                $(options.prevBtn).on('click', function() {
                    if (!$(options.bannerWrap).is(':animated')) {
                        rollingEach('right');
                    } else if (_this.rollingSet) {
                        clearInterval(_rolling);

                        setTimeout(function() {
                            if (!$(options.bannerWrap).is(':animated')) {
                                rollingEach('right');
                                setTimeout(rolling(), (options.TIMER + options.SPEED));
                            }
                        }, options.SPEED);
                    }
                });
            }
        });
    };
})(window, document, UPLEAT, jQuery, _);
