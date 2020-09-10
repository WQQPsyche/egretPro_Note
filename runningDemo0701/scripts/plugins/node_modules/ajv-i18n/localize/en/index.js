'use strict';
module.exports = function localize_en(errors) {
  if (!(errors && errors.length)) return;
  for (var i = 0; i < errors.length; i++) {
    var e = errors[i];
    var out;
    switch (e.keyword) {
      case '$ref':
        out = 'can\\\'t resolve reference ' + (e.params.ref);
        break;
      case 'additionalItems':
        out = '';
        var n = e.params.limit;
        out += 'should not have more than ' + (n) + ' item';
        if (n != 1) {
          out += 's';
        }
        break;
      case 'additionalProperties':
        out = 'should not have additional properties';
        break;
      case 'anyOf':
        out = 'should match some schema in "anyOf"';
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
        out += 'should have propert';
        if (n == 1) {
          out += 'y';
        } else {
          out += 'ies';
        }
        out += ' ' + (e.params.deps) + ' when property ' + (e.params.property) + ' is present';
        break;
      case 'enum':
        out = 'should be equal to one of predefined values';
        break;
      case 'exclusiveMaximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'should be ' + (cond);
        break;
      case 'exclusiveMinimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'should be ' + (cond);
        break;
      case 'false schema':
        out = 'boolean schema is false';
        break;
      case 'format':
        out = 'should match format "' + (e.params.format) + '"';
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
        out += 'should be ' + (cond);
        break;
      case 'maxItems':
        out = '';
        var n = e.params.limit;
        out += 'should not have more than ' + (n) + ' item';
        if (n != 1) {
          out += 's';
        }
        break;
      case 'maxLength':
        out = '';
        var n = e.params.limit;
        out += 'should not be longer than ' + (n) + ' character';
        if (n != 1) {
          out += 's';
        }
        break;
      case 'maxProperties':
        out = '';
        var n = e.params.limit;
        out += 'should not have more than ' + (n) + ' propert';
        if (n == 1) {
          out += 'y';
        } else {
          out += 'ies';
        }
        break;
      case 'minimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'should be ' + (cond);
        break;
      case 'minItems':
        out = '';
        var n = e.params.limit;
        out += 'should not have less than ' + (n) + ' item';
        if (n != 1) {
          out += 's';
        }
        break;
      case 'minLength':
        out = '';
        var n = e.params.limit;
        out += 'should not be shorter than ' + (n) + ' character';
        if (n != 1) {
          out += 's';
        }
        break;
      case 'minProperties':
        out = '';
        var n = e.params.limit;
        out += 'should not have less than ' + (n) + ' propert';
        if (n == 1) {
          out += 'y';
        } else {
          out += 'ies';
        }
        break;
      case 'multipleOf':
        out = 'should be a multiple of ' + (e.params.multipleOf);
        break;
      case 'not':
        out = 'should not be valid according to schema in "not"';
        break;
      case 'oneOf':
        out = 'should match exactly one schema in "oneOf"';
        break;
      case 'pattern':
        out = 'should match pattern "' + (e.params.pattern) + '"';
        break;
      case 'patternRequired':
        out = 'should have property matching pattern "' + (e.params.missingPattern) + '"';
        break;
      case 'propertyNames':
        out = 'property name \'' + (e.params.propertyName) + '\' is invalid';
        break;
      case 'required':
        out = 'should have required property ' + (e.params.missingProperty);
        break;
      case 'switch':
        out = 'should pass "switch" keyword validation, case ' + (e.params.caseIndex) + ' fails';
        break;
      case 'type':
        out = 'should be ' + (e.params.type);
        break;
      case 'uniqueItems':
        out = 'should not have duplicate items (items ## ' + (e.params.j) + ' and ' + (e.params.i) + ' are identical)';
        break;
      default:
        continue;
    }
    e.message = out;
  }
};
