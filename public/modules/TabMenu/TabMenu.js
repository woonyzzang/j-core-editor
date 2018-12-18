/**
 * [UPLEAT] UI Dev Team
 * @module TabMenu
 * @description 탭메뉴
 * @author 정란
 * @email wjdfks@upleat.com
 * @create 18.11.08
 * @version v1.0.0
 * @licence CC
 *
 * @example
 * <div class="tabWrap">
 *      <!-- tab index -->
 *      <ul role="tablist" class="tabMenu">
 *          <li role="presentation"><a href="#tabCont1" role="tab" aria-selected="true" aria-controls="tabCont1">탭메뉴1</a></li>
 *          <li role="presentation"><a href="#tabCont2" role="tab" aria-selected="false" aria-controls="tabCont2">탭메뉴2</a></li>
 *          <li role="presentation"><a href="#tabCont3" role="tab" aria-selected="false" aria-controls="tabCont3">탭메뉴3</a></li>
 *      </ul>
 *      <!-- //tab index -->
 *      <!-- tab contents -->
 *      <div role="tabpanel" aria-labelledby="tab1" id="tabCont1" class="tab_cont">탭 컨텐츠1</div>
 *      <div role="tabpanel" aria-labelledby="tab2" id="tabCont2" class="tab_cont">탭 컨텐츠2</div>
 *      <div role="tabpanel" aria-labelledby="tab3" id="tabCont3" class="tab_cont">탭 컨텐츠3</div>
 *      <!-- //tab contents -->
 * </div>
 */

;(function(global, doc, core, $, _) {
    'use strict';

    core.module.TabMenu = function(app) {
        app.tabMenu = core.Class({
            __constructor: function(options) {
                var defaults = {
                    selector: '.ui_tab_area', // 탭메뉴 선택자
                };

                options = _.extend(defaults, options);

                this.$tabArea = $(options.selector);
                this.$tab = this.$tabArea.find('.tab_menu a[role=tab]');
                this.$firstTab = this.$tabArea.find('.tab_menu li:first>a');
                this.$lastTab = this.$tabArea.find('.tab_menu li:last>a');
                this.$firstPanel = this.$tabArea.children('.tab_cont:first');

                this.evtListener();
            },

            /**
             * @method activeTab
             * @description 활성화 탭
             * @param {Object} selector - DOM셀렉터
             * @param {String} direction - 방향
             */
            activeTab: function(selector, direction) {
                var $nextTab = $(selector).parent()[direction]().find('a');
                var $nextPanelId = $('#' + $nextTab.attr('aria-controls'));

                this.$tab.attr({'aria-selected': false, tabindex: -1});
                $nextTab.attr({'aria-selected': true, tabindex: 0}).focus();
                $nextPanelId.show().attr('tabindex', 0).siblings('.tab_cont').hide().attr('tabindex', -1);
            },

            /** 이벤트 핸들러  */
            evtListener: function() {
                var _that = this;

                this.$firstTab.attr({'aria-selected': true, tabindex: 0});
				this.$firstPanel.show().attr('tabindex', 0).siblings('.tab_cont').hide().attr('tabindex', -1);

                // 클릭이벤트
                this.$tab.on('click',function(e) {
                    e.preventDefault();

                    var $panelId = $("#" + $(this).attr('aria-controls'));

                    _that.$tab.attr({'aria-selected': false, tabindex: -1});
					$(this).attr({'aria-selected': true, tabindex: 0});
                    $panelId.show().attr('tabindex', 0).siblings('.tab_cont').hide().attr('tabindex', -1);
                });

                // 키보드이벤트
                this.$tab.on('keydown',function(e) {
                    var keycode = e.keyCode || e.which;
                    var lastPanelId = 'tabCont' + $('.tab_cont').length;

                    // 오른쪽 방향키 또는 아럐쪽 방향키
                    if (keycode === 39 || keycode === 40) {
                        e.preventDefault();

                        _that.activeTab(this, 'next');

                        if ($(this).attr('aria-controls') === lastPanelId) {
                            _that.$tab.attr('aria-selected', false);
                            _that.$firstTab.attr({'aria-selected': true, 'tabindex': 0}).focus();
                            _that.$firstPanel.show().attr('tabindex', 0).siblings('.tab_cont').hide().attr('tabindex', -1);
                        }
                    }
                    // 왼쪽 방향키 또는 위쪽 방향키
                    if (keycode === 37 || keycode === 38) {
                        e.preventDefault();

                        _that.activeTab(this, 'prev');

                        if ($(this).attr('aria-controls') === 'tabCont1') {
                            _that.$tab.attr('aria-selected', false);
                            _that.$lastTab.attr({'aria-selected': true, tabindex: 0}).focus();
                            $('#' + lastPanelId).show().attr('tabindex', 0).siblings('.tab_cont').hide().attr('tabindex', -1);
                        }
                    }

                    // 탭 활성화 (spacebar or Enter)
                    if (keycode === 32 || keycode === 13) {
                        e.preventDefault();

                        var $panelId = $('#' + $(this).attr('aria-controls'));

                        $panelId.show().attr('tabindex', 0).siblings('.tab_cont').hide().attr('tabindex', -1);
                        _that.$tab.attr({'aria-selected': false, tabindex: -1});
                        $(this).attr({'aria-selected': true, tabindex: 0});
                    }
                });
            }
        });
    };
})(window, document, UPLEAT, jQuery, _);
