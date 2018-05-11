/* eslint func-names:"off" */
/* eslint no-case-declarations:"off" */
/* eslint no-console:"off" */
/* eslint no-global-assign:"off" */
/* eslint no-underscore-dangle:"off" */
/* eslint no-unused-expressions:"off" */
/* eslint prefer-rest-params:"off" */

/* global define */

import * as moment from 'moment-timezone';

(function(name, definition) {
  if (typeof define === 'function' && typeof define.amd === 'object') {
    // AMD
    define(definition);
  } else if (typeof module !== 'undefined' && module.exports) {
    // Node
    module.exports = definition();
  } else {
    // Browser
    this[name] = definition;
  }
})('TimezoneMock', () => {
  // Keep reference to original Date object
  const _Date = Date;

  // Number of milliseconds in an hour
  const HOUR = 60 * 1000;

  // Current date/time and timezone
  let timezone = null;
  let now = null;

  // Regular expressions to match constructor strings
  const REGEX = {
    ISO_8601: /^\d\d\d\d(-\d\d(-\d\d(T\d\d:\d\d:\d\d(\.\d\d\d)?Z)?)?)?$/,
    DATE_WITH_OFFSET: /^\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d(\.\d\d\d)? (Z|(-|\+|)\d\d:\d\d)$/,
    RFC_2822: /^\d\d-\w\w\w-\d\d\d\d \d\d:\d\d:\d\d (\+|-)\d\d\d\d$/,
    LOCAL_DATE: /^\d\d\d\d-\d\d-\d\d[T ]\d\d:\d\d:\d\d(\.\d\d\d)?$/,
  };

  const DEBUG = true;

  function isDefined(value) {
    return typeof value !== 'undefined' && value !== undefined;
  }

  // Constructor function
  function TimezoneMock() {
    DEBUG &&
      console.log(
        `**** TimezoneMock:constructor - args: ${JSON.stringify(arguments)}`
      );
    DEBUG && console.log(`**** TimezoneMock:constructor - now: ${now}`);
    DEBUG &&
      console.log(`**** TimezoneMock:constructor - timezone ${timezone}`);
    switch (arguments.length) {
      case 0:
        if (now !== null) {
          DEBUG &&
            console.log(
              `**** TimezoneMock:constructor - using existing date ${now.getTime()}`
            );
          this.date = now;
        } else {
          DEBUG &&
            console.log(`**** TimezoneMock:constructor - creating new date`);
          this.date = new _Date();
        }
        break;
      case 1:
        const param = arguments[0];
        if (param instanceof TimezoneMock) {
          this.date = new _Date(param.date);
        } else if (typeof param === 'string') {
          if (
            param.match(REGEX.ISO_8601) ||
            param.match(REGEX.DATE_WITH_OFFSET) ||
            param.match(REGEX.RFC_2822)
          ) {
            DEBUG &&
              console.log(
                `**** TimezoneMock:constructor - creating date from string ${param}`
              );
            this.date = new _Date(param);
          } else if (param.match(REGEX.LOCAL_DATE)) {
            DEBUG &&
              console.log(
                `**** TimezoneMock:constructor - creating date from local date`
              );
            this.date = new _Date();
            DEBUG &&
              console.log(
                `**** TimezoneMock:constructor - local date created as ${this.date.toISOString()}`
              );
            this.fromLocal(new _Date(`${param.replace(' ', 'T')}Z`));
            DEBUG &&
              console.log(
                `**** TimezoneMock:constructor - local date adjusted to ${this.date.toISOString()}`
              );
          } else {
            throw new TypeError(
              `Unhandled date format ${param} passed to TimezoneMock constructor`
            );
          }
        } else if (typeof param === 'number') {
          DEBUG &&
            console.log(
              `**** TimezoneMock:constructor - creating date from number ${param}`
            );
          this.date = new _Date(param);
        } else {
          throw new TypeError(
            `Unhandled type ${typeof param} passed to TimezoneMock constructor`
          );
        }
        break;
      default:
        DEBUG &&
          console.log(
            `**** TimezoneMock:constructor - creating date from multiple arguments`
          );
        const y = isDefined(arguments[0]) ? arguments[0] : 1970;
        const m = isDefined(arguments[1]) ? arguments[1] : 0;
        const d = isDefined(arguments[2]) ? arguments[2] : 1;
        const h = isDefined(arguments[3]) ? arguments[3] : 0;
        const M = isDefined(arguments[4]) ? arguments[4] : 0;
        const s = isDefined(arguments[5]) ? arguments[5] : 0;
        const ms = isDefined(arguments[6]) ? arguments[6] : 0;
        this.date = new _Date(y, m, d, h, M, s, ms);
        this.fromLocal(new _Date(_Date.UTC.apply(null, arguments)));
    }
  }

  // Returns the timezone offset for any given date/time in the current timezone
  function tzOffset(timestamp) {
    let result;
    if (isDefined(timestamp)) {
      result = moment.tz.zone(timezone).parse(timestamp);
      DEBUG &&
        console.log(
          `**** TimezoneMock:tzOffset - offset for timestamp ${timestamp} in ${timezone} is ${result}`
        );
    } else {
      result = moment.tz.zone(timezone).parse(this.date.getTime());
      DEBUG &&
        console.log(
          `**** TimezoneMock:tzOffset - offset for this.date ${this.date.getTime()} is ${result}`
        );
    }

    return result;
  }

  TimezoneMock.prototype._tzOffset = tzOffset;

  // Construct methods which use the original Date methods
  function passthrough(fn) {
    TimezoneMock.prototype[fn] = function() {
      let realdate;
      if (this instanceof TimezoneMock) {
        realdate = this.date;
      } else if (this instanceof _Date) {
        realdate = this;
      } else {
        throw new TypeError('Unexpected object type');
      }
      return realdate[fn](...arguments);
    };
  }

  // Construct getters which adjust results to take account of local system time
  function localgetter(fn) {
    TimezoneMock.prototype[fn] = function() {
      DEBUG &&
        console.log(
          `**** TimezoneMock.prototype.${fn} - date: ${this.date.getTime()} tzoffset: ${this._tzOffset()}`
        );
      const date = new _Date(
        this.date.getTime() - this._tzOffset(this.date.getTime()) * HOUR
      );
      return date[`getUTC${fn.slice(3)}`]();
    };
  }

  // Adjusts the date to take account of local system time
  TimezoneMock.prototype.fromLocal = function(date) {
    this.date.setTime(
      date.getTime() +
        this._tzOffset(date.getTime() + this._tzOffset(date.getTime()) * HOUR) *
          HOUR
    );
  };

  // Construct setters which adjust results to take account of local system time
  function localsetter(fn) {
    TimezoneMock.prototype[fn] = function() {
      const date = new _Date(this.date.getTime() - this._tzOffset() * HOUR);
      date[`setUTC${fn.slice(3)}`](...arguments);
      this.fromLocal(date);
    };
  }

  [
    'getUTCDate',
    'getUTCDay',
    'getUTCFullYear',
    'getUTCHours',
    'getUTCMilliseconds',
    'getUTCMinutes',
    'getUTCMonth',
    'getUTCSeconds',
    'getTime',
    'getTimezoneOffset',
    'setTime',
    'setUTCDate',
    'setUTCFullYear',
    'setUTCHours',
    'setUTCMilliseconds',
    'setUTCMinutes',
    'setUTCMonth',
    'setUTCSeconds',
    'toGMTString',
    'toISOString',
    'toJSON',
    'toUTCString',
    'valueOf',
  ].forEach(passthrough);
  [
    'getDate',
    'getDay',
    'getFullYear',
    'getHours',
    'getMilliseconds',
    'getMinutes',
    'getMonth',
    'getSeconds',
  ].forEach(localgetter);
  [
    'setDate',
    'setFullYear',
    'setHours',
    'setMilliseconds',
    'setMinutes',
    'setMonth',
    'setSeconds',
  ].forEach(localsetter);

  // TimezoneMock.prototype.getTimezoneOffset =
  //   TimezoneMock.prototype._tzOffset;

  TimezoneMock.prototype.toString = function() {
    if (this instanceof _Date) {
      return _Date.prototype.toString.call(this);
    }
    return this.date ? this.date.toISOString() : null; // TBC - need to add GMT+/-xxxx suffix
  };

  TimezoneMock.prototype.toLocaleString = TimezoneMock.prototype.toString;

  TimezoneMock.now = _Date.now;

  TimezoneMock.UTC = _Date.UTC;

  function set(date, tz = 'Etc/UTC') {
    timezone = isDefined(tz) ? tz : moment.tz.guess();
    if (timezone === null) {
      timezone = 'Etc/UTC';
    }

    Date = TimezoneMock;

    now = new _Date(date);

    DEBUG &&
      console.log(`**** TimezoneMock:set - now: ${now} timezone: ${timezone}`);
  }

  function reset() {
    Date = _Date;
  }

  return { set, reset, _Date };
});
