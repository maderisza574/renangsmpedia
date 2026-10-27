const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'node_modules', 'react-native', 'index.js');

if (fs.existsSync(targetPath)) {
  let content = fs.readFileSync(targetPath, 'utf8');
  if (content.includes("invariant(\n        false,\n        'InteractionManager has been removed from react-native core.")) {
    const fallbackCode = `const fallbackInteractionManager = {
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

  Object.defineProperty(module.exports, 'InteractionManager', {
    configurable: true,
    get() {
      return fallbackInteractionManager;
    },
  });`;

    content = content.replace(/Object\.defineProperty\(module\.exports, 'InteractionManager', \{[\s\S]*?\}\);\s*\}/, fallbackCode + '\n}');
    fs.writeFileSync(targetPath, content, 'utf8');
    console.log('[patch-interaction-manager] Patched InteractionManager in react-native/index.js successfully.');
  } else {
    console.log('[patch-interaction-manager] InteractionManager is already patched or invariant not found.');
  }
}
