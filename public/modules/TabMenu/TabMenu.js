/**
 * [UPLEAT] UI Dev Team
 * @module TabMenu
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

    core.module.TabMenu = function(app) {
        app.tabMenu = core.Class({
            __constructor: function() {
                this.evtListener();
            },
            activeTab: function(selector, direction) {
                var $tab = $('.tabMenu a[role="tab"]');
                var $nextTab = $(selector).parent()[direction]().find('a');
                var $nextPanelId = $("#"+$nextTab.attr('aria-controls'));

                $tab.attr({'aria-selected':'false','tabindex':'-1'});
                $nextTab.attr({'aria-selected':'true','tabindex':'0'}).focus();
                $nextPanelId.show().attr('tabindex','0').siblings('.tabCon').hide().attr('tabindex','-1');
            },
            evtListener: function() {
                var _this = this;
                var $tab = $('.tabMenu a[role="tab"]');
                var $firstTab = $('.tabMenu li:first a');
                var $firstPanel = $('.tabCon:first');
                var $lastTab = $('.tabMenu li:last a');

                $firstTab.attr({'aria-selected':'true','tabindex':'0'});
				$firstPanel.show().attr('tabindex','0').siblings('.tabCon').hide().attr('tabindex','-1');

                //클릭이벤트
                $tab.on('click',function(e) {
                    e.preventDefault();

                    var $panelId = $("#" + $(this).attr('aria-controls'));

                    $tab.attr({'aria-selected':'false','tabindex':'-1'});
					$(this).attr({'aria-selected':'true','tabindex':'0'});
                    $panelId.show().attr('tabindex','0').siblings('.tabCon').hide().attr('tabindex','-1');
                });

                //키보드이벤트
                $tab.on('keydown',function(e) {
                    var keycode = e.keyCode || e.which;
                    var lastPanelId = 'tabCon' + $('.tabCon').length;

                    //오른쪽 방향키 또는 아럐쪽 방향키
                    if(keycode === 39 || keycode === 40){
                        e.preventDefault();

                        _this.activeTab(this, 'next');

                        if($(this).attr('aria-controls') === lastPanelId){
                            $tab.attr('aria-selected','false');
                            $firstTab.attr({'aria-selected':'true','tabindex':'0'}).focus();
                            $firstPanel.show().attr('tabindex','0').siblings('.tabCon').hide().attr('tabindex','-1');
                        }
                    }
                    //왼쪽 방향키 또는 위쪽 방향키
                    if(keycode === 37 || keycode === 38){
                        e.preventDefault();

                        _this.activeTab(this, 'prev');

                        if($(this).attr('aria-controls') === 'tabCon1'){
                            $tab.attr('aria-selected','false');
                            $lastTab.attr({'aria-selected':'true','tabindex':'0'}).focus();
                            $("#"+lastPanelId).show().attr('tabindex','0').siblings('.tabCon').hide().attr('tabindex','-1');
                        }
                    }
                    //탭 활성화 (spacebar or Enter)
                    if(keycode === 32 || keycode === 13){
                        e.preventDefault();

                        var $panelId = $("#" + $(this).attr('aria-controls'));

                        $panelId.show().attr('tabindex','0').siblings('.tabCon').hide().attr('tabindex','-1');
                        $tab.attr({'aria-selected':'false','tabindex':'-1'});
                        $(this).attr({'aria-selected':'true','tabindex':'0'});
                    }
                });
            }
        });
    };
})(window, document, UPLEAT, jQuery, _);
