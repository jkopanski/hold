'use strict';

(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define('@most/hold', ['exports', 'most/lib/source/MulticastSource'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('most/lib/source/MulticastSource'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.MulticastSource);
        global.mostHold = mod.exports;
    }
})(this, function (exports, _MulticastSource) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _MulticastSource2 = _interopRequireDefault(_MulticastSource);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = (function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    })();

    var hold = function hold(stream) {
        return new stream.constructor(new _MulticastSource2.default(new Hold(stream.source)));
    };

    var Hold = (function () {
        function Hold(source) {
            _classCallCheck(this, Hold);

            this.source = source;
            this.time = -Infinity;
            this.value = void 0;
        }

        _createClass(Hold, [{
            key: 'run',
            value: function run(sink, scheduler) {
                if (sink._hold !== this) {
                    sink._hold = this;
                    sink._holdAdd = sink.add;
                    sink.add = holdAdd;
                    sink._holdEvent = sink.event;
                    sink.event = holdEvent;
                }

                return this.source.run(sink, scheduler);
            }
        }]);

        return Hold;
    })();

    function holdAdd(sink) {
        var len = this._holdAdd(sink);

        if (this._hold.time >= 0) {
            sink.event(this._hold.time, this._hold.value);
        }

        return len;
    }

    function holdEvent(t, x) {
        if (t >= this._hold.time) {
            this._hold.time = t;
            this._hold.value = x;
        }

        return this._holdEvent(t, x);
    }

    exports.default = hold;
});
