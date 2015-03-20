"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var React = _interopRequire(require("react"));

var DataList = _interopRequire(require("./components/DataList"));

var DataListOption = _interopRequire(require("./components/DataListOption"));

var layout = ".react-datalist {   margin: 0 !important;   border: 1px solid #a1c1e7;   max-height: 500px;   overflow-x: scroll;   background-color: #fff; } .react-datalist .react-datalist-option {   display: block;   margin: 0 !important;   width: 94%;   padding: 3%;   cursor: pointer; } .react-datalist .react-datalist-option:hover {   background-color: #bad4fe; } .react-datalist .react-datalist-option.react-datalist-option-selected {   background-color: #bad4fe; }"

var ReactDataList = (function (_React$Component) {
    function ReactDataList(props) {
        _classCallCheck(this, ReactDataList);

        _get(Object.getPrototypeOf(ReactDataList.prototype), "constructor", this).call(this, props);
        this.state = {
            filter: props.initialFilter || props.defaultValue || "",
            hide: true,
            selected: false,
            support: !!("list" in document.createElement("input")) && !!(document.createElement("datalist") && window.HTMLDataListElement)
        };
    }

    _inherits(ReactDataList, _React$Component);

    _createClass(ReactDataList, {
        render: {
            value: function render() {
                var options = this.filterOptions(this.props.options, this.state.filter, this.useNative());
                var extraClasses = this.props.className ? " " + this.props.className : "";
                var layoutstyle = this.props.includeLayoutStyle ? React.createElement(
                    "style",
                    null,
                    layout
                ) : null;
                return React.createElement(
                    "div",
                    { className: "react-datalist-container" },
                    layoutstyle,
                    React.createElement("input", { ref: "theInput",
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
                    React.createElement(DataList, { ref: "theDatalist",
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
        },
        handleInputBlur: {
            value: function handleInputBlur(event) {
                if (this.props.hideOptionsOnBlur) {
                    setTimeout((function () {
                        this.setState({ hide: true });
                    }).bind(this), this.props.blurTimeout);
                }
                if (typeof this.props.onInputBlur === "function") this.props.onInputBlur(event);
            }
        },
        handleInputClick: {
            value: function handleInputClick(event) {
                this.setState({ hide: false });
            }
        },
        handleInputChange: {
            value: function handleInputChange(event) {
                this.setState({
                    filter: event.target.value,
                    selected: false,
                    hide: false
                });
                if (typeof this.props.onInputChange === "function") this.props.onInputChange(event);
            }
        },
        handleInputKeyDown: {
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
                        if (typeof this.state.selected === "number") {
                            this.selectFilteredOption(this.state.selected);
                        } else {
                            this.selectOption(event.target.value);
                        }
                        break;
                }
            }
        },
        handleInputKeyUp: {
            value: function handleInputKeyUp(event) {
                if (!this.props.hideOptionsOnEsc) {
                    return;
                }switch (event.which) {
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
        },
        filterOptions: {
            value: function filterOptions(options, filter, support) {
                if (support) {
                    return options;
                }if (!filter) {
                    return options;
                }if (filter === "") {
                    return options;
                }if (!options) {
                    return [];
                }return options.filter(function (option) {
                    return option.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
                });
            }
        },
        selectFilteredOption: {
            value: function selectFilteredOption(index) {
                this.selectOption(this.filterOptions(this.props.options, this.state.filter, this.useNative())[index]);
            }
        },
        selectOption: {
            value: function selectOption(value) {
                var selected_option;
                this.props.options.forEach(function (option, index) {
                    if (option.toLowerCase() === value.toLowerCase()) selected_option = option;
                });
                if (typeof selected_option === "undefined") {
                    return;
                }if (typeof this.props.onOptionSelected === "function") this.props.onOptionSelected(selected_option);
                this.setState({
                    filter: selected_option,
                    selected: false,
                    hide: true
                });
            }
        },
        useNative: {
            value: function useNative() {
                var _native = this.state.support;
                if (this.props.forcePoly) _native = false;
                return _native;
            }
        },
        componentWillMount: {
            value: function componentWillMount() {
                if (typeof this.props.getController === "function") {
                    this.props.getController({
                        setFilter: (function (value, callback) {
                            this.setState({ filter: value }, callback);
                        }).bind(this),
                        toggleOptions: (function (callback) {
                            var hide = !this.state.hide;this.setState({ filter: "", hide: hide }, function () {
                                if (typeof callback === "function") callback(!hide);
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
        },
        componentDidMount: {
            value: function componentDidMount() {
                if (this.useNative()) {
                    return;
                }if (this.props.autoPosition === false) {
                    return;
                } /** POSITION **/

                setTimeout((function () {
                    if (this.refs.theInput == undefined) return; // <- Tests are too fast!
                    if (this.refs.theDatalist == undefined) return; // <- Tests are too fast!
                    var _input = React.findDOMNode(this.refs.theInput);
                    var _datalist = React.findDOMNode(this.refs.theDatalist);
                    var pos = this.findPos(_input);

                    _datalist.style.position = "absolute";
                    _datalist.style.top = pos[0] + _input.offsetHeight;
                    _datalist.style.left = pos[1];
                    _datalist.style.width = _input.offsetWidth - 2 + "px";
                }).bind(this), 50);
            }
        },
        findPos: {
            value: function findPos(element) {
                if (element) {
                    var parentPos = this.findPos(element.offsetParent);
                    return [parentPos[0] + element.offsetTop, parentPos[1] + element.offsetLeft];
                } else {
                    return [0, 0];
                }
            }
        }
    });

    return ReactDataList;
})(React.Component);

module.exports = ReactDataList;

ReactDataList.defaultProps = {
    blurTimeout: 200,
    includeLayoutStyle: true,
    hideOptionsOnBlur: true,
    hideOptionsOnEsc: true
};