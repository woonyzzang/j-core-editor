/**
 * [UPLEAT] UI Dev Team
 * @module FreezeTable
 * @description 고정형 스크롤링 테이블
 * @author Joe Seung Woon
 * @email seungwoon@upleat.com
 * @create 2019.08.20
 * @version v1.0.0
 * @licence CC
 *
 * @param {Object} options - 옵션 (optional)
 * @param {String} Object.selector: 테이블 선택자 (default - '.ui_freeze_tbl_area')
 * @param {Boolean} Object.templTableClone: 테이블 템플릿 복제 사용 (default - false)
 * @param {Boolean} Object.freezeHead: 테이블 thead 고정 (default - true)
 * @param {Boolean} Object.freezeFoot: 테이블 tfoot 고정 (default - false)
 * @param {Number} Object.freezeColumnNum: 테이블 column 고정 컬럼 갯수 (default - 0)
 *
 * @example
 * // HTML 구조
 * <div class="freeze_tbl_area ui_freeze_tbl_area">
 *     <div class="tbl" style="max-height:{높이값}px">
 *         <table>...</table>
 *     </div>
 * </div>
 *
 * // JavaScript 모듈 사용
 * ;(function(global, doc, core, $) {
 *     'use strict';
 *
 *     core.modules(['FreezeTable'], function(Module) {
 *         new Module.freezeTable({
 *             selector: '.ui_freeze_tbl_area', // DOM 선택자
 *             templTableClone: true, // 테이블 템플릿 복제 사용
 *             freezeHead: true, // 테이블 thead 고정
 *             freezeFoot: true, // 테이블 tfoot 고정
 *             freezeColumnNum: 2 // 테이블 column 고정 갯수
 *         });
 *     });
 * })(window, document, UPLEAT, jQuery);
 */

;(function(global, doc, core, $, _) {
    'use strict';

    core.module.FreezeTable = function(app) {
        app.freezeTable = core.Class({
            __constructor: function(options) {
                var defaults = {
                    selector: '.ui_freeze_tbl_area',  // DOM 선택자
                    templTableClone: false, // 테이블 템플릿 복제 사용
                    freezeHead: true, // 테이블 thead 고정
                    freezeFoot: false, // 테이블 tfoot 고정
                    freezeColumnNum: 0 // 테이블 column 고정 컬럼 갯수
                };

                options = _.extend(defaults, options);

                this.$freezeTblArea = $(options.selector);
                this.$tbl = this.$freezeTblArea.children('.tbl');
                this.$table = this.$tbl.children('table');
                this.$thead = this.$table.children('thead');
                this.$tbody = this.$table.children('tbody');
                this.$tfoot = this.$table.children('tfoot');
                this.$tblTheadTempl = (options.templTableClone) ? $('<div />', {'aria-hidden': true, 'class': 'tbl_templ tbl_thead_templ'}) : null;
                this.$tblTfootTempl = (options.templTableClone) ? $('<div />', {'aria-hidden': true, 'class': 'tbl_templ tbl_tfoot_templ'}) : null;
                this.scrollbarSpace = (core.browser.isMobile) ? 0 : 17; // 스크롤바 여백

                this._init(options);
                this.evtListener(options);
            },

            /**
             * @method isHorizontalScrollable
             * @description 테이블 가로스크롤 존재 유/무 체크 반환
             * @return {Boolean} - 가로스크롤 생성 체크 확인
             */
            isHorizontalScrollable: function() {
                return (this.$table.width() < this.$tbl.width());
            },

            /**
             * @method isVerticalScrollable
             * @description 테이블 세로스크롤 존재 유/무 체크 반환
             * @return {Boolean} - 세로스크롤 생성 체크 확인
             */
            isVerticalScrollable: function() {
                return (this.$table.height() < this.$tbl.height());
            },

            /**
             * @method createTableTheadTemplate
             * @description 테이블 <thead> 템플릿 복제
             */
            createTableTheadTemplate: function() {
                var $tblHeadClone = this.$table.clone(true).filter(function(index, elem) {
                    return $(elem).find('tbody, tfoot').remove();
                });

                this.$tblTheadTempl
                    .css({
                        right: (this.isVerticalScrollable()) ? 0 : this.scrollbarSpace
                    })
                    .append($tblHeadClone)
                    .appendTo(this.$freezeTblArea);
            },

            /**
             * @method createTableTfootTemplate
             * @description 테이블 <tfoot> 템플릿 복제
             */
            createTableTfootTemplate: function() {
                var $tblFootClone = this.$table.clone(true).filter(function(index, elem) {
                    return $(elem).find('thead, tbody').remove();
                });

                this.$tblTfootTempl
                    .css({
                        right: (this.isVerticalScrollable()) ? 0 : this.scrollbarSpace,
                        bottom: (this.isHorizontalScrollable()) ? 0 : this.scrollbarSpace
                    })
                    .append($tblFootClone)
                    .appendTo(this.$freezeTblArea);
            },

            /**
             * @method setAttrCustomData
             * @description 커스텀 데이터 && 속성 셋팅
             * @param {Object} selector - DOM 셀렉터
             * @param {String} dataAttr - 데이터 속성
             * @param {String} value - 데이터 값
             */
            setAttrCustomData: function($selector, dataAttr, value) {
                var dataAttrCamel = dataAttr.replace(/\b-([a-z])/g, function(all, char) {
                    return char.toUpperCase();
                });

                $selector.data(dataAttrCamel, value).attr('data-' + dataAttr, value);
            },

            /** 초기화 */
            _init: function(options) {
                var _that = this;

                if (options.templTableClone) {
                    this.createTableTheadTemplate();
                    this.createTableTfootTemplate();

                    if (options.freezeHead) { this.setAttrCustomData(this.$tblTheadTempl.find('th'), 'freeze-thead', true); }
                    if (options.freezeFoot) { this.setAttrCustomData(this.$tblTfootTempl.find('th, td'), 'freeze-tfoot', true); }

                    if (options.freezeColumnNum > 0) {
                        _.forEach(this.$tblTheadTempl.find('th'), function(elem, index) {
                            if (index < options.freezeColumnNum) { _that.setAttrCustomData($(elem), 'freeze-column', true); }
                        });

                        _.forEach(this.$tbody.children('tr'), function(elem) {
                            _.forEach($(elem).children('th, td'), function(elem, index) {
                                if (index < options.freezeColumnNum) { _that.setAttrCustomData($(elem), 'freeze-column', true); }
                            });
                        });

                        if (_.isElement(this.$tfoot[0])) {
                            _.forEach(this.$tblTfootTempl.find('tr'), function(elem) {
                                _.forEach($(elem).children('th, td'), function(elem, index) {
                                    if (index < options.freezeColumnNum) { _that.setAttrCustomData($(elem), 'freeze-column', true); }
                                });
                            });
                        }
                    }
                } else {
                    if (options.freezeHead) { _that.setAttrCustomData(this.$thead.find('th'), 'freeze-thead', true); }
                    if (options.freezeFoot) { _that.setAttrCustomData(this.$tfoot.find('th, td'), 'freeze-tfoot', true); }

                    if (options.freezeColumnNum > 0) {
                        _.forEach(this.$thead.find('th'), function(elem, index) {
                            if (index < options.freezeColumnNum) { _that.setAttrCustomData($(elem), 'freeze-column', true); }
                        });

                        _.forEach(this.$tbody.children('tr'), function(elem) {
                            _.forEach($(elem).children('th, td'), function(elem, index) {
                                if (index < options.freezeColumnNum) { _that.setAttrCustomData($(elem), 'freeze-column', true); }
                            });
                        });

                        if (_.isElement(this.$tfoot[0])) {
                            _.forEach(this.$tfoot.children('tr'), function(elem) {
                                _.forEach($(elem).children('th, td'), function(elem, index) {
                                    if (index < options.freezeColumnNum) { _that.setAttrCustomData($(elem), 'freeze-column', true); }
                                });
                            });
                        }
                    }
                }
            },

            /* 이벤트 핸들러 */
            evtListener: function(options) {
                var _that = this;
                var Transform = core.css3.prefix('transform');

                this.$tbl.on('scroll', function() {
                    var $this = $.$(this);
                    var scrollTop = $this[0].scrollTop,
                        scrollLeft = $this[0].scrollLeft;

                    if (options.templTableClone) {
                        _that.$tblTheadTempl.children('table').css({marginLeft: '-' + (scrollLeft + 'px')});
                        _that.$tblTfootTempl.children('table').css({marginLeft: '-' + (scrollLeft + 'px')});

                        if (!options.freezeHead) {
                            _that.$tblTheadTempl.css({top: _that.$thead.position().top});
                        }

                        if (!options.freezeFoot) {
                            _that.$tblTfootTempl.css({top: _that.$tfoot.position().top, bottom: 'auto'});
                        }

                        if (options.freezeColumnNum > 0) {
                            _that.$tblTheadTempl.find('th[data-freeze-column=true]').css((core.css3.support3D) ? {Transform: 'translate3d(' + scrollLeft + 'px,' + '0, 0)'} : {left: scrollLeft});
                            _that.$tbody.find('th[data-freeze-column=true], td[data-freeze-column=true]').css((core.css3.support3D) ? {Transform: 'translate3d(' + scrollLeft + 'px, 0, 0)'} : {left: scrollLeft});

                            if (_.isElement(_that.$tfoot[0])) {
                                _that.$tblTfootTempl.find('th[data-freeze-column=true], td[data-freeze-column=true]').css((core.css3.support3D) ? {Transform: 'translate3d(' + scrollLeft + 'px,' + '0, 0)'} : {left: scrollLeft});
                            }
                        }
                    } else {
                        var freezeFootPosY;

                        if (options.freezeHead) {
                            _that.$thead.find('th[data-freeze-thead=true]').css((core.css3.support3D) ? {Transform: 'translate3d(0, ' + scrollTop + 'px, 0)'} : {top: scrollTop});
                        }

                        if (options.freezeFoot) {
                            freezeFootPosY = (_that.$freezeTblArea.height() - _that.$table.height()) + scrollTop;
                            freezeFootPosY += (_that.isHorizontalScrollable()) ? 0 : -_that.scrollbarSpace;

                            _that.$tfoot.find('th[data-freeze-tfoot=true], td[data-freeze-tfoot=true]').css((core.css3.support3D) ? {Transform: 'translate3d(0,' + freezeFootPosY + 'px, 0)'} : {top: freezeFootPosY});
                        }

                        if (options.freezeColumnNum > 0) {
                            _that.$thead.find('th[data-freeze-column=true]').css((core.css3.support3D) ? {Transform: 'translate3d(' + scrollLeft + 'px,' + ((options.freezeHead) ? scrollTop : 0) + 'px, 0)'} : {left: scrollLeft});
                            _that.$tbody.find('th[data-freeze-column=true], td[data-freeze-column=true]').css((core.css3.support3D) ? {Transform: 'translate3d(' + scrollLeft + 'px, 0, 0)'} : {left: scrollLeft});

                            if (_.isElement(_that.$tfoot[0])) {
                                freezeFootPosY = (!_.isUndefined(freezeFootPosY)) ? freezeFootPosY : 0;

                                _that.$tfoot.find('th[data-freeze-column=true], td[data-freeze-column=true]').css((core.css3.support3D) ? {Transform: 'translate3d(' + scrollLeft + 'px,' + freezeFootPosY + 'px, 0)'} : {left: scrollLeft});
                            }
                        }
                    }
                }).trigger('scroll');

                $(global).on('resize', _.debounce(function() {
                    if (options.templTableClone) {
                        if (options.freezeFoot) {
                            _that.$tblTfootTempl.css({bottom: (_that.isHorizontalScrollable()) ? 0 : _that.scrollbarSpace});
                        }
                    }
                }, 25));
            }
        });
    };
})(window, document, UPLEAT, jQuery, _);