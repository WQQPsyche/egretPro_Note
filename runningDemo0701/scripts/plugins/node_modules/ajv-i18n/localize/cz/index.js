'use strict';
module.exports = function localize_cz(errors) {
  if (!(errors && errors.length)) return;
  for (var i = 0; i < errors.length; i++) {
    var e = errors[i];
    var out;
    switch (e.keyword) {
      case '$ref':
        out = 'reference ' + (e.params.ref) + ' nenalezena';
        break;
      case 'additionalItems':
        out = '';
        var n = e.params.limit;
        out += 'nemůže mít víc, než ' + (n) + ' prv';
        if (n == 1) {
          out += 'ek';
        } else {
          out += 'ků';
        }
        break;
      case 'additionalProperties':
        out = 'nemůže mít další položky';
        break;
      case 'anyOf':
        out = 'musí vyhovět alespoň jednomu schématu v "anyOf"';
        break;
      case 'const':
        out = 'musí být konstantní';
        break;
      case 'contains':
        out = 'musí obsahovat prvek odpovídající schématu';
        break;
      case 'custom':
        out = 'musí vyhovět "' + (e.keyword) + '" validaci';
        break;
      case 'dependencies':
        out = '';
        var n = e.params.depsCount;
        out += ' musí mít polož';
        if (n >= 2 && n <= 4) {
          out += 'ky';
        } else if (n != 1) {
          out += 'ek';
        } else {
          out += 'ka';
        }
        out += ': ' + (e.params.deps) + ', pokud obsahuje ' + (e.params.property);
        break;
      case 'enum':
        out = 'musí být rovna jedné hodnotě z výčtu';
        break;
      case 'exclusiveMaximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'musí být ' + (cond);
        break;
      case 'exclusiveMinimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'musí být ' + (cond);
        break;
      case 'false schema':
        out = 'schéma je false';
        break;
      case 'format':
        out = 'musí být ve formátu "' + (e.params.format) + '"';
        break;
      case 'formatExclusiveMaximum':
        out = 'formatExclusiveMaximum musí být boolean';
        break;
      case 'formatExclusiveMinimum':
        out = 'formatExclusiveMinimum musí být boolean';
        break;
      case 'formatMaximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'musí být ' + (cond);
        break;
      case 'formatMinimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'musí být ' + (cond);
        break;
      case 'if':
        out = 'should match "' + (e.params.failingKeyword) + '" schema';
        break;
      case 'maximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'musí být ' + (cond);
        break;
      case 'maxItems':
        out = '';
        var n = e.params.limit;
        out += 'nesmí obsahovat víc než ' + (n) + ' prv';
        if (n == 1) {
          out += 'ek';
        } else {
          out += 'ků';
        }
        break;
      case 'maxLength':
        out = '';
        var n = e.params.limit;
        out += 'nesmí být delší než ' + (n) + ' znak';
        if (n != 1) {
          out += 'ů';
        }
        break;
      case 'maxProperties':
        out = '';
        var n = e.params.limit;
        out += 'nesmí mít víc než ' + (n) + ' polož';
        if (n >= 2 && n <= 4) {
          out += 'ky';
        } else if (n != 1) {
          out += 'ek';
        } else {
          out += 'ka';
        }
        break;
      case 'minimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'musí být ' + (cond);
        break;
      case 'minItems':
        out = '';
        var n = e.params.limit;
        out += 'nesmí obsahovat méně než ' + (n) + ' prv';
        if (n == 1) {
          out += 'ek';
        } else {
          out += 'ků';
        }
        break;
      case 'minLength':
        out = '';
        var n = e.params.limit;
        out += 'nesmí být kratší než ' + (n) + ' znak';
        if (n != 1) {
          out += 'ů';
        }
        break;
      case 'minProperties':
        out = '';
        var n = e.params.limit;
        out += 'nesmí mít méně než ' + (n) + ' polož';
        if (n >= 2 && n <= 4) {
          out += 'ky';
        } else if (n != 1) {
          out += 'ek';
        } else {
          out += 'ka';
        }
        break;
      case 'multipleOf':
        out = 'musí být násobkem ' + (e.params.multipleOf);
        break;
      case 'not':
        out = 'nesmí vyhovět schématu v "not"';
        break;
      case 'oneOf':
        out = 'musí vyhovět právě jednomu schématu v "oneOf"';
        break;
      case 'pattern':
        out = 'musí vyhovět regulárnímu výrazu "' + (e.params.pattern) + '"';
        break;
      case 'patternRequired':
        out = 'musí obsahovat položku vyhovující regulárnímu výrazu "' + (e.params.missingPattern) + '"';
        break;
      case 'propertyNames':
        out = 'název položky \'' + (e.params.propertyName) + '\' neodpovídá schématu';
        break;
      case 'required':
        out = 'musí obsahovat požadovanou položku ' + (e.params.missingProperty);
        break;
      case 'switch':
        out = 'musí projít validácí "switch", případ ' + (e.params.caseIndex) + ' je neúspěšný';
        break;
      case 'type':
        out = 'musí být ' + (e.params.type);
        break;
      case 'uniqueItems':
        out = 'nesmí obsahovat duplicitní prvky (prvky ## ' + (e.params.j) + ' a ' + (e.params.i) + ' jsou stejné)';
        break;
      default:
        continue;
    }
    e.message = out;
  }
};
