// importing with relative path so it gets included in the final build
import { default as _findIndex } from '../node_modules/lodash-es/findIndex';

var types = [];

// av's main function is a getter-setter-combo
// it expects a default value and a validation function
// the validation function should return the validated value or throw an exception
// it shouldn't return 'false' for non-validating values
var av = function (i, validate){
  // we offer a shortcut to get types when only one argument is provided
  if (arguments.length === 1) {
    return av.type(i);
  }

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

av.type = function() {
  var typeIndex;
  var typeName;
  var typeData;

  if (arguments.length === 0) {
    throw new Error('av.type requires at least one argument.');
  }

  typeName = arguments[0];
  typeIndex = _findIndex(types, { typeName: typeName });

  // get a type by name
  if (arguments.length === 1) {
    if (typeIndex === -1) {
      throw new Error('type not found');
    }
    return types[typeIndex].type;
  // set a type by name
  } else if (arguments.length === 2) {
    typeData = arguments[1];
    if (typeIndex !== -1) {
      throw new Error('type specification already exists.');
    }
    if (typeof typeData === 'function') {
      types.push({
        typeName: typeName,
        type: function(i) {
          return av(i, typeData);
        }
      });
    } else if (typeof typeData === 'object') {
      types.push({
        typeName: typeName,
        type: function(i) {
          return av(i, function(d) {
            if (typeof d === 'object'){
              var _i = {};
              for (var prop in typeData){
                _i[prop] = av.type(typeData[prop])(d[prop]);
              }
              return _i;
            } else throw 'not a valid object';
          });
        }
      });
    } else {
      throw new Error('argument 2 typeData must be either a function or object.');
    }

    return av;
  }

  throw new Error('invalid amount of arguments for av.type()');
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
av.type('boolean', function (d){
  if (typeof d === 'boolean') {
    return d;
  } else throw new Error('d is not boolean');
});

// http://stackoverflow.com/a/20779354/2266116
var isInteger = function (nVal){
  return typeof nVal === 'number' && isFinite(nVal) && nVal > -9007199254740992 && nVal < 9007199254740992 && Math.floor(nVal) === nVal;
};

av.type('int', function(d) {
  if(!isInteger(d)) {
    throw new Error('d is not an integer');
  }
  return d;
});

av.type('float', function(d){
  if(typeof d !== 'number') {
    throw 'd is not a number';
  }
  return d;
});

av.type('string', function (d){
  if (typeof d === 'string') {
    return d;
  } else throw 'd is not a string';
});

av.type('collection', function (d){
  if (d && d.constructor === Array) {
    return d;
  } else throw 'not an array';
});

av.type('map', function (d){
  if (typeof d === 'object'){
    var _i = {};
    for (var prop in o){
      _i[prop] = o[prop](d[prop]);
    }
    return _i;
  } else throw 'not a valid object';
});

export default av;

