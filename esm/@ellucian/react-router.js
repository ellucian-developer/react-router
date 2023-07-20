import _inheritsLoose from '@babel/runtime/helpers/esm/inheritsLoose';
import React, { useContext as useContext$1, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createMemoryHistory, createLocation, locationsAreEqual, createPath } from 'history';
import warning from 'tiny-warning';
import _extends from '@babel/runtime/helpers/esm/extends';
import createContext from 'mini-create-react-context';
import invariant from 'tiny-invariant';
import pathToRegexp from 'path-to-regexp';
import { isValidElementType } from 'react-is';
import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose';
import hoistStatics from 'hoist-non-react-statics';

// TODO: Replace with React.createContext once we can assume React 16+
var createNamedContext = function createNamedContext(name) {
  var context = createContext();
  context.displayName = name;
  return context;
};

var historyContext = /*#__PURE__*/createNamedContext("Router-History");

// TODO: Replace with React.createContext once we can assume React 16+
var createNamedContext$1 = function createNamedContext(name) {
  var context = createContext();
  context.displayName = name;
  return context;
};
var context = /*#__PURE__*/createNamedContext$1("Router");

// get the ExtensionContext and find pageInfo.basePath if it's valid
function useBasePath() {
  var _useContext, _useContext$pageInfo;
  // eslint-disable-next-line no-undef
  var pageInfo = (_useContext = useContext$1(contexts.ExtensionContext)) === null || _useContext === void 0 ? void 0 : (_useContext$pageInfo = _useContext.pageInfo) === null || _useContext$pageInfo === void 0 ? void 0 : _useContext$pageInfo.basePath;
  if (pageInfo) {
    var alias = pageInfo.split("/")[1];
    var modifiedBasePath = pageInfo.replace("/" + alias, "");
    var lastChar = modifiedBasePath.substr(-1);
    if (lastChar === "/") {
      modifiedBasePath = modifiedBasePath.substring(0, modifiedBasePath.length - 1);
    }
    return modifiedBasePath;
  }
  return "";
}

function Router(props) {
  var _props$history, _useContext, _useContext$dashboard;
  // if history is explicitly passed, use this. most commonly used for UTs
  // contexts is defined at a global scope within experience for extesnions
  // eslint-disable-next-line no-undef
  var history = (_props$history = props.history) !== null && _props$history !== void 0 ? _props$history : (_useContext = useContext$1(contexts.ExtensionContext)) === null || _useContext === void 0 ? void 0 : (_useContext$dashboard = _useContext.dashboardInfo) === null || _useContext$dashboard === void 0 ? void 0 : _useContext$dashboard.history;
  var _useState = useState(history.location),
    location = _useState[0],
    setLocation = _useState[1];
  var _useState2 = useState(false),
    isMounted = _useState2[0],
    setIsMounted = _useState2[1];
  var _useState3 = useState(null),
    pendingLocation = _useState3[0],
    setPendingLocation = _useState3[1];
  var baseExtensionPath = useBasePath();
  useEffect(function () {
    setIsMounted(true);
    if (pendingLocation) {
      setLocation(pendingLocation);
    }
    return function () {
      if (history.unlisten) history.unlisten();
    };
  }, [pendingLocation, history]);
  useEffect(function () {
    if (!props.staticContext) {
      var unlisten = history.listen(function (newLocation) {
        if (isMounted) {
          setLocation(newLocation);
        } else {
          setPendingLocation(newLocation);
        }
      });
      return function () {
        unlisten();
      };
    }
  }, [isMounted, history, props.staticContext]);
  useEffect(function () {
    if (props.debug) {
      console.warn("Debug mode enabled. It should be disabled before production deployment.");
      console.log("initial history is: ", JSON.stringify(history, null, 2));
      history.listen(function (location, action) {
        console.log("<---------- History mutated ---------->");
        console.log("Current Browser URL: " + location.pathname + location.search + location.hash);
        console.log("Last history mutation: " + action, JSON.stringify(history, null, 2));
      });
    }
  }, [props.debug, history, props.children, baseExtensionPath]);
  return /*#__PURE__*/React.createElement(context.Provider, {
    value: {
      history: history,
      location: location,
      match: Router.computeRootMatch(location.pathname),
      staticContext: props.staticContext,
      baseExtensionPath: baseExtensionPath
    }
  }, /*#__PURE__*/React.createElement(historyContext.Provider, {
    children: props.children || null,
    value: _extends({}, history, {
      push: function push(path, state) {
        if (typeof path === 'object') {
          var pathName = path.pathname;
          if (!pathName.startsWith('/')) {
            pathName = '/' + path.pathname;
          }
          var prefixedPath = baseExtensionPath + path.pathname;
          var modifiedPath = _extends({}, path, {
            pathname: prefixedPath
          });
          history.push(modifiedPath, state);
        } else {
          var _pathName = path;
          if (!_pathName.startsWith('/')) {
            _pathName = '/' + path;
          }
          history.push(baseExtensionPath + _pathName, state);
        }
      },
      replace: function replace(path, state) {
        if (typeof path === 'object') {
          var prefixedPath = baseExtensionPath + path.pathname;
          var modifiedPath = _extends({}, path, {
            pathname: prefixedPath
          });
          history.replace(modifiedPath, state);
        } else {
          history.replace(baseExtensionPath + path, state);
        }
      },
      location: _extends({}, history.location, {
        pathname: baseExtensionPath + history.location.pathname
      })
    })
  }));
}
Router.computeRootMatch = function (pathname) {
  return {
    path: "/",
    url: "/",
    params: {},
    isExact: pathname === "/"
  };
};
Router.propTypes = {
  children: PropTypes.node,
  history: PropTypes.object.isRequired,
  staticContext: PropTypes.object,
  debug: PropTypes.bool
};

/**
 * The public API for a <Router> that stores location in memory.
 */
var MemoryRouter = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(MemoryRouter, _React$Component);
  function MemoryRouter() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.history = createMemoryHistory(_this.props);
    return _this;
  }
  var _proto = MemoryRouter.prototype;
  _proto.render = function render() {
    return /*#__PURE__*/React.createElement(Router, {
      history: this.history,
      children: this.props.children
    });
  };
  return MemoryRouter;
}(React.Component);
if (process.env.NODE_ENV !== "production") {
  MemoryRouter.propTypes = {
    initialEntries: PropTypes.array,
    initialIndex: PropTypes.number,
    getUserConfirmation: PropTypes.func,
    keyLength: PropTypes.number,
    children: PropTypes.node
  };
  MemoryRouter.prototype.componentDidMount = function () {
    process.env.NODE_ENV !== "production" ? warning(!this.props.history, "<MemoryRouter> ignores the history prop. To use a custom history, " + "use `import { Router }` instead of `import { MemoryRouter as Router }`.") : void 0;
  };
}

var Lifecycle = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Lifecycle, _React$Component);
  function Lifecycle() {
    return _React$Component.apply(this, arguments) || this;
  }
  var _proto = Lifecycle.prototype;
  _proto.componentDidMount = function componentDidMount() {
    if (this.props.onMount) this.props.onMount.call(this, this);
  };
  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (this.props.onUpdate) this.props.onUpdate.call(this, this, prevProps);
  };
  _proto.componentWillUnmount = function componentWillUnmount() {
    if (this.props.onUnmount) this.props.onUnmount.call(this, this);
  };
  _proto.render = function render() {
    return null;
  };
  return Lifecycle;
}(React.Component);

/**
 * The public API for prompting the user before navigating away from a screen.
 * Do not need to override the location handlers here. Ext devs don't / shouldn't use this component dashboard will.
 */
function Prompt(_ref) {
  var message = _ref.message,
    _ref$when = _ref.when,
    when = _ref$when === void 0 ? true : _ref$when;
  return /*#__PURE__*/React.createElement(context.Consumer, null, function (context) {
    !context ? process.env.NODE_ENV !== "production" ? invariant(false, "You should not use <Prompt> outside a <Router>") : invariant(false) : void 0;
    if (!when || context.staticContext) return null;
    var method = context.history.block;
    return /*#__PURE__*/React.createElement(Lifecycle, {
      onMount: function onMount(self) {
        self.release = method(message);
      },
      onUpdate: function onUpdate(self, prevProps) {
        if (prevProps.message !== message) {
          self.release();
          self.release = method(message);
        }
      },
      onUnmount: function onUnmount(self) {
        self.release();
      },
      message: message
    });
  });
}
if (process.env.NODE_ENV !== "production") {
  var messageType = PropTypes.oneOfType([PropTypes.func, PropTypes.string]);
  Prompt.propTypes = {
    when: PropTypes.bool,
    message: messageType.isRequired
  };
}

var cache = {};
var cacheLimit = 10000;
var cacheCount = 0;
function compilePath(path) {
  if (cache[path]) return cache[path];
  var generator = pathToRegexp.compile(path);
  if (cacheCount < cacheLimit) {
    cache[path] = generator;
    cacheCount++;
  }
  return generator;
}

/**
 * Public API for generating a URL pathname from a path and parameters.
 */
function generatePath(path, params) {
  if (path === void 0) {
    path = "/";
  }
  if (params === void 0) {
    params = {};
  }
  return path === "/" ? path : compilePath(path)(params, {
    pretty: true
  });
}

/**
 * The public API for navigating programmatically with a component.
 */
function Redirect(_ref) {
  var computedMatch = _ref.computedMatch,
    to = _ref.to,
    _ref$push = _ref.push,
    push = _ref$push === void 0 ? false : _ref$push;
  return /*#__PURE__*/React.createElement(context.Consumer, null, function (context) {
    var prefixedTo = context.baseExtensionPath + ((to === null || to === void 0 ? void 0 : to.pathname) || to);
    !context ? process.env.NODE_ENV !== "production" ? invariant(false, "You should not use <Redirect> outside a <Router>") : invariant(false) : void 0;
    var history = context.history,
      staticContext = context.staticContext;
    var method = push ? history.push : history.replace;
    var location = createLocation(computedMatch ? typeof to === "string" ? generatePath(prefixedTo, computedMatch.params) : _extends({}, to, {
      pathname: generatePath(prefixedTo, computedMatch.params)
    }) : to);

    // When rendering in a static context,
    // set the new location immediately.
    if (staticContext) {
      method(location);
      return null;
    }
    return /*#__PURE__*/React.createElement(Lifecycle, {
      onMount: function onMount() {
        method(location);
      },
      onUpdate: function onUpdate(self, prevProps) {
        var prevLocation = createLocation(prevProps.to);
        if (!locationsAreEqual(prevLocation, _extends({}, location, {
          key: prevLocation.key
        }))) {
          method(location);
        }
      },
      to: to
    });
  });
}
if (process.env.NODE_ENV !== "production") {
  Redirect.propTypes = {
    push: PropTypes.bool,
    from: PropTypes.string,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
  };
}

var cache$1 = {};
var cacheLimit$1 = 10000;
var cacheCount$1 = 0;
function compilePath$1(path, options) {
  var cacheKey = "" + options.end + options.strict + options.sensitive;
  var pathCache = cache$1[cacheKey] || (cache$1[cacheKey] = {});
  if (pathCache[path]) return pathCache[path];
  var keys = [];
  var regexp = pathToRegexp(path, keys, options);
  var result = {
    regexp: regexp,
    keys: keys
  };
  if (cacheCount$1 < cacheLimit$1) {
    pathCache[path] = result;
    cacheCount$1++;
  }
  return result;
}

/**
 * Public API for matching a URL pathname to a path.
 */
function matchPath(pathname, options) {
  if (options === void 0) {
    options = {};
  }
  if (typeof options === "string" || Array.isArray(options)) {
    options = {
      path: options
    };
  }
  var _options = options,
    path = _options.path,
    _options$exact = _options.exact,
    exact = _options$exact === void 0 ? false : _options$exact,
    _options$strict = _options.strict,
    strict = _options$strict === void 0 ? false : _options$strict,
    _options$sensitive = _options.sensitive,
    sensitive = _options$sensitive === void 0 ? false : _options$sensitive;
  var paths = [].concat(path);
  return paths.reduce(function (matched, path) {
    if (!path && path !== "") return null;
    if (matched) return matched;
    var _compilePath = compilePath$1(path, {
        end: exact,
        strict: strict,
        sensitive: sensitive
      }),
      regexp = _compilePath.regexp,
      keys = _compilePath.keys;
    var match = regexp.exec(pathname);
    if (!match) return null;
    var url = match[0],
      values = match.slice(1);
    var isExact = pathname === url;
    if (exact && !isExact) return null;
    return {
      path: path,
      // the path used to match
      url: path === "/" && url === "" ? "/" : url,
      // the matched portion of the URL
      isExact: isExact,
      // whether or not we matched exactly
      params: keys.reduce(function (memo, key, index) {
        memo[key.name] = values[index];
        return memo;
      }, {})
    };
  }, null);
}

function isEmptyChildren(children) {
  return React.Children.count(children) === 0;
}
function evalChildrenDev(children, props, path) {
  var value = children(props);
  process.env.NODE_ENV !== "production" ? warning(value !== undefined, "You returned `undefined` from the `children` function of " + ("<Route" + (path ? " path=\"" + path + "\"" : "") + ">, but you ") + "should have returned a React element or `null`") : void 0;
  return value || null;
}

/**
 * The public API for matching a single path and rendering.
 */
var Route = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Route, _React$Component);
  function Route() {
    return _React$Component.apply(this, arguments) || this;
  }
  var _proto = Route.prototype;
  _proto.render = function render() {
    var _this = this;
    return /*#__PURE__*/React.createElement(context.Consumer, null, function (context$1) {
      var prefix = context$1.baseExtensionPath;
      var prefixedPath = prefix + _this.props.path;
      !context$1 ? process.env.NODE_ENV !== "production" ? invariant(false, "You should not use <Route> outside a <Router>") : invariant(false) : void 0;
      var location = _this.props.location || context$1.location;
      var match = _this.props.computedMatch ? _this.props.computedMatch : prefixedPath ? matchPath(location.pathname, _extends({}, _this.props, {
        path: prefixedPath
      })) : context$1.match;
      var props = _extends({}, context$1, {
        location: location,
        match: match
      });
      var _this$props = _this.props,
        children = _this$props.children,
        component = _this$props.component,
        render = _this$props.render;
      if (Array.isArray(children) && children.length === 0) {
        children = null;
      }
      return /*#__PURE__*/React.createElement(context.Provider, {
        value: props
      }, props.match ? children ? typeof children === "function" ? evalChildrenDev(children, props, prefixedPath) : children : component ? /*#__PURE__*/React.createElement(component, props) : render ? render(props) : null : null);
    });
  };
  return Route;
}(React.Component);
if (process.env.NODE_ENV !== "production") {
  Route.propTypes = {
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    component: function component(props, propName) {
      if (props[propName] && !isValidElementType(props[propName])) {
        return new Error("Invalid prop 'component' supplied to 'Route': the prop is not a valid React component");
      }
    },
    exact: PropTypes.bool,
    location: PropTypes.object,
    path: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    render: PropTypes.func,
    sensitive: PropTypes.bool,
    strict: PropTypes.bool
  };
  Route.prototype.componentDidMount = function () {
    process.env.NODE_ENV !== "production" ? warning(!(this.props.children && !isEmptyChildren(this.props.children) && this.props.component), "You should not use <Route component> and <Route children> in the same route; <Route component> will be ignored") : void 0;
    process.env.NODE_ENV !== "production" ? warning(!(this.props.children && !isEmptyChildren(this.props.children) && this.props.render), "You should not use <Route render> and <Route children> in the same route; <Route render> will be ignored") : void 0;
    process.env.NODE_ENV !== "production" ? warning(!(this.props.component && this.props.render), "You should not use <Route component> and <Route render> in the same route; <Route render> will be ignored") : void 0;
  };
  Route.prototype.componentDidUpdate = function (prevProps) {
    process.env.NODE_ENV !== "production" ? warning(!(this.props.location && !prevProps.location), '<Route> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.') : void 0;
    process.env.NODE_ENV !== "production" ? warning(!(!this.props.location && prevProps.location), '<Route> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.') : void 0;
  };
}

var _excluded = ["basename", "context", "location"];
function addLeadingSlash(path) {
  return path.charAt(0) === "/" ? path : "/" + path;
}
function addBasename(basename, location) {
  if (!basename) return location;
  return _extends({}, location, {
    pathname: addLeadingSlash(basename) + location.pathname
  });
}
function stripBasename(basename, location) {
  if (!basename) return location;
  var base = addLeadingSlash(basename);
  if (location.pathname.indexOf(base) !== 0) return location;
  return _extends({}, location, {
    pathname: location.pathname.substr(base.length)
  });
}
function createURL(location) {
  return typeof location === "string" ? location : createPath(location);
}
function staticHandler(methodName) {
  return function () {
     process.env.NODE_ENV !== "production" ? invariant(false, "You cannot %s with <StaticRouter>", methodName) : invariant(false) ;
  };
}
function noop() {}

/**
 * The public top-level API for a "static" <Router>, so-called because it
 * can't actually change the current location. Instead, it just records
 * location changes in a context object. Useful mainly in testing and
 * server-rendering scenarios.
 */
var StaticRouter = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(StaticRouter, _React$Component);
  function StaticRouter() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.handlePush = function (location) {
      return _this.navigateTo(location, "PUSH");
    };
    _this.handleReplace = function (location) {
      return _this.navigateTo(location, "REPLACE");
    };
    _this.handleListen = function () {
      return noop;
    };
    _this.handleBlock = function () {
      return noop;
    };
    return _this;
  }
  var _proto = StaticRouter.prototype;
  _proto.navigateTo = function navigateTo(location, action) {
    var _this$props = this.props,
      _this$props$basename = _this$props.basename,
      basename = _this$props$basename === void 0 ? "" : _this$props$basename,
      _this$props$context = _this$props.context,
      context = _this$props$context === void 0 ? {} : _this$props$context;
    context.action = action;
    context.location = addBasename(basename, createLocation(location));
    context.url = createURL(context.location);
  };
  _proto.render = function render() {
    var _this$props2 = this.props,
      _this$props2$basename = _this$props2.basename,
      basename = _this$props2$basename === void 0 ? "" : _this$props2$basename,
      _this$props2$context = _this$props2.context,
      context = _this$props2$context === void 0 ? {} : _this$props2$context,
      _this$props2$location = _this$props2.location,
      location = _this$props2$location === void 0 ? "/" : _this$props2$location,
      rest = _objectWithoutPropertiesLoose(_this$props2, _excluded);
    var history = {
      createHref: function createHref(path) {
        return addLeadingSlash(basename + createURL(path));
      },
      action: "POP",
      location: stripBasename(basename, createLocation(location)),
      push: this.handlePush,
      replace: this.handleReplace,
      go: staticHandler("go"),
      goBack: staticHandler("goBack"),
      goForward: staticHandler("goForward"),
      listen: this.handleListen,
      block: this.handleBlock
    };
    return /*#__PURE__*/React.createElement(Router, _extends({}, rest, {
      history: history,
      staticContext: context
    }));
  };
  return StaticRouter;
}(React.Component);
if (process.env.NODE_ENV !== "production") {
  StaticRouter.propTypes = {
    basename: PropTypes.string,
    context: PropTypes.object,
    location: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  };
  StaticRouter.prototype.componentDidMount = function () {
    process.env.NODE_ENV !== "production" ? warning(!this.props.history, "<StaticRouter> ignores the history prop. To use a custom history, " + "use `import { Router }` instead of `import { StaticRouter as Router }`.") : void 0;
  };
}

/**
 * The public API for rendering the first <Route> that matches.
 */
var Switch = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Switch, _React$Component);
  function Switch() {
    return _React$Component.apply(this, arguments) || this;
  }
  var _proto = Switch.prototype;
  _proto.render = function render() {
    var _this = this;
    return /*#__PURE__*/React.createElement(context.Consumer, null, function (context) {
      var prefix = context.baseExtensionPath;
      !context ? process.env.NODE_ENV !== "production" ? invariant(false, "You should not use <Switch> outside a <Router>") : invariant(false) : void 0;
      var location = _this.props.location || context.location;
      var element, match;

      // We use React.Children.forEach instead of React.Children.toArray().find()
      // here because toArray adds keys to all child elements and we do not want
      // to trigger an unmount/remount for two <Route>s that render the same
      // component at different URLs.
      React.Children.forEach(_this.props.children, function (child) {
        if (match == null && /*#__PURE__*/React.isValidElement(child)) {
          var _child$props = child.props,
            path = _child$props.path,
            _child$props$exact = _child$props.exact,
            exact = _child$props$exact === void 0 ? false : _child$props$exact,
            _child$props$strict = _child$props.strict,
            strict = _child$props$strict === void 0 ? false : _child$props$strict,
            _child$props$sensitiv = _child$props.sensitive,
            sensitive = _child$props$sensitiv === void 0 ? false : _child$props$sensitiv;
          var fullPath = prefix + (path || "");

          // match needs to validate against all parts of the children routes, for the prefixs to work
          match = matchPath(location.pathname, {
            path: fullPath,
            exact: exact,
            strict: strict,
            sensitive: sensitive
          });
          if (match) {
            element = child;
          }
        }
      });
      return match ? /*#__PURE__*/React.cloneElement(element, {
        location: location,
        computedMatch: match
      }) : null;
    });
  };
  return Switch;
}(React.Component);
if (process.env.NODE_ENV !== "production") {
  Switch.propTypes = {
    children: PropTypes.node,
    location: PropTypes.object
  };
  Switch.prototype.componentDidUpdate = function (prevProps) {
    process.env.NODE_ENV !== "production" ? warning(!(this.props.location && !prevProps.location), '<Switch> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.') : void 0;
    process.env.NODE_ENV !== "production" ? warning(!(!this.props.location && prevProps.location), '<Switch> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.') : void 0;
  };
}

var _excluded$1 = ["wrappedComponentRef"];

/**
 * A public higher-order component to access the imperative API
 */
function withRouter(Component) {
  var displayName = "withRouter(" + (Component.displayName || Component.name) + ")";
  var C = function C(props) {
    var wrappedComponentRef = props.wrappedComponentRef,
      remainingProps = _objectWithoutPropertiesLoose(props, _excluded$1);
    return /*#__PURE__*/React.createElement(context.Consumer, null, function (context) {
      !context ? process.env.NODE_ENV !== "production" ? invariant(false, "You should not use <" + displayName + " /> outside a <Router>") : invariant(false) : void 0;
      return /*#__PURE__*/React.createElement(Component, _extends({}, remainingProps, context, {
        ref: wrappedComponentRef
      }));
    });
  };
  C.displayName = displayName;
  C.WrappedComponent = Component;
  if (process.env.NODE_ENV !== "production") {
    C.propTypes = {
      wrappedComponentRef: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object])
    };
  }
  return hoistStatics(C, Component);
}

var useContext = React.useContext;
function useHistory() {
  if (process.env.NODE_ENV !== "production") {
    !(typeof useContext === "function") ? process.env.NODE_ENV !== "production" ? invariant(false, "You must use React >= 16.8 in order to use useHistory()") : invariant(false) : void 0;
  }
  return useContext(historyContext);
}
function useLocation() {
  if (process.env.NODE_ENV !== "production") {
    !(typeof useContext === "function") ? process.env.NODE_ENV !== "production" ? invariant(false, "You must use React >= 16.8 in order to use useLocation()") : invariant(false) : void 0;
  }
  return useContext(context).location;
}
function useParams() {
  if (process.env.NODE_ENV !== "production") {
    !(typeof useContext === "function") ? process.env.NODE_ENV !== "production" ? invariant(false, "You must use React >= 16.8 in order to use useParams()") : invariant(false) : void 0;
  }
  var match = useContext(context).match;
  return match ? match.params : {};
}
function useRouteMatch(path) {
  if (process.env.NODE_ENV !== "production") {
    !(typeof useContext === "function") ? process.env.NODE_ENV !== "production" ? invariant(false, "You must use React >= 16.8 in order to use useRouteMatch()") : invariant(false) : void 0;
  }
  var location = useLocation();
  var match = useContext(context).match;
  return path ? matchPath(location.pathname, path) : match;
}

if (process.env.NODE_ENV !== "production") {
  if (typeof window !== "undefined") {
    var global = window;
    var key = "__react_router_build__";
    var buildNames = {
      cjs: "CommonJS",
      esm: "ES modules",
      umd: "UMD"
    };
    if (global[key] && global[key] !== "esm") {
      var initialBuildName = buildNames[global[key]];
      var secondaryBuildName = buildNames["esm"];

      // TODO: Add link to article that explains in detail how to avoid
      // loading 2 different builds.
      throw new Error("You are loading the " + secondaryBuildName + " build of React Router " + ("on a page that is already running the " + initialBuildName + " ") + "build, so things won't work right.");
    }
    global[key] = "esm";
  }
}

export { MemoryRouter, Prompt, Redirect, Route, Router, StaticRouter, Switch, historyContext as __HistoryContext, context as __RouterContext, generatePath, matchPath, useHistory, useLocation, useParams, useRouteMatch, withRouter };
//# sourceMappingURL=react-router.js.map
