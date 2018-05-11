# ebx-timezone-mock

A JavaScript library which mocks the `Date` object and lets you specify a local date/time/timezone in order to enable consistent testing of date/time-related code independently of your local system time settings.

It works by monkey patching the `Date` object and returning results which are adjusted to reflect the effects of both the specified current date/time/timezone (if any) and the current date/time/timezone. In particular, it avoids problems caused by certain JavaScript date/time methods e.g. `getHours` returning results in the user's local system time, so you can write date/time-related unit tests which will work whenever and wherever they are run, without changing timezones causing results to change.

## Installation

### NPM

```sh
$ npm install ebx-timezone-mock
```

## Usage

### Configuration

```js
import TimezoneMock from 'TimezoneMock';

TimezoneMock.set('2018-04-25T12:34:56.000Z');

console.log(new Date()); // Wed Apr 25 2018 12:34:56 GMT+0000 (GMT Standard Time)

TimezoneMock.reset();

console.log(new Date()); // Current system date/time/timezone
```

## Credits

The majority of the code for this project was taken from the [timezone-mock](https://github.com/Jimbly/timezone-mock) project by Jimb Esser,
with some additional code from the [MockDate](https://github.com/boblauer/MockDate) project by Bob Lauer. My contribution has been limited
to gluing these two projects together, and introduction [moment-timezone](https://github.com/moment/moment-timezone/) to solve the problem
of working out the timezone offset for any given date, time and place.
