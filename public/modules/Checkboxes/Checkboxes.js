/**
 * [UPLEAT] UI Dev Team
 * @module Checkboxes
 * @description 여러 체크박스의 전체선택 기능을 손쉽게 사용할 수 있습니다.
 * @author Kim Kyu Yeon
 * @email kky@upleat.com
 * @create 19.03.14
 * @version v1.0.0
 * @licence CC
 */

;(function(global, doc, core, $, _) {
    'use strict';

    core.module.Checkboxes = function(app) {
        app.checkboxes = core.Class({
            __constructor: function(options) {
                var defaults = {
                    selector: '.ui_checkboxes',
                    checkboxAll: '.ui_checkbox_all',
                    checkbox: '.ui_checkbox'
                };

                options = _.extend(defaults, options);

                this.$selector = $(options.selector);
                this.$checkboxAll = this.$selector.find(':checkbox' + options.checkboxAll);
                this.$checkbox = this.$selector.find(':checkbox' + options.checkbox);

                this.evtListener(options);
            },

            /**
             * @method getCheckedItem
             * @description 선택된 체크박스를 객체로 반환하는 메서드
             * @param {Object} selector - DOM셀렉터
             * @param {Object} options - 옵션
             * @returns {object}
             */
            _getCheckedItem: function(selector, options) {
                return $(selector).find(':checkbox' + options.checkbox).filter(':checked');
            },

            /**
             * @method checkAll
             * @description 체크박스 전체선택 이벤트리스너
             * @param {Object} selector - DOM셀렉터
             * @param {Object} options - 옵션
             */
            checkAll: function(selector, options) {
                var $this = $(selector);
                var $checkboxes = $this.closest(options.selector);

                if ($this.prop('checked')) {
                    $checkboxes.find(':checkbox' + options.checkbox).prop('checked', true).attr('checked', true);
                } else {
                    $checkboxes.find(':checkbox' + options.checkbox).prop('checked', false).attr('checked', false);
                }
            },

            /**
             * @method check
             * @description 체크박스 선택 이벤트리스너
             * @param {Object} selector - DOM셀렉터
             * @param {Object} options - 옵션
             */
            check: function(selector, options) {
                var $this = $(selector);
                var $checkboxes = $this.closest(options.selector);
                var isCheckedAll = (this._getCheckedItem($checkboxes[0], options).length < $checkboxes.find(':checkbox' + options.checkbox).length)? false : true;

                if ($this.prop('checked')) {
                    $this.prop('checked', true).attr('checked', true);
                } else {
                    $this.prop('checked', false).attr('checked', false);
                }

                $checkboxes.find(':checkbox' + options.checkboxAll).prop('checked', isCheckedAll).attr('checked', isCheckedAll);
            },

            /** 이벤트 핸들러 */
            evtListener: function(options) {
                var _that = this;

                // 전체 체크박스 이벤트 핸들러
                this.$checkboxAll.on('change', function() {
                    _that.checkAll(this, options);
                });

                // 개별 체크박스 이벤트 핸들러
                this.$checkbox.on('change', function() {
                    _that.check(this, options);
                });
            }
        });
    };
})(window, document, UPLEAT, jQuery, _);