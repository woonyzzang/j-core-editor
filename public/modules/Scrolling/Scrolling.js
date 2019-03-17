/**
 * [UPLEAT] UI Dev Team
 * @module Scrolling
 * @description 스크롤링
 * @author Joe Seung Woon
 * @email seungwoon@upleat.com
 * @create 2019.03.13
 * @version v1.0.0
 * @licence CC
 *
 * @param {Object} | 옵션 (optional)
 * @param {String} | Object.selector: 스크롤링 DOM 선택자 (default - '.ui_scrolling')
 * @param {String} | Object.direction: 스크롤바 좌/우 위치 (default - 'right')
 * @param {Boolean} | Object.dynamic: 스크롤바 동적 모드 (default - false)
 *
 * @example
 * // HTML 구조
 * <div class="scrolling ui_scrolling"
 *      컨텐츠 내용...
 * </div>
 *
 * // JavaScript 모듈 사용
 * {{LIB_NAME}}.scrolling();
 * {{LIB_NAME}}.scrolling({
 *     selector: '.ui_scrolling', // 스크롤링 DOM 선택자
 *     direction: 'left', // 스크롤바 좌/우 위치
 *     dynamic: true // 스크롤바 동적 모드
 * });
 */

;(function(global, doc, core, $, _) {
    'use strict';

    core.module.Scrolling = function(app) {
        app.scrolling = core.Class({
            __constructor: function(options) {
                var defaults = {
                    selector: '.ui_scrolling',
                    direction: 'right',
                    dynamic: false
                };

                options = _.extend(defaults, options);

                this.$body = $('body');
                this.$scrolling = $(options.selector);
                this.$scrollView = $('<div />', {'class': 'scroll_view ui_scroll_view'});
                this.$scrollCont = $('<div />', {'class': 'scroll_cont ui_scroll_cont'});
                this.$scrollbarTrack = $('<div />', {'class': 'scrollbar_track ui_scrollbar_track'});
                this.$scrollbarThumb = $('<div />', {'class': 'scrollbar_thumb ui_scrollbar_thumb'});
                this.direction = options.direction; //this.$scrolling.css('direction');
                this.dynamic = options.dynamic;
                this.scrollRatio = 0;
                this.lastPageY = 0;

                this._init();
                this.evtListener(options);
            },

            /**
             * @method rAF
             * @description 애니메이션 프레임 타이머
             * @param  {Function} cb - 콜백함수
             */
            rAF: function(cb) {
                return global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || global.oRequestAnimationFrame || global.msRequestAnimationFrame || function(cb) {
                    return global.setTimeout(cb, 1000 / 60);
                };
            },

            /**
             * @method drag
             * @description 스크롤바 드래그 MOVE
             * @param  {Object} selector - DOM셀렉터
             * @param  {Object} Event - 이벤트
             */
            drag: function(selector, e) {
                var _that = this;
                var $this = $(selector),
                    delta = e.pageY - _that.lastPageY;

                this.rAF()(function() {
                    $this.find('.ui_scroll_cont')[0].scrollTop += delta / _that.scrollRatio;
                });

                _that.lastPageY = e.pageY;
            },

            /**
             * @method stop
             * @description 스크롤바 드래그 END
             * @param  {Object} selector - DOM셀렉터
             */
            stop: function(selector) {
                var $this = $(selector);

                $this.children('.ui_scrollbar').removeClass('draggable');

                $(doc)
                    .off('mousemove')
                    .off('mouseup');
            },

            /**
             * @method moveBar
             * @description 스크롤바 이동
             * @param  {Object} selector - DOM셀렉터
             */
            moveBar: function(selector) {
                var _that = this;
                var $this = $(selector),
                    $scrollCont = $this.find('.ui_scroll_cont'),
                    $scrollbarTrack = $this.children('.ui_scrollbar_track'),
                    $scrollbarThumb = $scrollbarTrack.children('.ui_scrollbar_thumb');
                var totalHgt = $scrollCont[0].scrollHeight,
                    ownHgt = $scrollCont.innerHeight();
                var scrollbarPos = 0;

                switch (_that.direction) {
                    case 'right':
                        scrollbarPos = ($this.innerWidth() - $scrollbarThumb.innerWidth()) * -1;
                        break;
                    case 'left':
                        // scrollbarPos = ($this.innerWidth() - $scrollbarThumb.innerWidth() + 18);
                        scrollbarPos = 0;
                        break;
                }

                this.scrollRatio = ownHgt / totalHgt;

                // this.rAF()(function() { // this.rAF() 함수 사용시 초기 스크롤바 높이값 이슈가 있음.
                if (_that.scrollRatio >= 1) {
                    $scrollbarTrack.addClass('scrollbar_hide');
                } else {
                    $scrollbarTrack.removeClass('scrollbar_hide');
                    $scrollbarThumb.css({
                        top: ($scrollCont.scrollTop() / totalHgt ) * 100 + '%',
                        // right: scrollbarPos + 'px',
                        height: Math.max(_that.scrollRatio * 100, 10) + '%'
                    });
                }
                // });
            },

            /**
             * @method _createScrollViewDOMRender
             * @description 스크롤링 뷰 관련 DOM 구조 생성
             */
            _createScrollViewDOMRender: function() {
                var _fragArr = [];

                // 스크롤링 컨텐츠 DOM 데이터를 배열에 이동(저장)
                _.forEach(this.$scrolling, function(elem, index) {
                    var $elem = $(elem);
                    var $frag = $(document.createDocumentFragment());

                    while ($elem.children().first()[0]) {
                        $frag.append($elem.children().first()[0]);
                    }

                    _fragArr[index] = $frag;
                });

                this.$scrollView.append(this.$scrollCont);
                this.$scrollbarTrack.append(this.$scrollbarThumb);
                this.$scrolling
                    .append(this.$scrollView)
                    .append(this.$scrollbarTrack);

                this.$scrollView = this.$scrolling.children('.ui_scroll_view');
                this.$scrollCont = this.$scrollView.children('.ui_scroll_cont');
                this.$scrollbarTrack = this.$scrolling.children('.ui_scrollbar_track');
                this.$scrollbarThumb = this.$scrollbarTrack.children('.ui_scrollbar_thumb');

                // 스크롤링 컨텐츠 DOM 저장 데이터를 동적 생성된 스코롤 컨텐츠 영역에 붙이기
                _.forEach(this.$scrollCont, function(elem, index) {
                    $(elem).append(_fragArr[index]);
                });
            },

            /** 초기화 */
            _init: function() {
                this._createScrollViewDOMRender();

                if (_.isEqual(this.direction, 'left')) { this.$scrolling.addClass('scrolling_direction_lft'); }

                if (_.isEqual(this.dynamic, true)) { this.$scrolling.addClass('scrolling_dynamic'); }

                if (_.isEqual(_.parseInt(this.$scrollCont.css('height')), 0) && !_.isEqual(_.parseInt(this.$scrollCont.css('maxHeight')), 0)) {
                    this.$scrollCont.css('height', this.$scrollCont.css('maxHeight'));
                }

                _.forEach(this.$scrolling, _.bind(function(elem) {
                    this.moveBar(elem);
                }, this));
            },

            /** 이벤트 핸들러  */
            evtListener: function(options) {
                var _that = this;

                this.$scrollCont
                    .on('scroll', _.debounce(function() { // 스크롤 컨텐츠 이벤트 핸들러
                        _that.moveBar($(this).closest(options.selector)[0]);
                    }, 10))
                    .on('mouseenter', function() { // 스크롤 컨텐츠 마우스 오버 이벤트 핸들러
                        _that.moveBar($(this).closest(options.selector)[0]);
                    });

                // 스크롤바 마우스 다운 이벤트 핸들러
                this.$scrollbarThumb.on('mousedown', function(e) {
                    e.preventDefault();

                    var $this = $(this);

                    $this.addClass('draggable');

                    $(doc)
                        .on('mousemove', function(e) {
                            _that.drag($this.closest(options.selector)[0], e);
                        })
                        .on('mouseup', function() {
                            _that.stop($this.closest(options.selector)[0]);
                        });

                    _that.lastPageY = e.pageY;
                });
            }
        });
    };
})(window, document, UPLEAT, jQuery, _);