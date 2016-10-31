'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var React = _interopRequireWildcard(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Component = function (_React$Component) {
	_inherits(Component, _React$Component);

	function Component() {
		_classCallCheck(this, Component);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Component).apply(this, arguments));
	}

	_createClass(Component, [{
		key: 'render',
		value: function render() {
			return React.createElement('div', null);
		}
	}]);

	return Component;
}(React.Component);

Component.propTypes = {
	/**
	 * This is a jsdoc comment for optionalAny.
	 */
	optionalAny: React.PropTypes.any,
	optionalArray: React.PropTypes.array,
	optionalBool: React.PropTypes.bool,
	optionalFunc: React.PropTypes.func,
	optionalNumber: React.PropTypes.number,
	optionalObject: React.PropTypes.object,
	optionalString: React.PropTypes.string,
	optionalNode: React.PropTypes.node,
	optionalElement: React.PropTypes.element,
	optionalMessage: React.PropTypes.instanceOf(Message),
	//optionalEnum: React.PropTypes.oneOf(['News', 'Photos']),
	optionalUnion: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
	optionalArrayOf: React.PropTypes.arrayOf(React.PropTypes.number),
	//optionalObjectOf: React.PropTypes.objectOf(React.PropTypes.number),
	//optionalObjectWithShape: React.PropTypes.shape({
	//	color: React.PropTypes.string,
	//	fontSize: React.PropTypes.number
	//}),
	requiredFunc: React.PropTypes.func.isRequired,
	requiredAny: React.PropTypes.any.isRequired,
	requiredUnion: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.bool]).isRequired,
	requiredArrayOf: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
};
exports.default = Component;

