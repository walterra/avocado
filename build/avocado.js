(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.avocado = factory());
}(this, (function () { 'use strict';

// av's main function is a getter-setter-combo
// it expects a default value and a validation function
// the validation function should return the validated value or throw an exception
// it shouldn't return 'false' for non-validating values
var av = function (i, validate){
  // we store the value in private scope
  var _i;
  // our getter-setter-combo including validation
  var me = function (d){
    if (!arguments.length) {
      if (typeof _i === 'object'){
        var o= {};
        for (var prop in _i){
          o[prop] = _i[prop]();
        }
        return o;
      } else {
        return _i;
      }
    }
    _i = validate(d);
    // if _i is an object we expose the getter/setter methods of its attributes
    if (typeof _i === 'object'){
      for (var prop_object in _i){
        me[prop_object] = _i[prop_object];
      }
    }
  };
  // we initialize the getter-setter-combo with the provided value
  me(i);
  // return the getter-setter-combo (allows chaining, among other things)
  return me;
};

// isValid allows you to test if a value (v) is a valid type (t)
av.isValid = function (t, v){
  try {
    t(v);
    return true;
  } catch (err) {
    return false;
  }
};

// a boolean type and its validation function
av.boolean = function (i){
  // we return the av-factory which requires an initial value and 
  // the validation function
  return av(i, function (d){
    if (typeof d === 'boolean') {
      return d;
    } else throw 'd is not boolean';
  });
};

// http://stackoverflow.com/a/20779354/2266116
var isInteger = function (nVal){
  return typeof nVal === 'number' && isFinite(nVal) && nVal > -9007199254740992 && nVal < 9007199254740992 && Math.floor(nVal) === nVal;
};

av.int = function (i){
  return av(i, function (d){
    if(!isInteger(d)) {
      throw 'd is not an integer';
    }
    return d;
  });
};

av.float = function (i){
  return av(i, function(d){
    if(typeof d !== 'number') {
      throw 'd is not a number';
    }
    return d;
  });
};

av.string = function (i){
  return av(i, function (d){
    if (typeof d === 'string') {
      return d;
    } else throw 'd is not a string';
  });
};

av.collection = function (i){
  return av(i, function (d){
    if (d && d.constructor === Array) {
      return d;
    } else throw 'not an array';
  });
};

av.map = function (i, o){
  return av(i, function (d){
    if (typeof d === 'object'){
      var _i = {};
      for (var prop in o){
        _i[prop] = o[prop](d[prop]);
      }
      return _i;
    } else throw 'not a valid object';
  });
};

return av;

})));
