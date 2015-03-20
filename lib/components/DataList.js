"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var React = _interopRequire(require("react"));

var DataListOption = _interopRequire(require("./DataListOption"));

var DataList = (function (_React$Component) {
    function DataList() {
        _classCallCheck(this, DataList);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(DataList, _React$Component);

    _createClass(DataList, {
        render: {
            value: function render() {
                var _this = this;

                var options = this.props.options.map(function (option, index) {
                    return React.createElement(DataListOption, {
                        key: option + index,
                        option: option,
                        index: index,
                        useNative: _this.props.useNative,
                        selected: _this.props.selected == index,
                        select: _this.props.select });
                });
                var containerStyle = {};
                if (!this.props.useNative) {
                    if (this.props.hide) containerStyle.display = "none";else if (this.props.options.length == 0) containerStyle.display = "none";else containerStyle.display = "block";
                }
                if (this.props.useNative) {
                    return React.createElement(
                        "datalist",
                        { id: this.props.id, className: "react-datalist" },
                        options
                    );
                }return React.createElement(
                    "div",
                    { id: this.props.id, className: "react-datalist", style: containerStyle },
                    options
                );
            }
        }
    });

    return DataList;
})(React.Component);

module.exports = DataList;