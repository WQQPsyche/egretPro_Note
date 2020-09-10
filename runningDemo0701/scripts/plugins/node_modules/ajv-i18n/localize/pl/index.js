'use strict';
module.exports = function localize_pl(errors) {
  if (!(errors && errors.length)) return;
  for (var i = 0; i < errors.length; i++) {
    var e = errors[i];
    var out;
    switch (e.keyword) {
      case '$ref':
        out = 'nie można znaleść schematu ' + (e.params.ref);
        break;
      case 'additionalItems':
        out = '';
        var n = e.params.limit;
        out += 'nie powinien mieć więcej niż ' + (n) + ' element';
        if (n == 1) {
          out += 'u';
        } else {
          out += 'ów';
        }
        break;
      case 'additionalProperties':
        out = 'nie powinien zawierać dodatkowych pól';
        break;
      case 'anyOf':
        out = 'powinien pasować do wzoru z sekcji "anyOf"';
        break;
      case 'const':
        out = 'powinien być równy stałej';
        break;
      case 'contains':
        out = 'should contain a valid item';
        break;
      case 'custom':
        out = 'powinien przejść walidację "' + (e.keyword) + '"';
        break;
      case 'dependencies':
        out = '';
        var n = e.params.depsCount;
        out += 'powinien zawierać pol';
        if (n == 1) {
          out += 'e';
        } else {
          out += 'a';
        }
        out += ' ' + (e.params.deps) + ' kiedy pole ' + (e.params.property) + ' jest obecne';
        break;
      case 'enum':
        out = 'powinien być równy jednej z predefiniowanych wartości';
        break;
      case 'exclusiveMaximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'powinien być ' + (cond);
        break;
      case 'exclusiveMinimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'powinien być ' + (cond);
        break;
      case 'false schema':
        out = 'boolean schema is false';
        break;
      case 'format':
        out = 'powinien zgadzać się z formatem "' + (e.params.format) + '"';
        break;
      case 'formatExclusiveMaximum':
        out = 'formatExclusiveMaximum powinien być boolean';
        break;
      case 'formatExclusiveMinimum':
        out = 'formatExclusiveMinimum powinień być boolean';
        break;
      case 'formatMaximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'powinien być ' + (cond);
        break;
      case 'formatMinimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'powinien być ' + (cond);
        break;
      case 'if':
        out = 'should match "' + (e.params.failingKeyword) + '" schema';
        break;
      case 'maximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'powinien być ' + (cond);
        break;
      case 'maxItems':
        out = '';
        var n = e.params.limit;
        out += 'nie powinien mieć więcej niż ' + (n) + ' element';
        if (n == 1) {
          out += 'u';
        } else {
          out += 'ów';
        }
        break;
      case 'maxLength':
        out = '';
        var n = e.params.limit;
        out += 'nie powinien być dłuższy niż ' + (n) + ' znak';
        if (n != 1) {
          out += 'ów';
        }
        break;
      case 'maxProperties':
        out = '';
        var n = e.params.limit;
        out += 'nie powinien zawierać więcej niż ' + (n) + ' ';
        if (n == 1) {
          out += 'pole';
        } else {
          out += 'pól';
        }
        break;
      case 'minimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'powinien być ' + (cond);
        break;
      case 'minItems':
        out = '';
        var n = e.params.limit;
        out += 'nie powinien mieć mniej niż ' + (n) + ' element';
        if (n == 1) {
          out += 'u';
        } else {
          out += 'ów';
        }
        break;
      case 'minLength':
        out = '';
        var n = e.params.limit;
        out += 'nie powinien być krótszy niż ' + (n) + ' znak';
        if (n != 1) {
          out += 'ów';
        }
        break;
      case 'minProperties':
        out = '';
        var n = e.params.limit;
        out += 'nie powinien zawierać mniej niż ' + (n) + ' ';
        if (n == 1) {
          out += 'pole';
        } else {
          out += 'pól';
        }
        break;
      case 'multipleOf':
        out = 'powinien być wielokrotnością ' + (e.params.multipleOf);
        break;
      case 'not':
        out = 'nie powinien pasować do wzoru z sekcji "not"';
        break;
      case 'oneOf':
        out = 'powinien pasować do jednego wzoru z sekcji "oneOf"';
        break;
      case 'pattern':
        out = 'powinien zgadzać się ze wzorem "' + (e.params.pattern) + '"';
        break;
      case 'patternRequired':
        out = 'powinien mieć pole pasujące do wzorca "' + (e.params.missingPattern) + '"';
        break;
      case 'propertyNames':
        out = 'property name \'' + (e.params.propertyName) + '\' is invalid';
        break;
      case 'required':
        out = 'powinien zawierać wymagane pole ' + (e.params.missingProperty);
        break;
      case 'switch':
        out = 'powinien przejść walidacje pola "switch", przypadek ' + (e.params.caseIndex) + ' zawiódł';
        break;
      case 'type':
        out = 'powinien być ' + (e.params.type);
        break;
      case 'uniqueItems':
        out = 'nie powinien zawierać elementów które się powtarzają (elementy ' + (e.params.j) + ' i ' + (e.params.i) + ' są identyczne)';
        break;
      default:
        continue;
    }
    e.message = out;
  }
};
