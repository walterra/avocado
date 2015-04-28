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
      for (var prop in _i){
        me[prop] = _i[prop];
      }
    }
  }
  // we initialize the getter-setter-combo with the provided value
  me(i);
  // return the getter-setter-combo (allows chaining, among other things)
  return me;
};

// a boolean type and its validation function
av.boolean = function (i){
  // we return the av-factory which requires an initial value and 
  // the validation function
  return av(i, function (d){
    if (typeof d === 'boolean') {
      return d;
    } else throw "d is not boolean";
  });
}

av.int = function (i){
  return av(i, function (d){
    if(typeof d !== 'number'){
      throw "d is not a number";
    }

    if(d % 1 !== 0){
      throw "d is not an integer";
    }
    
    return d;
  });
};

av.string = function (i){
  return av(i, function (d){
    if (typeof d === 'string') {
      return d;
    } else throw "d is not a string";
  });
};

av.collection = function (i){
  return av(i, function (d){
    if (d && d.constructor === Array) {
      return d;
    } else throw "not an array";
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
    } else throw "not a valid object";
  });
};

