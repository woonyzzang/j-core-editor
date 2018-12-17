/**
 * [UPLEAT] UI Dev Team
 * @module Menu
 * @description {{모듈설명}}
 * @author {{작성자이름}}
 * @creat {{년도.월.일}}
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
                this.evtListener();
                this.setting();
            },
            evtListener: function() {
                // 익스8 하위 브라우저 적용 속도제한 이슈 X 제이쿼리 사용   
                $('.btn').on('click', function() {
                    if(!$(this).hasClass('on')){
                        $('.btn').addClass('on');
                        $('.menuCont').show();
                    }else{
                        $('.btn').removeClass('on');
                        $('.menuCont').hide();
                    }
                    $('.menuCont nav').animate({
                        width: 'toggle',
                        opacity: 'toggle'
                    },150);
                });

                //$('.menuCont').click( function() {
                //    $(this).hide();
                //    $('.btn').removeClass('on');
                //    $('.menuCont nav').hide();
                //});
                    
                // 익스 10 이상이며 에니메이트 변화가 필요한 
                $('.btn.ani').prepend('<span></span><span></span><span></span>');
                $('.btn.ani').on('click', function() {
                    $('.menuCont.css').toggleClass('show');
                });
                
                //lnb 관계없는 스크립트
                $('.lnbMenu > dt').click(function(e) {
                    if (!$(this).hasClass('active')) {
                            $('.lnbMenu > dd').slideUp();
                            $('.lnbMenu > dt').removeClass('active');
                            $(this).addClass('active');
                            $(this).next().slideDown();
                        } else {
                            $(this).removeClass('active');
                            $(".lnbMenu > dd").slideUp();
                        }
                     e.stopPropagation();
                });
                //lnb 관계없는 스크립트 
            },
            setting: function() {
                var widArea = $('.menuCont').data('wid');
                $('.menuCont nav').css('width', widArea + '%');
                
            }
        });
    };
})(window, document, UPLEAT, jQuery, _);