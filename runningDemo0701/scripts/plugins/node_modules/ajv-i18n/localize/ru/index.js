'use strict';
module.exports = function localize_ru(errors) {
  if (!(errors && errors.length)) return;
  for (var i = 0; i < errors.length; i++) {
    var e = errors[i];
    var out;
    switch (e.keyword) {
      case '$ref':
        out = 'не найдена схема ' + (e.params.ref);
        break;
      case 'additionalItems':
        out = '';
        var n = e.params.limit;
        out += 'должно иметь не более, чем ' + (n) + ' элемент';
        if (n >= 2 && n <= 4) {
          out += 'а';
        } else if (n != 1) {
          out += 'ов';
        }
        break;
      case 'additionalProperties':
        out = 'не должно иметь дополнительные поля';
        break;
      case 'anyOf':
        out = 'должно соответствовать одной их схем в "anyOf"';
        break;
      case 'const':
        out = 'должно быть равно заданному значению';
        break;
      case 'contains':
        out = 'должно содержать значение соответствующее схеме';
        break;
      case 'custom':
        out = 'должно соответствовать правилу "' + (e.keyword) + '"';
        break;
      case 'dependencies':
        out = '';
        var n = e.params.depsCount;
        out += 'должно иметь пол';
        if (n == 1) {
          out += 'е';
        } else {
          out += 'я';
        }
        out += ' ' + (e.params.deps) + ', когда присутствует поле ' + (e.params.property);
        break;
      case 'enum':
        out = 'должно быть равен одному из значений в "enum"';
        break;
      case 'exclusiveMaximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'должно быть ' + (cond);
        break;
      case 'exclusiveMinimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'должно быть ' + (cond);
        break;
      case 'false schema':
        out = 'схема равна false';
        break;
      case 'format':
        out = 'должно соответствовать формату "' + (e.params.format) + '"';
        break;
      case 'formatExclusiveMaximum':
        out = 'formatExclusiveMaximum должно быть boolean';
        break;
      case 'formatExclusiveMinimum':
        out = 'formatExclusiveMinimum должно быть boolean';
        break;
      case 'formatMaximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'должно быть ' + (cond);
        break;
      case 'formatMinimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'должно быть ' + (cond);
        break;
      case 'if':
        out = 'должно соответствовать схемe "' + (e.params.failingKeyword) + '"';
        break;
      case 'maximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'должно быть ' + (cond);
        break;
      case 'maxItems':
        out = '';
        var n = e.params.limit;
        out += 'должно иметь не более, чем ' + (n) + ' элемент';
        if (n >= 2 && n <= 4) {
          out += 'а';
        } else if (n != 1) {
          out += 'ов';
        }
        break;
      case 'maxLength':
        out = '';
        var n = e.params.limit;
        out += 'должно быть не длиннее, чем ' + (n) + ' символ';
        if (n >= 2 && n <= 4) {
          out += 'а';
        } else if (n != 1) {
          out += 'ов';
        }
        break;
      case 'maxProperties':
        out = '';
        var n = e.params.limit;
        out += 'должно иметь не более, чем ' + (n) + ' пол';
        if (n == 1) {
          out += 'е';
        } else if (n >= 2 && n <= 4) {
          out += 'я';
        } else {
          out += 'ей';
        }
        break;
      case 'minimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'должно быть ' + (cond);
        break;
      case 'minItems':
        out = '';
        var n = e.params.limit;
        out += 'должно иметь не менее, чем ' + (n) + ' элемент';
        if (n >= 2 && n <= 4) {
          out += 'а';
        } else if (n != 1) {
          out += 'ов';
        }
        break;
      case 'minLength':
        out = '';
        var n = e.params.limit;
        out += 'должно быть не короче, чем ' + (n) + ' символ';
        if (n >= 2 && n <= 4) {
          out += 'а';
        } else if (n != 1) {
          out += 'ов';
        }
        break;
      case 'minProperties':
        out = '';
        var n = e.params.limit;
        out += 'должно иметь не менее, чем ' + (n) + ' пол';
        if (n == 1) {
          out += 'е';
        } else if (n >= 2 && n <= 4) {
          out += 'я';
        } else {
          out += 'ей';
        }
        break;
      case 'multipleOf':
        out = 'должно быть кратным ' + (e.params.multipleOf);
        break;
      case 'not':
        out = 'должно не соответствовать схеме в "not"';
        break;
      case 'oneOf':
        out = 'должно соответствовать в точности одной схемe в "oneOf"';
        break;
      case 'pattern':
        out = 'должно соответствовать образцу "' + (e.params.pattern) + '"';
        break;
      case 'patternRequired':
        out = 'должно иметь поле, соответствующее образцу "' + (e.params.missingPattern) + '"';
        break;
      case 'propertyNames':
        out = 'имя поля \'' + (e.params.propertyName) + '\' не соответствует схеме';
        break;
      case 'required':
        out = 'должно иметь обязательное поле ' + (e.params.missingProperty);
        break;
      case 'switch':
        out = 'должно соответствовать правилу ' + (e.params.caseIndex) + ' в "switch"';
        break;
      case 'type':
        out = 'должно быть ' + (e.params.type);
        break;
      case 'uniqueItems':
        out = 'не должно иметь повторяющихся элементов (элементы ' + (e.params.j) + ' и ' + (e.params.i) + ' идентичны)';
        break;
      default:
        continue;
    }
    e.message = out;
  }
};
