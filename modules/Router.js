import React, { useEffect, useContext, useState } from "react";
import PropTypes from "prop-types";

import HistoryContext from "./HistoryContext.js";
import RouterContext from "./RouterContext.js";

import useBasePath from "./generateExtensionPath.js";

function Router(props) {
  // contexts is defined at a global scope within experience for extesnions
  // eslint-disable-next-line no-undef
  const history = useContext(contexts.ExtensionContext)?.dashboardInfo?.history;

  const [location, setLocation] = useState(history.location);
  const [isMounted, setIsMounted] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(null);

  const baseExtensionPath = useBasePath();

  useEffect(() => {
    setIsMounted(true);

    if (pendingLocation) {
      setLocation(pendingLocation);
    }

    return () => {
      if (history.unlisten) history.unlisten();
    };
  }, [pendingLocation, history]);

  useEffect(() => {
    if (!props.staticContext) {
      const unlisten = history.listen(newLocation => {
        if (isMounted) {
          setLocation(newLocation);
        } else {
          setPendingLocation(newLocation);
        }
      });

      return () => {
        unlisten();
      };
    }
  }, [isMounted, history, props.staticContext]);

  useEffect(() => {
    if (props.debug) {
      console.warn(
        "Debug mode enabled. It should be disabled before production deployment."
      );
      console.log("initial history is: ", JSON.stringify(history, null, 2));
      history.listen((location, action) => {
        console.log("<---------- History mutated ---------->");
        console.log(
          `Current Browser URL: ${location.pathname}${location.search}${location.hash}`
        );
        console.log(
          `Last history mutation: ${action}`,
          JSON.stringify(history, null, 2)
        );
      });
    }
  }, [props.debug, history, props.children, baseExtensionPath]);

  return (
    <RouterContext.Provider
      value={{
        history: history,
        location: location,
        match: Router.computeRootMatch(location.pathname),
        staticContext: props.staticContext,
        baseExtensionPath: baseExtensionPath
      }}
    >
      <HistoryContext.Provider
        children={props.children || null}
        value={{
          ...history,
          push: (path, state) => {
            if (typeof path === 'object') {
              const prefixedPath = baseExtensionPath + path.pathname;
              const modifiedPath = {
                ...path,
                pathname: prefixedPath
              };
              history.push(modifiedPath, state);
            } else {
              history.push(baseExtensionPath + path, state);
            }
          },
          replace: (path, state) => {
            if (typeof path === 'object') {
              const prefixedPath = baseExtensionPath + path.pathname;
              const modifiedPath = {
                ...path,
                pathname: prefixedPath
              };
              history.replace(modifiedPath, state);
            } else {
              history.replace(baseExtensionPath + path, state);
            }
          },
          location: {
            ...history.location,
            pathname: baseExtensionPath + history.location.pathname
          }
        }}
      />
    </RouterContext.Provider>
  );
}

Router.computeRootMatch = function (pathname) {
  return { path: "/", url: "/", params: {}, isExact: pathname === "/" };
};

Router.propTypes = {
  children: PropTypes.node,
  history: PropTypes.object.isRequired,
  staticContext: PropTypes.object,
  debug: PropTypes.bool
};

export default Router;
