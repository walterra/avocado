var test = require('tape');
var av = require('../');

test('av.type', function(t) {
  t.doesNotThrow(function() {
    av.type('int');
    av('int');
  });

  t.throws(function() {
    av.type('nonExistingType');
    av('nonExistingType');
  });

  // creating a new type
  t.doesNotThrow(function() {
    av.type('newType', function(d) {
      return d;
    });
    av.type('newType');
    av('newType');
  });

  // creating a type with the same name twice shouldn't work
  t.throws(function() {
    av.type('newType', function(d) {
      return d;
    });
  });

  t.end();
});

test('av.int', function(t) {
  var i;

  var v = 1;
  t.doesNotThrow(function() {
    i = av('int')(v);
  }, 'Initializing integer 1.');
  t.equals(i(), v, 'Integer returns 1.');

  v = 1.1;
  t.throws(function() {
    i = av('int')(v);
  }, 'Initializing integer with float 1.1 throws an error.');

  t.throws(function() {
    i = av('int')('1');
  }, 'Initializing integer with String \'1\' throws an error.');

  t.end();
});

test('av.float', function(t) {
  var i;
  
  var v = 1;
  t.doesNotThrow(function() {
    i = av('float')(v);
  }, 'Initializing float 1.');
  t.equals(i(), v, 'Float returns 1.');

  v = 0.1;
  t.doesNotThrow(function() {
    i = av('float')(v);
  }, 'Initializing float 1.1.');
  t.equals(i(), v, 'Float returns 1.1');

  t.throws(function() {
    i = av('float')('1');
  }, 'Initializing float with String \'1\' throws an error.');

  t.end();
});

test('av.map', function(t) {
  var Weapon;
  var Person;
  var Gandalf;
  
  t.doesNotThrow(function() {
    av.type('weapon', {
      wName: 'string',
      wType: 'string',
      hitPoints: 'int',
      speed: 'int',
      isDrawn: 'boolean'
    });

    Weapon = function(i) {
      var w = av('weapon')(i);

      w.status = function (){
        return 'Weapon Status.';
      };

      return w;
    };
  }, 'Creating Weapon.');

  t.doesNotThrow(function() {
    av.type('person', {
      fullName: 'string',
      age: 'int',
      walk: 'boolean',
      weapon: 'weapon'
    });

    Person = function (i){
      var p = av('person')(i);
      
      p.status = function (){
        return p.fullName() + ', age ' + p.age() + ', ' + ((p.walk()) ? 'is' : 'isn\'t') + ' walking towards Mordor.';
      };
      
      return p;
    };
  }, 'Creating Person.');


  var weaponData = {
    wName: 'Staff of Power',
    wType: 'staff',
    hitPoints: 65,
    speed: 3,
    isDrawn: false
  };

  var gandalfData = {
    fullName: 'Gandalf the Grey',
    age: 2019,
    walk: false,
    weapon: weaponData
  };
  
  t.ok(av.isValid(Weapon, weaponData), 'Check if weaponData is a valid Weapon.');
  t.ok(av.isValid(Person, gandalfData), 'Check if Gandalf is a valid Person.');

  t.doesNotThrow(function() {
    Gandalf = new Person(gandalfData);
  }, 'Initialize Gandalf.');
  
  t.equals(Gandalf.status(), 'Gandalf the Grey, age 2019, isn\'t walking towards Mordor.', 'Check Gandalf\'s status.');

  t.doesNotThrow(function() {
    Gandalf.walk(true);
    Gandalf.fullName('Gandalf the White');
  }, 'Updating Gandalf.');

  t.equals(Gandalf.status(), 'Gandalf the White, age 2019, is walking towards Mordor.', 'Check Gandalf\'s updated status.');
  
  t.deepEqual(Gandalf.weapon(), weaponData, 'Gandalf\'s weapon and the original data are matching.');

  t.notDeepEqual(Gandalf(), gandalfData, 'Gandalf is not matching the original data because he\'s now white and marching towards Mordor.');

  t.end();
});
