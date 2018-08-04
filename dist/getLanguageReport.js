"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// returns stats for a specific language
// - added: contains all added messages
// - untranslated: contains all untranslated messages
// - deleted: contains all deleted messages
// - fileOutput: contains output for the new language file
//               a single object with all added and untranslated messages
//               in a key (messageKey) value (message) format
// - whitelistOutput: contains output for the new languageWhitelist file
//                    all previously whitelisted keys, without the deleted keys
//
// {
//   added: [],
//   untranslated: [],
//   deleted: [],
//   fileOutput: {},
//   whitelistOutput: [],
// }
//
// every message is declared in the following format
// {
//   key: 'unique_message_key',
//   message: 'specific_message',
// }

var getCleanReport = exports.getCleanReport = function getCleanReport() {
  return {
    added: [],
    renamed: [],
    untranslated: [],
    deleted: [],
    fileOutput: {},
    whitelistOutput: []
  };
};

exports.default = function (defaultMessages) {
  var languageMessages = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var languageWhitelist = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var renameIds = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

  var result = getCleanReport();

  var defaultMessageKeys = Object.keys(defaultMessages);

  defaultMessageKeys.forEach(function (key) {
    var oldMessage = renameIds[key] && languageMessages[renameIds[key]] ? languageMessages[renameIds[key]] : languageMessages[key];

    var defaultMessage = defaultMessages[key];

    if (oldMessage) {
      result.fileOutput[key] = oldMessage;

      if (oldMessage === defaultMessage) {
        if (languageWhitelist.indexOf(key) === -1) {
          result.untranslated.push({
            key: key,
            message: defaultMessage
          });
        } else {
          result.whitelistOutput.push(key);
        }
      }
    } else {
      result.fileOutput[key] = defaultMessage;

      result.added.push({
        key: key,
        message: defaultMessage
      });
    }
  });

  // if the key is still in the language file but no longer in the
  // defaultMessages file, then the key was deleted.
  result.deleted = Object.keys(languageMessages).filter(function (key) {
    return defaultMessageKeys.indexOf(key) === -1;
  }).filter(function (key) {
    return Object.values(renameIds).indexOf(key) === -1;
  }).map(function (key) {
    return {
      key: key,
      message: languageMessages[key]
    };
  });

  result.renamed = Object.entries(renameIds).filter(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
        key = _ref2[0];

    return languageMessages[renameIds[key]];
  }).map(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        newKey = _ref4[0],
        oldKey = _ref4[1];

    return {
      key: newKey,
      from: oldKey,
      message: languageMessages[oldKey]
    };
  });

  return result;
};