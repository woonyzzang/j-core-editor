/**
 * [UPLEAT] UI Dev Team
 * @module VisualRolling
 * @description 롤링 스크립트 제작
 * @author 노영일
 * @creat 2018.11.15
 * @version v1.0.0
 *
 * @param {String} | {최상위 틀 선택자} (wrapper) - (default - '#rollingWrapper')
 * @param {String} | {배너를 감싼 선택자} (bannerWrap) - (default - '#rolling')
 * @param {String} | {실제 보이는 배너 선택자} (bannerEach) - (default - '.banner')
 * @param {String} | {실행 버튼 선택자} (playBtn) - (default - '.rollingPlay')
 * @param {String} | {정지 버튼 선택자} (stopBtn) - (default - '.rollingStop')
 * @param {String} | {왼쪽으로 슬라이드 버튼 선택자} (leftBtn) - (default - '.left')
 * @param {String} | {오른쪽으로 슬라이드 버튼 선택자} (rightBtn) - (default - '.right')
 * @param {Int} | {슬라이드 이동속도} (rollingSpeed) - (default - 1000)
 * @param {Int} | {슬라이드 정지시간(표출시간)} (rollingTime) - (default - 1500)
 * @param {Int} | {슬라이드 진행방향 1일 경우 오른쪽>왼쪽, 2일 경우 오른쪽<왼쪽} (rollingPos) - (default - 1)
 *
 * @example
 * <div id="rollingWrapper">
 *      <div id="rolling">
 *          <div class="banner">1</div>
 *          <div class="banner">2</div>
 *          <div class="banner">3</div>
 *          <div class="banner">4</div>
 *          <div class="banner">5</div>
 *          <div class="banner">6</div>
 *      </div
 *  </div>
 */

;(function(global, doc, core, $, _) {
    'use strict';

    core.module.VisualRolling = function(app) {
        app.visualRolling = core.Class({
            __constructor: function(options) {
                var _this = this;
                var defaults = {
                    wrapper: '#rollingWrapper', // 최상위 틀 id
                    bannerWrap: '#rolling', // 배너를 감싼 id
                    bannerEach: '.banner', // 실제 보이는 배너 class
                    playBtn: '.rollingPlay', // 실행 버튼 class
                    stopBtn: '.rollingStop', // 정지 버튼 class
                    leftBtn: '.left', // 왼쪽으로 슬라이드 버튼 class
                    rightBtn: '.right', // 오른쪽으로 슬라이드 버튼 class
                    rollingSpeed: 1000, // 슬라이드 이동속도
                    rollingTime: 1500, // 슬라이드 정지시간(표출시간)
                    rollingPos: 1, // 롤링 진행방향 1일 경우 오른쪽>왼쪽, 2일 경우 오른쪽<왼쪽
                    // js에서만 필요한 영역
                    rollingNow: 1, // 슬라이드 위치
                    rollingSet: false // 자동 롤링체크 true일 경우 진행중
                };
                options = _.extend(defaults, options);

                this.init(options,_this);
            },

            // 테스트를 위한 함수
            test: function(options) {
                console.log(options.rollingNow + "||");
            },

            init: function(options,_this) {
                _this.setting(options,_this);
                _this.evtListener(options,_this);
            },

            rolling: function(options,_this) {
                if(options.rollingPos == 1){
                    $(options.bannerWrap).animate({
                        left: -($(options.bannerWrap).width() / $(options.bannerEach).length) * ++options.rollingNow
                    },options.rollingSpeed,function(){
                        if(options.rollingNow >= $(options.bannerEach).length-1){
                            options.rollingNow = 1
                            $(options.bannerWrap).css('left', '-'+$(options.wrapper).css('width'));
                        }
                    });
                } else if(options.rollingPos == 2) {
                    $(options.bannerWrap).animate({
                        left: -($(options.bannerWrap).width() / $(options.bannerEach).length) * --options.rollingNow
                    },options.rollingSpeed,function(){
                        if(options.rollingNow <= 0){
                            options.rollingNow = $(options.bannerEach).length-2
                            $(options.bannerWrap).css( 'left', '-'+($(options.wrapper).width()*($(options.bannerEach).length-2))+'px' );
                        }
                    });
                }
            },

            evtListener: function(options,_this) {
                var _rolling;
                $(options.playBtn).click(function(event) {
                    if(!$(options.bannerWrap).is(":animated") && !options.rollingSet){
                        rolling();
                    }
                });
                $(options.stopBtn).click(function(event) {
                    options.rollingSet = false;
                    clearInterval(_rolling);
                });
                $(options.leftBtn).click(function(event) {
                    if(!$(options.bannerWrap).is(":animated")){
                        rollingEach(1);
                    } else if(options.rollingSet){
                        clearInterval(_rolling);
                        setTimeout(function(){
                            if(!$(options.bannerWrap).is(":animated")){
                                rollingEach(1);
                                setTimeout(rolling(),(options.rollingTime+options.rollingSpeed));
                            }
                        },options.rollingSpeed)
                    }
                });
                $(options.rightBtn).click(function(event) {
                    if(!$(options.bannerWrap).is(":animated")){
                        rollingEach(2);
                    } else if(options.rollingSet){
                        clearInterval(_rolling);
                        setTimeout(function(){
                            if(!$(options.bannerWrap).is(":animated")){
                                rollingEach(2);
                                setTimeout(rolling(),(options.rollingTime+options.rollingSpeed));
                            }
                        },options.rollingSpeed)
                    }
                });

                function rolling(){
                    options.rollingSet = true;
                    _rolling = setInterval(function(){
                        _this.rolling(options,_this);
                    },options.rollingTime);
                }

                function rollingEach(pos){
                    if( !(options.rollingPos == pos) ){
                        var cur_pos = options.rollingPos;
                        options.rollingPos = pos;
                        _this.rolling(options,_this);
                        options.rollingPos = cur_pos;
                    } else {_this.rolling(options,_this);}
                }
            },

            setting: function(options,_this) {
                // 배너 관련 CSS 초기화
                var _banner_first = $(options.bannerEach).eq(0).clone();
                var _banner_last = $(options.bannerEach).eq($(options.bannerEach).length-1).clone();
                $(options.bannerWrap).append(_banner_first);
                $(options.bannerWrap).prepend(_banner_last);
                $(options.bannerWrap).css('width', ($(options.bannerEach).length * 100)+'%');
                $(options.bannerWrap).css({
                    'position' : 'absolute',
                    'left' : '-' + $(options.wrapper).css('width'),
                    'overflow' : 'hidden'
                });
                $(options.bannerEach).css({
                    'display' : 'inline-block',
                    'width' : $(options.wrapper).css('width'),
                    'height' : $(options.wrapper).css('height'),
                    'float' : 'left'
                });
                $(options.wrapper).css({
                    'overflow' : 'hidden',
                    'position' : 'relative'
                });
            }
        });
    };
})(window, document, UPLEAT, jQuery, _);
