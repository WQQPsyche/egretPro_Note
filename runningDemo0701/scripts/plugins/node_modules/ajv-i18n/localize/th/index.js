'use strict';
module.exports = function localize_th(errors) {
  if (!(errors && errors.length)) return;
  for (var i = 0; i < errors.length; i++) {
    var e = errors[i];
    var out;
    switch (e.keyword) {
      case '$ref':
        out = 'ไม่สามารถหา reference ' + (e.params.ref);
        break;
      case 'additionalItems':
        out = '';
        var n = e.params.limit;
        out += 'ควรมีสมาชิกไม่เกิน ' + (n);
        break;
      case 'additionalProperties':
        out = 'ไม่ควรมี property เกินที่กำหนดไว้';
        break;
      case 'anyOf':
        out = 'ควรมี schema บางอย่างตรงกับที่กำหนดไว้ใน "anyOf"';
        break;
      case 'const':
        out = 'ควรมีค่าเหมือนกับค่าคงที่';
        break;
      case 'contains':
        out = 'ควรมีสมาชิกที่ถูกต้องอยู่';
        break;
      case 'custom':
        out = 'ควรผ่านคีย์เวิร์ด "' + (e.keyword) + '"';
        break;
      case 'dependencies':
        out = '';
        var n = e.params.depsCount;
        out += 'เมื่อมี property ' + (e.params.property) + ' แล้วก็ควรมี property ' + (e.params.deps) + ' ด้วย';
        break;
      case 'enum':
        out = 'ควรตรงกับค่าที่กำหนดไว้';
        break;
      case 'exclusiveMaximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'ควร ' + (cond);
        break;
      case 'exclusiveMinimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'ควร ' + (cond);
        break;
      case 'false schema':
        out = 'schema เป็น false';
        break;
      case 'format':
        out = 'ควรมีรูปแบบเป็น "' + (e.params.format) + '"';
        break;
      case 'formatExclusiveMaximum':
        out = 'formatExclusiveMaximum ควรเป็น boolean';
        break;
      case 'formatExclusiveMinimum':
        out = 'formatExclusiveMinimum ควรเป็น boolean';
        break;
      case 'formatMaximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'ควร ' + (cond);
        break;
      case 'formatMinimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'ควร ' + (cond);
        break;
      case 'if':
        out = 'ควรตรงกับ schema "' + (e.params.failingKeyword) + '"';
        break;
      case 'maximum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'ควร ' + (cond);
        break;
      case 'maxItems':
        out = '';
        var n = e.params.limit;
        out += 'ควรมีสมาชิกไม่เกิน ' + (n);
        break;
      case 'maxLength':
        out = '';
        var n = e.params.limit;
        out += 'ไม่ควรมากกว่า ' + (n) + ' ตัวอักษร';
        break;
      case 'maxProperties':
        out = '';
        var n = e.params.limit;
        out += 'ไม่ควรมี property เกิน ' + (n);
        break;
      case 'minimum':
        out = '';
        var cond = e.params.comparison + " " + e.params.limit;
        out += 'ควร ' + (cond);
        break;
      case 'minItems':
        out = '';
        var n = e.params.limit;
        out += 'ควรมีสมาชิกไม่น้อยกว่า ' + (n);
        break;
      case 'minLength':
        out = '';
        var n = e.params.limit;
        out += 'ไม่ควรน้อยกว่า ' + (n) + ' ตัวอักษร';
        break;
      case 'minProperties':
        out = '';
        var n = e.params.limit;
        out += 'ไม่ควรมี property น้อยกว่า ' + (n);
        break;
      case 'multipleOf':
        out = 'ควรเป็นเลขที่หาร ' + (e.params.multipleOf) + ' ลงตัว';
        break;
      case 'not':
        out = 'ไม่ควรถูกต้องตาม schema ที่กำหนดไว้ใน "not"';
        break;
      case 'oneOf':
        out = 'ควรตรงกับเพียง schema เดียวใน "oneOf" เท่านั้น';
        break;
      case 'pattern':
        out = 'ควรตรงกับแพทเทิร์น "' + (e.params.pattern) + '"';
        break;
      case 'patternRequired':
        out = 'ควรมี property ที่มีชื่อตรงกับ pattern "' + (e.params.missingPattern) + '"';
        break;
      case 'propertyNames':
        out = 'property \'' + (e.params.propertyName) + '\' ไม่ถูกต้อง';
        break;
      case 'required':
        out = 'ควรมี property ' + (e.params.missingProperty) + ' ที่บังคับไว้';
        break;
      case 'switch':
        out = 'ควรผ่านคีย์เวิร์ด "switch", ผิดเคสที่ ' + (e.params.caseIndex);
        break;
      case 'type':
        out = 'ควรเป็น ' + (e.params.type);
        break;
      case 'uniqueItems':
        out = 'ไม่ควรมีสมาชิกซ้ำักัน (ลำดับที่ ' + (e.params.j) + ' และ ' + (e.params.i) + ' ซ้ำ)';
        break;
      default:
        continue;
    }
    e.message = out;
  }
};
