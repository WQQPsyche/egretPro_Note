'use strict';
module.exports = function localize_it(errors) {
  if (!(errors && errors.length)) return;
  for (var i = 0; i < errors.length; i++) {
    var e = errors[i];
    var out;
    switch (e.keyword) {
      case '$ref':
        out = 'non è possibile risolvere il riferimento ' + (e.params.ref);
        break;
      case 'additionalItems':
        out = '';
        var n = e.params.limit;
        out += 'non dovrebbe avere più di ' + (n) + ' element';
        if (n == 1) {
          out += 'o';
        } else {
          out += 'i';
        }
        break;
      case 'additionalProperties':
        out = 'non deve avere attributi aggiuntivi';
        break;
      case 'anyOf':
        out = 'deve corrispondere ad uno schema in "anyOf"';
        break;
      case 'const':
        out = 'deve essere uguale alla costante';
        break;
      case 'contains':
        out = 'deve contentere un elemento valido';
        break;
      case 'custom':
        out = 'deve essere valido secondo il criterio "' + (e.keyword) + '"';
        break;
      case 'dependencies':
        out = '';
        var n = e.params.depsCount;
        out += 'dovrebbe avere ';
        if (n == 1) {
          out += 'l\'';
        } else {
          out += 'gli ';
        }
        out += 'attribut';
        if (n == 1) {
          out += 'o';
        } else {
          out += 'i';
        }
        out += ' ' + (e.params.deps) + ' quando l\'attributo ' + (e.params.property) + ' è presente';
        break;
      case 'enum':
        out = 'dovrebbe essere uguale ad uno dei valori predefiniti';
        break;
      case 'exclusiveMaximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'deve essere ' + (cond);
        break;
      case 'exclusiveMinimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'deve essere ' + (cond);
        break;
      case 'false schema':
        out = 'lo schema booleano è falso';
        break;
      case 'format':
        out = 'deve corrispondere al formato "' + (e.params.format) + '"';
        break;
      case 'formatExclusiveMaximum':
        out = 'formatExclusiveMaximum deve essere booleano';
        break;
      case 'formatExclusiveMinimum':
        out = 'formatExclusiveMinimum deve essere booleano';
        break;
      case 'formatMaximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'deve essere ' + (cond);
        break;
      case 'formatMinimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'deve essere ' + (cond);
        break;
      case 'if':
        out = 'deve corrispondere allo schema "' + (e.params.failingKeyword) + '"';
        break;
      case 'maximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'deve essere ' + (cond);
        break;
      case 'maxItems':
        out = '';
        var n = e.params.limit;
        out += 'non deve avere più di ' + (n) + ' element';
        if (n == 1) {
          out += 'o';
        } else {
          out += 'i';
        }
        break;
      case 'maxLength':
        out = '';
        var n = e.params.limit;
        out += 'non deve essere più lungo di ' + (n) + ' caratter';
        if (n == 1) {
          out += 'e';
        } else {
          out += 'i';
        }
        break;
      case 'maxProperties':
        out = '';
        var n = e.params.limit;
        out += 'non deve avere più di ' + (n) + ' attribut';
        if (n == 1) {
          out += 'o';
        } else {
          out += 'i';
        }
        break;
      case 'minimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'deve essere ' + (cond);
        break;
      case 'minItems':
        out = '';
        var n = e.params.limit;
        out += 'non deve avere meno di ' + (n) + ' element';
        if (n == 1) {
          out += 'o';
        } else {
          out += 'i';
        }
        break;
      case 'minLength':
        out = '';
        var n = e.params.limit;
        out += 'non deve essere meno lungo di ' + (n) + ' caratter';
        if (n == 1) {
          out += 'e';
        } else {
          out += 'i';
        }
        break;
      case 'minProperties':
        out = '';
        var n = e.params.limit;
        out += 'non deve avere meno di ' + (n) + ' attribut';
        if (n == 1) {
          out += 'o';
        } else {
          out += 'i';
        }
        break;
      case 'multipleOf':
        out = 'deve essere un multiplo di ' + (e.params.multipleOf);
        break;
      case 'not':
        out = 'non deve essere valido in base allo schema di "non"';
        break;
      case 'oneOf':
        out = 'deve corrispondere esattamente ad uno schema in "oneOf"';
        break;
      case 'pattern':
        out = 'deve corrispondere al formato "' + (e.params.pattern) + '"';
        break;
      case 'patternRequired':
        out = 'deve avere un attributo che corrisponda al formato "' + (e.params.missingPattern) + '"';
        break;
      case 'propertyNames':
        out = 'il nome dell\'attritbuto \'' + (e.params.propertyName) + '\' non è valido';
        break;
      case 'required':
        out = 'deve avere l\'attributo obbligatorio ' + (e.params.missingProperty);
        break;
      case 'switch':
        out = 'deve passare la validazione del criterio "switch", il caso ' + (e.params.caseIndex) + ' fallisce';
        break;
      case 'type':
        out = 'deve essere di tipo ' + (e.params.type);
        break;
      case 'uniqueItems':
        out = 'non deve avere duplicati (gli elementi ## ' + (e.params.j) + ' e ' + (e.params.i) + ' sono uguali)';
        break;
      default:
        continue;
    }
    e.message = out;
  }
};
