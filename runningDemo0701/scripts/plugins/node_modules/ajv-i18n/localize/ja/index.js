'use strict';
module.exports = function localize_ja(errors) {
  if (!(errors && errors.length)) return;
  for (var i = 0; i < errors.length; i++) {
    var e = errors[i];
    var out;
    switch (e.keyword) {
      case '$ref':
        out = '' + (e.params.ref) + 'のスキーマを見つけることができない';
        break;
      case 'additionalItems':
        out = '';
        var n = e.params.limit;
        out += 'は' + (n) + '以上あってはいけない';
        break;
      case 'additionalProperties':
        out = '追加してはいけない';
        break;
      case 'anyOf':
        out = '"anyOf"のスキーマとマッチしなくてはいけない';
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
        out = '' + (e.params.property) + 'がある場合、';
        var n = e.params.depsCount;
        out += 'は' + (e.params.deps) + 'をつけなければいけない';
        break;
      case 'enum':
        out = '事前に定義された値のいずれかに等しくなければいけない';
        break;
      case 'exclusiveMaximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += (cond) + 'でなければいけない';
        break;
      case 'exclusiveMinimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += (cond) + 'でなければいけない';
        break;
      case 'false schema':
        out = 'boolean schema is false';
        break;
      case 'format':
        out = '"' + (e.params.format) + '"形式に揃えなければいけない';
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
        out += (cond) + 'でなければいけない';
        break;
      case 'maxItems':
        out = '';
        var n = e.params.limit;
        out += 'は' + (n) + '個以上であってはいけない';
        break;
      case 'maxLength':
        out = '';
        var n = e.params.limit;
        out += 'は' + (n) + '文字以上であってはいけない';
        break;
      case 'maxProperties':
        out = '';
        var n = e.params.limit;
        out += 'は' + (n) + '個以上のプロパティを有してはいけない';
        break;
      case 'minimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += (cond) + 'でなければいけない';
        break;
      case 'minItems':
        out = '';
        var n = e.params.limit;
        out += 'は' + (n) + '個以下であってはいけない';
        break;
      case 'minLength':
        out = '';
        var n = e.params.limit;
        out += 'は' + (n) + '文字以下であってはいけない';
        break;
      case 'minProperties':
        out = '';
        var n = e.params.limit;
        out += 'は' + (n) + '個以下のプロパティを有してはいけない';
        break;
      case 'multipleOf':
        out = '' + (e.params.multipleOf) + 'の倍数でなければいけない';
        break;
      case 'not':
        out = '"not"のスキーマに従って有効としてはいけない';
        break;
      case 'oneOf':
        out = '"oneOf"のスキーマと完全に一致しなくてはいけない';
        break;
      case 'pattern':
        out = '"' + (e.params.pattern) + '"のパターンと一致しなければいけない';
        break;
      case 'patternRequired':
        out = 'should have property matching pattern "' + (e.params.missingPattern) + '"';
        break;
      case 'propertyNames':
        out = 'property name \'' + (e.params.propertyName) + '\' is invalid';
        break;
      case 'required':
        out = '必要なプロパティ' + (e.params.missingProperty) + 'がなければいけない';
        break;
      case 'switch':
        out = 'should pass "switch" keyword validation, case ' + (e.params.caseIndex) + ' fails';
        break;
      case 'type':
        out = '' + (e.params.type) + 'でなければいけない';
        break;
      case 'uniqueItems':
        out = '重複するアイテムがあってはいけない（' + (e.params.j) + 'と' + (e.params.i) + 'は同じである）';
        break;
      default:
        continue;
    }
    e.message = out;
  }
};
