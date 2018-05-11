import test from 'tape-catch';
import * as moment from 'moment-timezone';

import TimezoneMock from '../src/TimezoneMock';

test('Constructors', assert => {
  // Test date constructors as used by local timezone mode in node-mysql (local strings)
  let test_str = '2015-01-01 01:23:45.678';
  TimezoneMock.set(new Date().getTime(), 'UTC');
  let actual = new Date(test_str).getTime();
  let expected = 1420104225678 - 8 * 60 * 60 * 1000;
  assert.equal(actual, expected);
  actual = new Date(2015, 0, 1, 1, 23, 45, 678).getTime();
  expected = 1420104225678 - 8 * 60 * 60 * 1000;
  assert.equal(actual, expected);

  TimezoneMock.set(new Date().getTime(), 'America/Los_Angeles');
  actual = new Date(test_str).getTime();
  expected = 1420104225678;
  assert.equal(actual, expected);
  actual = new Date(2015, 0, 1, 1, 23, 45, 678).getTime();
  expected = 1420104225678;
  assert.equal(actual, expected);
  TimezoneMock.set(new Date().getTime(), 'America/New_York');
  actual = new Date(test_str).getTime();
  expected = 1420104225678 - 3 * 60 * 60 * 1000;
  assert.equal(actual, expected);
  actual = new Date(2015, 0, 1, 1, 23, 45, 678).getTime();
  expected = 1420104225678 - 3 * 60 * 60 * 1000;
  assert.equal(actual, expected);

  TimezoneMock.set(new Date().getTime(), 'America/Los_Angeles');
  test_str = '2015-03-08 01:30:00.000'; // right before entering PDT
  actual = new Date(test_str).getTime();
  expected = 1425807000000;
  assert.equal(actual, expected, '**** FAILS ****');
  actual = new Date(test_str).valueOf();
  expected = new Date(test_str).getTime();
  assert.equal(actual, expected);
  actual = new Date(2015, 2, 8, 1, 30, 0, 0).getTime();
  expected = 1425807000000;
  assert.equal(actual, expected, '**** FAILS ****');
  test_str = '2015-03-08 02:30:00.000'; // doesn't exist, ends up 1:30am
  actual = new Date(test_str).getTime();
  expected = 1425807000000;
  assert.equal(actual, expected);
  actual = new Date(2015, 2, 8, 2, 30, 0, 0).getTime();
  expected = 1425807000000;
  assert.equal(actual, expected);
  test_str = '2015-03-08 03:30:00.000'; // in PDT
  actual = new Date(test_str).getTime();
  expected = 1425810600000;
  assert.equal(actual, expected);
  actual = new Date(2015, 2, 8, 3, 30, 0, 0).getTime();
  expected = 1425810600000;
  assert.equal(actual, expected);
  // leaving PDT, JS Date returns 1am PDT, not 1am PST
  // JE: 2017-05-26, Node 6.9.1, Not sure why this was 1am PST before, no changes
  //   to node should have changed how our mock behaves, yet, the mock is still
  //   behaving the same as node, just they are both returning a different value
  //   than the test previously expected, so, updating the test to reflect this.
  test_str = '2014-11-02 01:00:00.000';
  actual = new Date(test_str).getTime();
  expected = 1414915200000;
  assert.equal(actual, expected, '**** FAILS ****');
  actual = new Date(2014, 10, 2, 1, 0, 0, 0).getTime();
  expected = 1414915200000;
  assert.equal(actual, expected, '**** FAILS ****');

  // Testing "local" constructors that look like UTC constructors,
  //   This behavior changed on Node v8.0.0
  actual = new Date('2015-01-01T01:23:45.678').getTime();
  expected = 1420104225678;
  assert.equal(actual, expected);
  actual = new Date('2015-01-01T01:23:45').getTime();
  expected = 1420104225000;
  assert.equal(actual, expected);

  //////////////////////////////////////////////////////////////////////////
  // Test UTC/non-local timezone constructors
  actual = new Date('2017-05-26T17:52:35.869Z').getTime();
  expected = 1495821155869;
  assert.equal(actual, expected);
  actual = new Date('2017-05-26 17:52:35.869 Z').getTime();
  expected = 1495821155869;
  assert.equal(actual, expected);
  actual = new Date('2017-05-26 17:52:35.869 -00:00').getTime();
  expected = 1495821155869;
  assert.equal(actual, expected);
  actual = new Date('2017-05-26 17:52:35.869 +00:00').getTime();
  expected = 1495821155869;
  assert.equal(actual, expected);
  actual = new Date('2017-05-26 18:52:35.869 +01:00').getTime();
  expected = 1495821155869;
  assert.equal(actual, expected);
  actual = new Date('2017-05-26 10:52:35.869 -07:00').getTime();
  expected = 1495821155869;
  assert.equal(actual, expected);
  actual = new Date('2017-05-26 17:52:35 +00:00').getTime();
  expected = 1495821155000;
  assert.equal(actual, expected);
  actual = new Date('2017-05-26 10:52:35 -07:00').getTime();
  expected = 1495821155000;
  assert.equal(actual, expected);

  //////////////////////////////////////////////////////////////////////////
  // Test some generic properties about the date object
  actual = new Date(2017, 5, 1, 0, 0, 0, 0).getTime();
  expected = new Date(2017, 5).getTime();
  assert.equal(actual, expected);

  //////////////////////////////////////////////////////////////////////////
  // Test Brazil timezone oddities
  TimezoneMock.set(new Date().getTime(), 'America/Sao_Paulo');
  test_str = '2017-10-15 00:00:00.000'; // Midnight on this day doesn't exist, jumps to 11PM previous day
  actual = new Date(test_str).getTime();
  expected = 1508032800000;
  assert.equal(actual, expected);
  actual = new Date(2017, 9, 15, 0, 0, 0, 0).getTime();
  expected = 1508032800000;
  assert.equal(actual, expected);

  TimezoneMock.reset();
  assert.end();
});
