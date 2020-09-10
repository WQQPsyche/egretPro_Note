'use strict';
module.exports = function localize_ar(errors) {
  if (!(errors && errors.length)) return;
  for (var i = 0; i < errors.length; i++) {
    var e = errors[i];
    var out;
    switch (e.keyword) {
      case '$ref':
        out = 'لا يمكن العثور على المرجع ' + (e.params.ref);
        break;
      case 'additionalItems':
        out = '';
        var n = e.params.limit;
        out += ' يجب أن لا يحوي أكثر من ' + (n) + ' عنصر';
        break;
      case 'additionalProperties':
        out = 'يجب أن لا يحوي خصائص إضافية';
        break;
      case 'anyOf':
        out = 'يجب أن يوافق أحد المخططات الموجودة في "anyOf"';
        break;
      case 'const':
        out = 'يجب أن يكون ثابتاً';
        break;
      case 'contains':
        out = 'يجب أن يحوي عنصرا صحيح';
        break;
      case 'custom':
        out = 'يجب أن تمرر كلمة التحقق المفتاحية "' + (e.keyword) + '"';
        break;
      case 'dependencies':
        out = '';
        var n = e.params.depsCount;
        out += ' يجب أن يحوي الخصائص ' + (e.params.deps) + ' عندما تكون الخاصية ' + (e.params.property) + ' موجودة';
        break;
      case 'enum':
        out = 'قيمة هذا الحقل يجب أن تكون مساوية لأحد القيم المعرفة مسبقاً';
        break;
      case 'exclusiveMaximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += ' يجب أن يكون ' + (cond);
        break;
      case 'exclusiveMinimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += ' يجب أن يكون ' + (cond);
        break;
      case 'false schema':
        out = 'المخطط المنطقي غير صحيح';
        break;
      case 'format':
        out = 'يجب أن يوافق الصيغة "' + (e.params.format) + '"';
        break;
      case 'formatExclusiveMaximum':
        out = 'formatExclusiveMaximum يجب أن يكون منطقياً';
        break;
      case 'formatExclusiveMinimum':
        out = 'formatExclusiveMinimum يجب أن يكون منطقياً';
        break;
      case 'formatMaximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += ' يجب أن يكون ' + (cond);
        break;
      case 'formatMinimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += ' يجب أن يكون ' + (cond);
        break;
      case 'if':
        out = 'يجب أن توافق المخطط "' + (e.params.failingKeyword) + '"';
        break;
      case 'maximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += ' يجب أن يكون ' + (cond);
        break;
      case 'maxItems':
        out = '';
        var n = e.params.limit;
        out += ' يجب أن لا يحوي أكثر من ' + (n) + ' عنصر';
        break;
      case 'maxLength':
        out = '';
        var n = e.params.limit;
        out += ' يجب أن لا يحوي أكثر من ' + (n) + ' محرف';
        break;
      case 'maxProperties':
        out = '';
        var n = e.params.limit;
        out += ' يجب أن لا يحوي أكثر من ' + (n) + ' خصائص';
        break;
      case 'minimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += ' يجب أن يكون ' + (cond);
        break;
      case 'minItems':
        out = '';
        var n = e.params.limit;
        out += ' يجب أن لا يحوي أقل من ' + (n) + ' عنصر';
        break;
      case 'minLength':
        out = '';
        var n = e.params.limit;
        out += ' يجب أن لا يحوي أقل من ' + (n) + ' محرف';
        break;
      case 'minProperties':
        out = '';
        var n = e.params.limit;
        out += ' يجب أن لا يحوي أقل من ' + (n) + ' خصائص';
        break;
      case 'multipleOf':
        out = ' يجب أن يحوي أكثر من ' + (e.params.multipleOf);
        break;
      case 'not':
        out = 'يجب أن يكون غير صحيح وفقاً للمخطط "not"';
        break;
      case 'oneOf':
        out = 'يجب أن يوافق مخطط واحد فقط موجود في "oneOf"';
        break;
      case 'pattern':
        out = 'يجب أن يوافق النمط "' + (e.params.pattern) + '"';
        break;
      case 'patternRequired':
        out = 'يجب أن يحوي خاصية توافق النمط "' + (e.params.missingPattern) + '"';
        break;
      case 'propertyNames':
        out = 'اسم الخاصية \'' + (e.params.propertyName) + '\' غير صالح';
        break;
      case 'required':
        out = 'هذا الحقل إلزامي';
        break;
      case 'switch':
        out = 'يجب أن تمرر كلمة التحقق المفتاحية "switch"، الحالة ' + (e.params.caseIndex) + '  خاطئة';
        break;
      case 'type':
        out = 'قيمة هذا الحقل غير صالحة';
        break;
      case 'uniqueItems':
        out = 'يجب أن لا يحوي عناصر مكررة (العنصر ## ' + (e.params.j) + ' و ' + (e.params.i) + ' متطابقة)';
        break;
      default:
        continue;
    }
    e.message = out;
  }
};
