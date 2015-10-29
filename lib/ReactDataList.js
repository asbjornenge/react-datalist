'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _componentsDataList = require('./components/DataList');

var _componentsDataList2 = _interopRequireDefault(_componentsDataList);

var _componentsDataListOption = require('./components/DataListOption');

var _componentsDataListOption2 = _interopRequireDefault(_componentsDataListOption);

var layout = '.react-datalist {\n  margin: 0 !important;\n  border: 1px solid #a1c1e7;\n  max-height: 500px;\n  overflow-x: scroll;\n  background-color: #fff;\n}\n.react-datalist .react-datalist-option {\n  display: block;\n  margin: 0 !important;\n  width: 94%;\n  padding: 3%;\n  cursor: pointer;\n}\n.react-datalist .react-datalist-option:hover {\n  background-color: #bad4fe;\n}\n.react-datalist .react-datalist-option.react-datalist-option-selected {\n  background-color: #bad4fe;\n}\n';

var ReactDataList = (function (_React$Component) {
    _inherits(ReactDataList, _React$Component);

    function ReactDataList(props) {
        _classCallCheck(this, ReactDataList);

        _get(Object.getPrototypeOf(ReactDataList.prototype), 'constructor', this).call(this, props);
        this.state = {
            filter: props.initialFilter || props.defaultValue || '',
            hide: true,
            selected: false,
            support: !!('list' in document.createElement('input')) && !!(document.createElement('datalist') && window.HTMLDataListElement)
        };
    }

    _createClass(ReactDataList, [{
        key: 'render',
        value: function render() {
            var options = this.filterOptions(this.props.options, this.state.filter, this.useNative());
            var extraClasses = this.props.className ? ' ' + this.props.className : '';
            var layoutstyle = this.props.includeLayoutStyle ? _react2['default'].createElement(
                'style',
                null,
                layout
            ) : null;
            return _react2['default'].createElement(
                'div',
                { className: 'react-datalist-container' },
                layoutstyle,
                _react2['default'].createElement('input', { ref: 'theInput',
                    list: this.props.list,
                    value: this.state.filter,
                    className: "react-datalist-input" + extraClasses,
                    placeholder: this.props.placeholder,
                    onBlur: this.handleInputBlur.bind(this),
                    onKeyUp: this.handleInputKeyUp.bind(this),
                    onClick: this.handleInputClick.bind(this),
                    onChange: this.handleInputChange.bind(this),
                    onKeyDown: this.handleInputKeyDown.bind(this)
                }),
                _react2['default'].createElement(_componentsDataList2['default'], { ref: 'theDatalist',
                    id: this.props.list,
                    hide: this.state.hide,
                    filter: this.state.filter,
                    select: this.selectFilteredOption.bind(this),
                    options: options,
                    selected: this.state.selected,
                    useNative: this.useNative()
                })
            );
        }
    }, {
        key: 'handleInputBlur',
        value: function handleInputBlur(event) {
            if (this.props.hideOptionsOnBlur) {
                setTimeout((function () {
                    this.setState({ hide: true });
                }).bind(this), this.props.blurTimeout);
            }
            if (typeof this.props.onInputBlur === 'function') this.props.onInputBlur(event);
        }
    }, {
        key: 'handleInputClick',
        value: function handleInputClick(event) {
            this.setState({ hide: false });
        }
    }, {
        key: 'handleInputChange',
        value: function handleInputChange(event) {
            this.setState({
                filter: event.target.value,
                selected: false,
                hide: false
            });
            if (typeof this.props.onInputChange === 'function') this.props.onInputChange(event);
        }
    }, {
        key: 'handleInputKeyDown',
        value: function handleInputKeyDown(event) {
            switch (event.which) {
                case 40:
                    // DOWN Arrow
                    var newSelectedIndex = this.state.selected === false ? 0 : this.state.selected + 1;
                    var availableOptions = this.filterOptions(this.props.options, this.state.filter, this.useNative());
                    if (newSelectedIndex >= availableOptions.length) newSelectedIndex = availableOptions.length - 1;
                    this.setState({
                        selected: newSelectedIndex,
                        hide: false
                    });
                    break;
                case 38:
                    // UP arrow
                    var newSelectedIndex = this.state.selected > 0 ? this.state.selected - 1 : 0;
                    this.setState({ selected: newSelectedIndex });
                    break;
                case 13:
                    // ENTER
                    if (typeof this.state.selected === 'number') {
                        this.selectFilteredOption(this.state.selected);
                    } else {
                        this.selectOption(event.target.value);
                    }
                    break;
            }
        }
    }, {
        key: 'handleInputKeyUp',
        value: function handleInputKeyUp(event) {
            if (!this.props.hideOptionsOnEsc) return;
            switch (event.which) {
                case 27:
                    // ESC
                    this.setState({
                        selected: false,
                        hide: true,
                        filter: this.state.hide ? "" : this.state.filter
                    });
                    break;
            }
        }
    }, {
        key: 'filterOptions',
        value: function filterOptions(options, filter, support) {
            if (support) return options;
            if (!filter) return options;
            if (filter === '') return options;
            if (!options) return [];
            return options.filter(function (option) {
                return option.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
            });
        }
    }, {
        key: 'selectFilteredOption',
        value: function selectFilteredOption(index) {
            this.selectOption(this.filterOptions(this.props.options, this.state.filter, this.useNative())[index]);
        }
    }, {
        key: 'selectOption',
        value: function selectOption(value) {
            var selected_option;
            this.props.options.forEach(function (option, index) {
                if (option.toLowerCase() === value.toLowerCase()) selected_option = option;
            });
            if (typeof selected_option === 'undefined') return;
            if (typeof this.props.onOptionSelected === 'function') this.props.onOptionSelected(selected_option);
            this.setState({
                filter: selected_option,
                selected: false,
                hide: true
            });
        }
    }, {
        key: 'useNative',
        value: function useNative() {
            var _native = this.state.support;
            if (this.props.forcePoly) _native = false;
            return _native;
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            if (typeof this.props.getController === 'function') {
                this.props.getController({
                    setFilter: (function (value, callback) {
                        this.setState({ filter: value }, callback);
                    }).bind(this),
                    toggleOptions: (function (callback) {
                        var hide = !this.state.hide;this.setState({ filter: '', hide: hide }, function () {
                            if (typeof callback === 'function') callback(!hide);
                        });
                    }).bind(this),
                    getState: (function () {
                        return {
                            hide: this.state.hide,
                            filter: this.state.filter,
                            selected: this.state.selected,
                            options: this.filterOptions(this.props.options, this.state.filter, this.useNative())
                        };
                    }).bind(this),
                    setState: (function (state, callback) {
                        this.setState(state, callback);
                    }).bind(this)
                });
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (this.useNative()) return;
            if (this.props.autoPosition === false) return;

            /** POSITION **/

            setTimeout((function () {
                if (this.refs.theInput == undefined) return; // <- Tests are too fast!
                if (this.refs.theDatalist == undefined) return; // <- Tests are too fast!
                var _input = _reactDom2['default'].findDOMNode(this.refs.theInput);
                var _datalist = _reactDom2['default'].findDOMNode(this.refs.theDatalist);
                var pos = this.findPos(_input);

                _datalist.style.position = 'absolute';
                _datalist.style.top = pos[0] + _input.offsetHeight;
                _datalist.style.left = pos[1];
                _datalist.style.width = _input.offsetWidth - 2 + 'px';
            }).bind(this), 50);
        }
    }, {
        key: 'findPos',
        value: function findPos(element) {
            if (element) {
                var parentPos = this.findPos(element.offsetParent);
                return [parentPos[0] + element.offsetTop, parentPos[1] + element.offsetLeft];
            } else {
                return [0, 0];
            }
        }
    }]);

    return ReactDataList;
})(_react2['default'].Component);

exports['default'] = ReactDataList;

ReactDataList.defaultProps = {
    blurTimeout: 200,
    includeLayoutStyle: true,
    hideOptionsOnBlur: true,
    hideOptionsOnEsc: true
};
module.exports = exports['default'];