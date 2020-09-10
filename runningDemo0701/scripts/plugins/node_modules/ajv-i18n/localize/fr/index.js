'use strict';
module.exports = function localize_fr(errors) {
  if (!(errors && errors.length)) return;
  for (var i = 0; i < errors.length; i++) {
    var e = errors[i];
    var out;
    switch (e.keyword) {
      case '$ref':
        out = 'impossible d\\\'accéder à la référénce ' + (e.params.ref);
        break;
      case 'additionalItems':
        out = '';
        var n = e.params.limit;
        out += 'ne doit pas contenir plus de ' + (n) + ' élémént';
        if (n != 1) {
          out += 's';
        }
        break;
      case 'additionalProperties':
        out = 'ne doit pas contenir de propriétés additionnelles';
        break;
      case 'anyOf':
        out = 'doit correspondre à un schéma de "anyOf"';
        break;
      case 'const':
        out = 'doit être égal à la constante';
        break;
      case 'contains':
        out = 'doit contenir un élément valide';
        break;
      case 'custom':
        out = 'doit être valide selon le critère "' + (e.keyword) + '"';
        break;
      case 'dependencies':
        out = '';
        var n = e.params.depsCount;
        out += 'doit avoir la propriété ' + (e.params.deps) + ' quand la propriété ' + (e.params.property) + ' est présente';
        break;
      case 'enum':
        out = 'doit être égal à une des valeurs prédéfinies';
        break;
      case 'exclusiveMaximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'doit être ' + (cond);
        break;
      case 'exclusiveMinimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'doit être ' + (cond);
        break;
      case 'false schema':
        out = 'le schema est "false"';
        break;
      case 'format':
        out = 'doit correspondre au format "' + (e.params.format) + '"';
        break;
      case 'formatExclusiveMaximum':
        out = 'formatExclusiveMaximum doit être un booléen';
        break;
      case 'formatExclusiveMinimum':
        out = 'formatExclusiveMinimum doit être un booléen';
        break;
      case 'formatMaximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'doit être ' + (cond);
        break;
      case 'formatMinimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'doit être ' + (cond);
        break;
      case 'if':
        out = 'should match "' + (e.params.failingKeyword) + '" schema';
        break;
      case 'maximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'doit être ' + (cond);
        break;
      case 'maxItems':
        out = '';
        var n = e.params.limit;
        out += 'ne doit pas contenir plus de ' + (n) + ' élément';
        if (n != 1) {
          out += 's';
        }
        break;
      case 'maxLength':
        out = '';
        var n = e.params.limit;
        out += 'ne doit pas dépasser ' + (n) + ' caractère';
        if (n != 1) {
          out += 's';
        }
        break;
      case 'maxProperties':
        out = '';
        var n = e.params.limit;
        out += 'ne doit pas contenir plus de ' + (n) + ' propriété';
        if (n != 1) {
          out += 's';
        }
        break;
      case 'minimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'doit être ' + (cond);
        break;
      case 'minItems':
        out = '';
        var n = e.params.limit;
        out += 'ne doit pas contenir moins de ' + (n) + ' élément';
        if (n != 1) {
          out += 's';
        }
        break;
      case 'minLength':
        out = '';
        var n = e.params.limit;
        out += 'ne doit pas faire moins de ' + (n) + ' caractère';
        if (n != 1) {
          out += 's';
        }
        break;
      case 'minProperties':
        out = '';
        var n = e.params.limit;
        out += 'ne doit pas contenir moins de ' + (n) + ' propriété';
        if (n != 1) {
          out += 's';
        }
        break;
      case 'multipleOf':
        out = 'doit être un multiple de ' + (e.params.multipleOf);
        break;
      case 'not':
        out = 'est invalide selon le schéma "not"';
        break;
      case 'oneOf':
        out = 'doit correspondre à exactement un schéma de "oneOf"';
        break;
      case 'pattern':
        out = 'doit correspondre au format "' + (e.params.pattern) + '"';
        break;
      case 'patternRequired':
        out = 'la propriété doit correspondre au format "' + (e.params.missingPattern) + '"';
        break;
      case 'propertyNames':
        out = 'le nom de propriété \'' + (e.params.propertyName) + '\' est invalide';
        break;
      case 'required':
        out = 'requiert la propriété ' + (e.params.missingProperty);
        break;
      case 'switch':
        out = 'doit être valide selon le critère "switch":validation par mot-clé, le cas ' + (e.params.caseIndex) + ' est invalide';
        break;
      case 'type':
        out = 'doit être de type ' + (e.params.type);
        break;
      case 'uniqueItems':
        out = 'ne doit pas contenir de doublons (les éléments ## ' + (e.params.j) + ' et ' + (e.params.i) + ' sont identiques)';
        break;
      default:
        continue;
    }
    e.message = out;
  }
};
