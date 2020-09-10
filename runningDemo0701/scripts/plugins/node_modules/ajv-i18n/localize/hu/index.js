'use strict';
module.exports = function localize_hu(errors) {
  if (!(errors && errors.length)) return;
  for (var i = 0; i < errors.length; i++) {
    var e = errors[i];
    var out;
    switch (e.keyword) {
      case '$ref':
        out = 'nem sikerült feloldani a hivatkozást ' + (e.params.ref);
        break;
      case 'additionalItems':
        out = '';
        var n = e.params.limit;
        out += 'nem lehet több, mint ' + (n) + ' eleme';
        break;
      case 'additionalProperties':
        out = 'nem lehetnek további elemei';
        break;
      case 'anyOf':
        out = 'meg kell feleljen legalább egy "anyOf" alaknak';
        break;
      case 'const':
        out = 'should be equal to constant';
        break;
      case 'contains':
        out = 'should contain a valid item';
        break;
      case 'custom':
        out = 'should pass "' + (e.keyword) + '" keyword validation';
        break;
      case 'dependencies':
        out = '';
        var n = e.params.depsCount;
        out += '-nak kell legyen';
        if (n > 1) {
          out += 'ek';
        }
        out += ' a következő tulajdonsága';
        if (n != 1) {
          out += 'i';
        }
        out += ': ' + (e.params.deps) + ', ha van ' + (e.params.property) + ' tulajdonsága';
        break;
      case 'enum':
        out = 'egyenlő kell legyen valamely előre meghatározott értékkel';
        break;
      case 'exclusiveMaximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'kell legyen ' + (cond);
        break;
      case 'exclusiveMinimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'kell legyen ' + (cond);
        break;
      case 'false schema':
        out = 'boolean schema is false';
        break;
      case 'format':
        out = 'meg kell feleljen a következő formátumnak: "' + (e.params.format) + '"';
        break;
      case 'formatExclusiveMaximum':
        out = 'formatExclusiveMaximum should be boolean';
        break;
      case 'formatExclusiveMinimum':
        out = 'formatExclusiveMinimum should be boolean';
        break;
      case 'formatMaximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'should be ' + (cond);
        break;
      case 'formatMinimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'should be ' + (cond);
        break;
      case 'if':
        out = 'should match "' + (e.params.failingKeyword) + '" schema';
        break;
      case 'maximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'kell legyen ' + (cond);
        break;
      case 'maxItems':
        out = '';
        var n = e.params.limit;
        out += 'nem lehet több, mint ' + (n) + ' eleme';
        break;
      case 'maxLength':
        out = '';
        var n = e.params.limit;
        out += 'nem lehet hosszabb, mint ' + (n) + ' szimbólum';
        break;
      case 'maxProperties':
        out = '';
        var n = e.params.limit;
        out += 'nem lehet több, mint ' + (n) + ' tulajdonsága';
        break;
      case 'minimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'kell legyen ' + (cond);
        break;
      case 'minItems':
        out = '';
        var n = e.params.limit;
        out += 'nem lehet kevesebb, mint ' + (n) + ' eleme';
        break;
      case 'minLength':
        out = '';
        var n = e.params.limit;
        out += 'nem lehet rövidebb, mint ' + (n) + ' szimbólum';
        break;
      case 'minProperties':
        out = '';
        var n = e.params.limit;
        out += 'nem lehet kevesebb, mint ' + (n) + ' tulajdonsága';
        break;
      case 'multipleOf':
        out = 'a többszöröse kell legyen a következő számnak: ' + (e.params.multipleOf);
        break;
      case 'not':
        out = 'nem lehet érvényes a "not" alaknak megfelelően';
        break;
      case 'oneOf':
        out = 'meg kell feleljen pontosan egy "anyOf" alaknak';
        break;
      case 'pattern':
        out = 'meg kell feleljen a következő mintának: "' + (e.params.pattern) + '"';
        break;
      case 'patternRequired':
        out = 'should have property matching pattern "' + (e.params.missingPattern) + '"';
        break;
      case 'propertyNames':
        out = 'property name \'' + (e.params.propertyName) + '\' is invalid';
        break;
      case 'required':
        out = 'kell legyen ' + (e.params.missingProperty) + ' tulajdonsága';
        break;
      case 'switch':
        out = 'should pass "switch" keyword validation, case ' + (e.params.caseIndex) + ' fails';
        break;
      case 'type':
        out = '' + (e.params.type) + ' kell legyen';
        break;
      case 'uniqueItems':
        out = 'nem lehetnek azonos elemei (' + (e.params.j) + ' és ' + (e.params.i) + ' elemek azonosak)';
        break;
      default:
        continue;
    }
    e.message = out;
  }
};
