webpackJsonp([3],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _action = __webpack_require__(432);

	var _action2 = _interopRequireDefault(_action);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var act = new _action2.default();
	var thisView = window.LAUNCHER.getView(); //获取view
	thisView.addEventListener('load', function () {
	    act.emitLoad(thisView.id);
	});

/***/ },

/***/ 432:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var carBrandAction = function () {
	    function carBrandAction() {
	        _classCallCheck(this, carBrandAction);

	        this.key = carBrandAction.getkey();
	        this.cb = [];

	        this.action = {
	            load: carBrandAction.load,
	            select: carBrandAction.select
	        };
	    }

	    _createClass(carBrandAction, [{
	        key: 'act',
	        value: function act(name, key) {
	            var eventName = (key || this.key) + '-' + carBrandAction._base_act + name;
	            return eventName;
	        }
	    }, {
	        key: 'emitLoad',
	        value: function emitLoad(id) {
	            if (carBrandAction.load) {
	                carBrandAction.load = false;
	                this.emit('load', id);
	            }
	        }
	    }, {
	        key: 'emit',
	        value: function emit(name, params) {
	            name = this.action[name] ? this.action[name] : this.act(name);
	            var evt = document.createEvent("HTMLEvents");
	            evt.initEvent(name, false, false);
	            evt.params = params;
	            window.dispatchEvent(evt);
	        }
	    }, {
	        key: 'on',
	        value: function on(name, callback) {
	            var key = carBrandAction.getkey(); //卸载事件时需要用到的key
	            name = this.action[name] ? this.action[name] : this.act(name);
	            this.cb.push({
	                name: name,
	                callback: callback,
	                key: key
	            });
	            window.addEventListener(name, callback);
	            return key;
	        }
	    }, {
	        key: 'off',
	        value: function off(key) {
	            var e = this.cb.filter(function (ele) {
	                return ele.key == key;
	            });
	            window.removeEventListener(e.name, e.callback);
	        }
	    }, {
	        key: 'clearEvent',
	        value: function clearEvent() {
	            this.cb.forEach(function (e) {
	                return window.removeEventListener(e.name, e.callback);
	            });
	            this.cb = [];
	        }
	    }]);

	    return carBrandAction;
	}();

	carBrandAction.getkey = function (len) {
	    len = len || 32;
	    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	    var maxPos = chars.length;
	    var pwd = '';
	    for (var i = 0; i < len; i++) {
	        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
	    }
	    return pwd;
	};
	carBrandAction._base_act = 'CAR-BRAND-ACTION-';
	carBrandAction.load = carBrandAction._base_act + 'LOADED';
	carBrandAction.select = carBrandAction._base_act + 'SELECT';

	exports.default = carBrandAction;

/***/ }

});