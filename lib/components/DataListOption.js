"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var React = _interopRequire(require("react"));

var DatalistOption = (function (_React$Component) {
    function DatalistOption() {
        _classCallCheck(this, DatalistOption);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(DatalistOption, _React$Component);

    _createClass(DatalistOption, {
        render: {
            value: function render() {
                var classes = "react-datalist-option";
                if (this.props.selected) classes += " react-datalist-option-selected";
                if (this.props.useNative) {
                    return React.createElement("option", { value: this.props.option });
                }return React.createElement(
                    "div",
                    { className: classes, onClick: this.handleClick.bind(this) },
                    this.props.option
                );
            }
        },
        handleClick: {
            value: function handleClick(e) {
                this.props.select(this.props.index);
            }
        }
    });

    return DatalistOption;
})(React.Component);

module.exports = DatalistOption;