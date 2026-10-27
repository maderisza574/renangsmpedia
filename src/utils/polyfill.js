import * as ReactNative from 'react-native';

const fallbackInteractionManager = {
  runAfterInteractions(task) {
    if (typeof task === 'function') {
      const handle = setTimeout(task, 0);
      return {
        then: (resolve) => Promise.resolve().then(task).then(resolve),
        done: (...args) => task(...args),
        cancel: () => clearTimeout(handle),
      };
    }
    return {
      then: (resolve) => resolve && resolve(),
      done: () => {},
      cancel: () => {},
    };
  },
  createInteractionHandle() {
    return 1;
  },
  clearInteractionHandle() {},
  setDeadline() {},
  addListener() {
    return { remove: () => {} };
  },
  Events: {
    interactionStart: 'interactionStart',
    interactionComplete: 'interactionComplete',
  },
};

try {
  Object.defineProperty(ReactNative, 'InteractionManager', {
    configurable: true,
    enumerable: true,
    get() {
      return fallbackInteractionManager;
    },
  });
} catch (e) {
  // If property cannot be redefined, ignore
}
