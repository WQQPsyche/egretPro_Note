'use strict';
module.exports = function localize_es(errors) {
  if (!(errors && errors.length)) return;
  for (var i = 0; i < errors.length; i++) {
    var e = errors[i];
    var out;
    switch (e.keyword) {
      case '$ref':
        out = 'no se puede resolver la referencia ' + (e.params.ref);
        break;
      case 'additionalItems':
        out = '';
        var n = e.params.limit;
        out += 'no debe tener más de ' + (n) + ' elemento';
        if (n != 1) {
          out += 's';
        }
        break;
      case 'additionalProperties':
        out = 'no debe tener propiedades adicionales';
        break;
      case 'anyOf':
        out = 'debe coincidir con algún esquema en "anyOf"';
        break;
      case 'const':
        out = 'debe ser igual a la constante';
        break;
      case 'contains':
        out = 'should contain a valid item';
        break;
      case 'custom':
        out = 'debe pasar la validación de palabra clave "' + (e.keyword) + '"';
        break;
      case 'dependencies':
        out = '';
        var n = e.params.depsCount;
        out += 'debe contener la';
        if (n != 1) {
          out += 's';
        }
        out += ' propiedad';
        if (n != 1) {
          out += 'es';
        }
        out += ' ' + (e.params.deps) + ' cuando la propiedad ' + (e.params.property) + ' se encuentra presente';
        break;
      case 'enum':
        out = 'deber ser igual a uno de los valores predefinidos';
        break;
      case 'exclusiveMaximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'debe ser ' + (cond);
        break;
      case 'exclusiveMinimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'debe ser ' + (cond);
        break;
      case 'false schema':
        out = 'boolean schema is false';
        break;
      case 'format':
        out = 'debe coincidir con el formato "' + (e.params.format) + '"';
        break;
      case 'formatExclusiveMaximum':
        out = 'formatExclusiveMaximum debe ser booleano';
        break;
      case 'formatExclusiveMinimum':
        out = 'formatExclusiveMinimum debe ser booleano';
        break;
      case 'formatMaximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'debe ser ' + (cond);
        break;
      case 'formatMinimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'debe ser ' + (cond);
        break;
      case 'if':
        out = 'should match "' + (e.params.failingKeyword) + '" schema';
        break;
      case 'maximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'debe ser ' + (cond);
        break;
      case 'maxItems':
        out = '';
        var n = e.params.limit;
        out += 'no debe contener más de ' + (n) + ' elemento';
        if (n != 1) {
          out += 's';
        }
        break;
      case 'maxLength':
        out = '';
        var n = e.params.limit;
        out += 'no debe contener más de ' + (n) + ' caracter';
        if (n != 1) {
          out += 'es';
        }
        break;
      case 'maxProperties':
        out = '';
        var n = e.params.limit;
        out += 'no debe contener más de ' + (n) + ' propiedad';
        if (n != 1) {
          out += 'es';
        }
        break;
      case 'minimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'debe ser ' + (cond);
        break;
      case 'minItems':
        out = '';
        var n = e.params.limit;
        out += 'no debe contener menos de ' + (n) + ' elemento';
        if (n != 1) {
          out += 's';
        }
        break;
      case 'minLength':
        out = '';
        var n = e.params.limit;
        out += 'no debe contener menos de ' + (n) + ' caracter';
        if (n != 1) {
          out += 'es';
        }
        break;
      case 'minProperties':
        out = '';
        var n = e.params.limit;
        out += 'no debe contener menos de ' + (n) + ' propiedad';
        if (n != 1) {
          out += 'es';
        }
        break;
      case 'multipleOf':
        out = 'debe ser múltiplo de ' + (e.params.multipleOf);
        break;
      case 'not':
        out = 'no debe ser válido según el esquema en "not"';
        break;
      case 'oneOf':
        out = 'debe coincidir con un solo esquema en "oneOf"';
        break;
      case 'pattern':
        out = 'debe coincidir con el patron "' + (e.params.pattern) + '"';
        break;
      case 'patternRequired':
        out = 'la propiedad debe coincidir con el patrón "' + (e.params.missingPattern) + '"';
        break;
      case 'propertyNames':
        out = 'property name \'' + (e.params.propertyName) + '\' is invalid';
        break;
      case 'required':
        out = 'debe tener la propiedad requerida ' + (e.params.missingProperty);
        break;
      case 'switch':
        out = 'debe pasar la validación "switch" de palabra clave, el caso ' + (e.params.caseIndex) + ' falló';
        break;
      case 'type':
        out = 'debe ser ' + (e.params.type);
        break;
      case 'uniqueItems':
        out = 'no debe contener elementos duplicados, (los elementos ## ' + (e.params.j) + ' y ' + (e.params.i) + ' son idénticos)';
        break;
      default:
        continue;
    }
    e.message = out;
  }
};
