/**
 * [UPLEAT] UI Dev Team
 * @module MobilePreview
 * @description 마크업 리스트맵 모바일 프리뷰
 * @author Joe Seung Woon
 * @creat 2018.07.24
 * @version v1.0.0
 *
 * @param {Object} | 옵션 (optional)
 * @param {String} | Object.selector: 리스트맵 ID명 (default - '#listmap')
 * @param {String} | Object.position: 화면 위치 (default - 'right')
 * @param {Boolean} | Object.draggable: 드래그 여부 (default - false)
 * @param {Boolean} | Object.resizable: 리사이즈 여부 (default - false)
 *
 * @example
 * // HTML 구조
 * <!-- [D] 리스트맵 네이밍 선언 id="listmap" -->
 * <table id="listmap">
 *      <tbody>
 *          <tr>
 *              <!-- [D] 미리보기 기능을 사용할 a 링크에 data-role="preview" 속성 선언 -->
 *              <td><a href="#" data-role="preview">링크파일</a></td>
 *          </tr>
 *      </tbody>
 * </table>
 *
 * // JavaScript 모듈 사용
 * {{LIB_NAME}}.mobilePreview();
 * {{LIB_NAME}}.mobilePreview({
 *     selector: '#listmap', // 리스트맵 ID명
 *     position: 'left', // 프리뷰 화면 위치
 *     draggable: true,  // 드래그 여부 (jQuery UI 라이브러리 필요)
 *     resizable: true // 리사이즈 여부 (jQuery UI 라이브러리 필요)
 * });
 *
 * ;(function(global, doc, core, $) {
 *     'use strict';
 *
 *    core.asyncImport.load([
 *        './js/libs/css/jquery-ui-1.12.1.min.css',
 *        './js/libs/jquery-ui-1.12.1.min.js'
 *    ],'./js/modules/mobilePreview.js', function() {
 *        core.modules(['*'], function(Module) {
 *            new Module.mobilePreview({position: 'right', draggable: true, resizable: true});
 *        });
 *    });
 * })(window, document, UPLEAT, jQuery);
 */

;(function(global, doc, core, $, _) {
    'use strict';

    core.module.MobilePreview = function(app) {
        app.mobilePreview = core.Class({
            __constructor: function(options) {
                var defaults = {
                    selector: '#listmap',
                    position: 'right',
                    draggable: false,
                    resizable: false
                };

                options = _.extend(defaults, options);

                this.$body = $('body');
                this.$listmap = $(options.selector);
                this.$previewFrame = $('<div />', {id: 'previewFrame', 'class': 'ui-core'});
                this.$previewFrameHeader = $('<div />', {'class': 'preview-frame-header'});
                this.$iframe = $('<iframe frameborder="0" />', {'class': 'preview-frame-conent'});
                this.$links = $('a[data-role=preview]');

                this.addDevice(options);
                this.setPosition(options);
                this.evtListener(options);
            },

            addDevice: function(options) {
                if ($('#' + this.$previewFrame[0].id).length) { throw new Error('동일한 \"' + this.$previewFrame[0].id + '\" 이름의 네이밍이 존재합니다.'); }

                this.$previewFrame.css({position: 'fixed', top: 0, left: 0, width: '320px', height: '480px', paddingTop: (!options.draggable) ? 0 : '15px', border: '2px solid #333', backgroundColor: '#f7f7f7', boxSizing: 'content-box'});
                this.$previewFrameHeader.css({position: 'absolute',top: 0, right: 0, left: 0, height: '15px', backgroundColor: '#222', cursor: 'move'});
                this.$iframe.css({width: '100%', height: '100%', border: 0});

                if (!options.draggable) {
                    this.$previewFrame.append(this.$iframe);
                } else {
                    this.$previewFrame.append(this.$previewFrameHeader).append(this.$iframe);
                }

                this.$body.append(this.$previewFrame);
            },

            removeDevice: function() {
                if (!this.$previewFrame.length) { return; }

                this.$previewFrame.remove();
            },

            setPosition: function(options) {
                switch (options.position) {
                    case 'top':
                        this.$previewFrame.css({top: 0, bottom: 'auto'});
                        break;
                    case 'right':
                        this.$previewFrame.css({right: 0, left: 'auto'});
                        break;
                    case 'bottom':
                        this.$previewFrame.css({top: 'auto', bottom: 0});
                        break;
                    case 'left':
                        this.$previewFrame.css({right: 'auto', left: 0});
                        break;
                }
            },

            evtListener: function(options) {
                var _that = this,
                    isDrag = false;

                if (options.draggable) {
                    this.$previewFrame.draggable({
                        containment: 'parent',
                        start: function() {
                            isDrag = true

                            return;
                        },
                        stop: function() {
                            isDrag = false;

                            return;
                        }
                    });
                }

                if (options.resizable) {
                    this.$previewFrame.resizable({
                        containment: 'parent'
                    });
                }

                this.$links.on('mouseenter', function() {
                    if (!isDrag) { _that.$iframe.attr('src', $(this).attr('href')); }
                });
            }
        });

        // return new app.mobilePreview;
    };
})(window, document, UPLEAT, jQuery, _);