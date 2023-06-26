# react-router

A safe react-router wrapper for use in Ellucian Experience Extensions. Used as a dependency in react-router-dom.

If you are already using react-router-dom in your Extension, you do not need to include this package.

Check out [@ellucian/react-router-dom](https://github.com/ellucian-developer/react-router-dom) for more details

## Differences

### Router

Changes have been made to the Router components to always assume history based on the Ellucian Experience Router. This history is stored in context and shared among the other child components

Additionally, a `debug` prop has been added which can help debug history changes and location during development. `debug` is a boolean which defaults to false.

### Switch

Grabs new history from context, and uses this as a base for all child `Route` components.

### Route

Adds an appropriate prefix based on history context. The prop `path` should remain unchanged from it's standard usage.

### Redirect

Prefixs redirect paths based on history context. The prop `to` should remain unchanged from it's standard usage.

## Contribute

If there's a bug please submit open an issue report through GitHub's interface.

Pull Requests are welcomed.