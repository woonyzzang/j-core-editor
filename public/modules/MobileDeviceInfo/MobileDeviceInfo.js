/**
 * [UPLEAT] UI Dev Team
 * @module MobileDeviceInfo
 * @description 모바일 디바이스 정보
 * @author Joe Seung Woon
 * @creat 2018.11.09
 * @version v1.0.0
 *
 * @class mobileDeviceName
 * @description 모바일 디바이스 체크 후 body 요소에 커스텀 데이터 어트리뷰트로 디바이스명 삽입
 * @param {Object} | 옵션 (optional)
 * @param {String} | Object.dataKeyName: 데이터 속성 키 이름 (default - 'data-device-name')
 *
 * @example
 * // CSS 제어 (디바이스 종류 분기 처리)
 * [data-device-name=i] #wrap{...} // 아이폰
 * [data-device-name=a] #wrap{...} // 안드로이드
 * [data-device-name=e] #wrap{...} // 기타
 *
 * // JavaScript 모듈 사용
 * {{LIB_NAME}}.mobileDeviceName();
 * {{LIB_NAME}}.mobileDeviceName({
 *     dataKeyName: 'data-device', // 변경할 커스텀 데이터 속성 키 이름
 * });
 *
 * ;(function(global, doc, core, $) {
 *     'use strict';
 *
 *      core.modules(['MobileDeviceInfo'], function(Module) {
 *          new Module.mobileDeviceName({dataKeyName: 'data-device'});
 *      });
 * })(window, document, UPLEAT, jQuery);
 *
 * ------------------------------
 *
 * @class mobileDeviceVersion
 * @description 모바일 디바이스 체크 후 body 요소에 커스텀 데이터 어트리뷰트로 디바이스 버전 삽입
 * @param {Object} | 옵션 (optional)
 * @param {String} | Object.dataKeyName: 데이터 속성 키 이름 (default - 'data-device-version')
 *
 * @example
 * // CSS 제어 (디바이스 major 버전 분기 처리)
 * [data-device-name=i][data-device-version^='10'] #wrap{...} // 아이폰 버전이 10.X 일괄인 경우
 * [data-device-name=a][data-device-version^='4'] #wrap{...} // 안드로이 버전이 4.X 일괄인 경우
 * // CSS 제어 (디바이스 build 버전 분기 처리)
 * [data-device-name=i][data-device-version='10.3.1'] #wrap{...} // 아이폰 버전이 10.3.1 인 경우
 * [data-device-name=a][data-device-version='4.4.2'] #wrap{...} // 안드로이드 버전이 4.4.2 인 경우
 *
 * // JavaScript 모듈 사용
 * {{LIB_NAME}}.mobileDeviceVersion();
 * {{LIB_NAME}}.mobileDeviceVersion({
 *     dataKeyName: 'data-device-ver', // 변경할 커스텀 데이터 속성 키 이름
 * });
 *
 * ;(function(global, doc, core, $) {
 *     'use strict';
 *
 *      core.modules(['MobileDeviceInfo'], function(Module) {
 *          new Module.mobileDeviceVersion({dataKeyName: 'data-device-ver'});
 *      });
 * })(window, document, UPLEAT, jQuery);
 */

;(function(global, doc, core, $, _) {
    'use strict';

    core.module.MobileDeviceInfo = function(app) {
        /** 모바일 디바이스명 체크 */
        app.mobileDeviceName = core.Class({
            __constructor: function(options) {
                var defaults = {
                    dataKeyName: 'data-device-name'
                };

                options = _.extend(defaults, options);

                this.$body = $('body');

                this._init(options);
            },

            _init: function(options) {
                if (!core.browser.isMobile) { return false; }

                if (core.browser.isIOS) {
                    this.$body.attr(options.dataKeyName, 'i');
                } else if (core.browser.isAndroid) {
                    this.$body.attr(options.dataKeyName, 'a');
                } else {
                    this.$body.attr(options.dataKeyName, 'e');
                }
            }
        });

        /** 모바일 디바이스 버전 체크 */
        app.mobileDeviceVersion = core.Class({
            __constructor: function(options) {
                var defaults = {
                    dataKeyName: 'data-device-version'
                };

                options = _.extend(defaults, options);

                this.$body = $('body');

                this._init(options);
            },

            _init: function(options) {
                if (!core.browser.isMobile) { return false; }

                if (core.browser.isIOS) {
                    this.$body.attr(options.dataKeyName, core.browser.iosVersion.join('.'));
                } else if (core.browser.isAndroid) {
                    this.$body.attr(options.dataKeyName, core.browser.androidVersion.join('.'));
                }
            }
        });
    };
})(window, document, UPLEAT, jQuery, _);
