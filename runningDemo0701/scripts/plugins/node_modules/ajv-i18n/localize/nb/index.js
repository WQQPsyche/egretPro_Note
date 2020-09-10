'use strict';
module.exports = function localize_nb(errors) {
  if (!(errors && errors.length)) return;
  for (var i = 0; i < errors.length; i++) {
    var e = errors[i];
    var out;
    switch (e.keyword) {
      case '$ref':
        out = 'kan ikke finne referansen ' + (e.params.ref);
        break;
      case 'additionalItems':
        out = '';
        var n = e.params.limit;
        out += 'kan ikke ha mer enn ' + (n) + ' element';
        if (n != 1) {
          out += 'er';
        }
        break;
      case 'additionalProperties':
        out = 'kan ikke ha flere egenskaper';
        break;
      case 'anyOf':
        out = 'må samsvare med et schema i "anyOf"';
        break;
      case 'const':
        out = 'må være lik konstanten';
        break;
      case 'contains':
        out = 'må inneholde et gyldig element';
        break;
      case 'custom':
        out = 'må samsvare med valideringen for ' + (e.keyword);
        break;
      case 'dependencies':
        out = '';
        var n = e.params.depsCount;
        out += 'må ha egenskapen';
        if (n != 1) {
          out += 'e';
        }
        out += ' ' + (e.params.deps) + ' når egenskapen ' + (e.params.property) + ' er angitt';
        break;
      case 'enum':
        out = 'må være lik en av de forhåndsdefinerte verdiene';
        break;
      case 'exclusiveMaximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'må være ' + (cond);
        break;
      case 'exclusiveMinimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'må være ' + (cond);
        break;
      case 'false schema':
        out = 'boolsk schema er usannt';
        break;
      case 'format':
        out = 'må stemme overens med formatet "' + (e.params.format) + '"';
        break;
      case 'formatExclusiveMaximum':
        out = 'formatExclusiveMaximum må være en boolsk verdi';
        break;
      case 'formatExclusiveMinimum':
        out = 'formatExclusiveMinimum må være en boolsk verdi';
        break;
      case 'formatMaximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'må være ' + (cond);
        break;
      case 'formatMinimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'må være ' + (cond);
        break;
      case 'if':
        out = 'should match "' + (e.params.failingKeyword) + '" schema';
        break;
      case 'maximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'må være ' + (cond);
        break;
      case 'maxItems':
        out = '';
        var n = e.params.limit;
        out += 'kan ikke ha fler enn ' + (n) + ' element';
        if (n != 1) {
          out += 'er';
        }
        break;
      case 'maxLength':
        out = '';
        var n = e.params.limit;
        out += 'kan ikke være lengre enn ' + (n) + ' tegn';
        break;
      case 'maxProperties':
        out = '';
        var n = e.params.limit;
        out += 'kan ikke ha mer enn ' + (n) + ' egenskap';
        if (n != 1) {
          out += 'er';
        }
        break;
      case 'minimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'må være ' + (cond);
        break;
      case 'minItems':
        out = '';
        var n = e.params.limit;
        out += 'kan ikke ha færre enn ' + (n) + ' element';
        if (n != 1) {
          out += 'er';
        }
        break;
      case 'minLength':
        out = '';
        var n = e.params.limit;
        out += 'kan ikke være kortere enn ' + (n) + ' tegn';
        break;
      case 'minProperties':
        out = '';
        var n = e.params.limit;
        out += 'kan ikke ha mindre enn ' + (n) + ' egenskap';
        if (n != 1) {
          out += 'er';
        }
        break;
      case 'multipleOf':
        out = 'må være et multiplum av ' + (e.params.multipleOf);
        break;
      case 'not':
        out = 'kan ikke samsvare med schema i "not"';
        break;
      case 'oneOf':
        out = 'må samsvare med nøyaktig ett schema i "oneOf"';
        break;
      case 'pattern':
        out = 'må samsvare med mønsteret "' + (e.params.pattern) + '"';
        break;
      case 'patternRequired':
        out = 'må ha en egenskap som samsvarer med mønsteret "' + (e.params.missingPattern);
        break;
      case 'propertyNames':
        out = 'egenskapen med navnet \'';
        e.params.propertyNameout += '\' er ugyldig';
        break;
      case 'required':
        out = 'må ha den påkrevde egenskapen ' + (e.params.missingProperty);
        break;
      case 'switch':
        out = 'må passere "switch" validering, tilfellet ' + (e.params.caseIndex) + ' misslykkes';
        break;
      case 'type':
        out = '';
        var t = e.params.type;
        out += 'må være ';
        if (t == "number") {
          out += 'et tall';
        } else if (t == "integer") {
          out += 'et heltall';
        } else if (t == "string") {
          out += 'en streng';
        } else if (t == "boolean") {
          out += 'ja eller nei';
        } else {
          out += (t);
        }
        break;
      case 'uniqueItems':
        out = 'kan ikke ha duplikate elemeneter (elementene ## ' + (e.params.j) + ' og ' + (e.params.i) + ' er identiske)';
        break;
      default:
        continue;
    }
    e.message = out;
  }
};
