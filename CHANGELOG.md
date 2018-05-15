# Changelog

## Pending

**Bugs:**

* Fix (if necessary) a handful of failing tests - at the moment it isn't clear
  whether these are bugs in this project or in the moment-timezone data

**Environment:**

* Build (compile) using Gulp / Babel
* Implement CI via Travis

## 1.1.4

**Changes:**

* Compiled TimezoneMock.js - mental note, this stuff really needs automating...

## 1.1.3

**Changes:**

* Added `return this` to constructor and all setter methods to allow chaining
  of date methods e.g. `const date = new Date().setYear(2018).setMonth(0);`

## 1.1.2

**Fixes:**

* Switched off DEBUG mode

## 1.1.1

**Fixes:**

* Added compiled version of TimezoneMock.js to root folder
* Updated "main" entry in package.json accordingly

## 1.1.0

**Enhancements:**

* Allow current date/time and timezone to be set
* Use moment-timezone to get timezone offsets for any date/time/timezone

**Environment:**

* Linting implemented using ESLint using Airbnb coding standards
* Formatting implemented using Prettier
