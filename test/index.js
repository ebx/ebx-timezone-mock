import test from 'tape-catch';

import TimezoneMock from '../src/TimezoneMock';

test('Daylight Savings Time Examples', assert => {
  // Tests for Europe/London GMT (UTC+0000)
  assert.test('> Europe/London GMT', assert => {
    assert.test('> getHours', assert => {
      TimezoneMock.set('2018-02-25T12:34:56.000Z', 'Europe/London');
      const now = new Date();
      // console.log(`>>>> now: ${now.getTime()} ${now.toISOString()}`);
      // console.log(`>>>> getHours: ${now.getHours()}`);
      const actual = now.getHours();
      const expected = 12;
      assert.equal(actual, expected, 'In UTC+0000 => hours should be 12');
      TimezoneMock.reset();
      assert.end();
    });
    assert.test('> getUTCHours', assert => {
      TimezoneMock.set('2018-02-25T12:34:56.000Z', 'Europe/London');
      const now = new Date();
      // console.log(`>>>> now: ${now.getTime()} ${now.toISOString()}`);
      // console.log(`>>>> getUTCHours: ${now.getUTCHours()}`);
      let actual = now.getUTCHours();
      let expected = 12;
      assert.equal(actual, expected, 'UTC hours should be as set');
      actual = now.getUTCMinutes();
      expected = 34;
      assert.equal(actual, expected, 'UTC mins should be as set');
      TimezoneMock.reset();
      assert.end();
    });
  });

  // Tests for Europe/London BST (UTC+0100)
  assert.test('> Europe/London BST', assert => {
    assert.test('> getHours', assert => {
      TimezoneMock.set('2018-04-25T12:34:56.000Z', 'Europe/London');
      const now = new Date();
      // console.log(`>>>> now: ${now.getTime()} ${now.toISOString()}`);
      // console.log(`>>>> getHours: ${now.getHours()}`);
      const actual = now.getHours();
      const expected = 13;
      assert.equal(actual, expected, 'In UTC+0100 => hours should be 13');
      TimezoneMock.reset();
      assert.end();
    });
    assert.test('> getUTCHours', assert => {
      TimezoneMock.set('2018-04-25T12:34:56.000Z', 'Europe/London');
      const now = new Date();
      // console.log(`>>>> now: ${now.getTime()} ${now.toISOString()}`);
      // console.log(`>>>> getUTCHours: ${now.getUTCHours()}`);
      let actual = now.getUTCHours();
      let expected = 12;
      assert.equal(actual, expected, 'UTC hours should be as set');
      actual = now.getUTCMinutes();
      expected = 34;
      assert.equal(actual, expected, 'UTC mins should be as set');
      TimezoneMock.reset();
      assert.end();
    });
  });

  // Tests for Asia/Tehran (UTC+0330)
  assert.test('> Asia/Tehran Standard Time', assert => {
    assert.test('> getHours', assert => {
      TimezoneMock.set('2018-02-25T12:34:56.000Z', 'Asia/Tehran');
      const now = new Date();
      // console.log(`>>>> now: ${now.getTime()} ${now.toISOString()}`);
      // console.log(`>>>> getHours: ${now.getHours()}`);
      let actual = now.getHours();
      let expected = 16;
      assert.equal(actual, expected, 'In UTC+0330 => hours should be 16');
      actual = now.getMinutes();
      expected = 4;
      assert.equal(actual, expected, 'In UTC+0330 => mins should be 04');
      TimezoneMock.reset();
      assert.end();
    });
    assert.test('> getUTCHours', assert => {
      TimezoneMock.set('2018-02-25T12:34:56.000Z', 'Asia/Tehran');
      const now = new Date();
      // console.log(`>>>> now: ${now.getTime()} ${now.toISOString()}`);
      // console.log(`>>>> getUTCHours: ${now.getUTCHours()}`);
      let actual = now.getUTCHours();
      let expected = 12;
      assert.equal(actual, expected, 'UTC hours should be as set');
      actual = now.getUTCMinutes();
      expected = 34;
      assert.equal(actual, expected, 'UTC mins should be as set');
      TimezoneMock.reset();
      assert.end();
    });
  });

  // Tests for Asia/Tehran DST (UTC+0430)
  assert.test('> Asia/Tehran Daylight Savings Time', assert => {
    assert.test('> getHours', assert => {
      TimezoneMock.set('2018-04-25T12:34:56.000Z', 'Asia/Tehran');
      const now = new Date();
      // console.log(`>>>> now: ${now.getTime()} ${now.toISOString()}`);
      // console.log(`>>>> getHours: ${now.getHours()}`);
      let actual = now.getHours();
      let expected = 17;
      assert.equal(actual, expected, 'In UTC+0430 => hours should be 17');
      actual = now.getMinutes();
      expected = 4;
      assert.equal(actual, expected, 'In UTC+0430 => mins should be 04');
      TimezoneMock.reset();
      assert.end();
    });
    assert.test('> getUTCHours', assert => {
      TimezoneMock.set('2018-04-25T12:34:56.000Z', 'Asia/Tehran');
      const now = new Date();
      // console.log(`>>>> now: ${now.getTime()} ${now.toISOString()}`);
      // console.log(`>>>> getUTCHours: ${now.getUTCHours()}`);
      let actual = now.getUTCHours();
      let expected = 12;
      assert.equal(actual, expected, 'UTC hours should be as set');
      actual = now.getUTCMinutes();
      expected = 34;
      assert.equal(actual, expected, 'UTC mins should be as set');
      TimezoneMock.reset();
      assert.end();
    });
  });
});
