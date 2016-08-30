# Baby Connect Project
This repository contains one part of a multi-part project to enable the
automation of adding data to the [Baby Connect](https://www.baby-connect.com)
service.

The flow is:

- User presses an AWS IoT Button.
- The IoT Button triggers an AWS Lambda function
([baby-connect-lambda](https://github.com/platta/baby-connect-lambda)).
- The Lambda function sends a message to an AWS SQS message queue.
- A Raspberry Pi running a listener
([baby-connect-sqs-listener](https://github.com/platta/baby-connect-sqs-listener))
receives the message from the message queue.
- The listener uses a library
(__baby-connect__) to log into the Baby
Connect web site and add the data.

Since Baby Connect doesn't expose an API, the
([baby-connect](https://github.com/platta/baby-connect)) library uses browser
automation. This requires launching chromium as a child process which is not
supported in Lambda and is the reason we use a message queue with a standalone
listener application.

# baby-connect
A Node.js module to create a simple API for the baby-connect web site

This module was inspired by the
[baby-connect-nightmare](https://github.com/jpchip/baby-connect-nightmare)
repository.

## A note on longevity
Since this module uses the [Nightmare](http://www.nightmarejs.org/) library to
perform browser automation as its means of interacting with Baby Connect, any
changes that are made to the Baby Connect web site down the line may render this
module useless.

## Motivation
Many people love playing with software and technology. Many of these people have
children and track their child's activities using
[Baby Connect](https://www.baby-connect.com). This module provides a
programmatic interface to some of the operations available on Baby Connect.

My specific reason for creating the module was to set up an AWS IoT button to
record wet diapers when pressed.

## Installation

```bashp
npm install git+https://github.com/platta/baby-connect.git
```

## Example

```js
var babyConnect = require('baby-connect');

babyConnect.initialize('email', 'password', function(error, bc) {
    if (error) {
        console.log('Error initializing.');
    } else {
        bc.diaper({
            child: 'Child Name'
        }, function(error) {
            if (error) {
                console.log('Error recording diaper.');
            }
        })
    }
});
```

## Usage

### Initializing the object
The initialize method allows the caller to specify the e-mail address and
password of the account being used. It also logs into the site and retrieves a
list containing the Ids of each child. This is used for lookups when processing
other function calls.

```js
var babyConnect = require('baby-connect');

babyConnect.initialize('email', 'password', function(error, bc) {});
```

### Recording a diaper

```js
bc.diaper({
    child: 'Child Name',
    time: new Date(),
    type: 'wet'
}, function(error) {});
```

#### child
The display name of the child the diaper is for.

#### time (optional)
A Date object representing the date to use when recording the diaper. By default
the current time is used.

#### type (optional)
The type of diaper being recorded. The default value is `wet`. Valid values are:

- `bm`
- `bmWet`
- `wet`
- `dry`

### Recording a bottle

```js
bc.bottle({
    child: 'Child Name',
    time: new Date(),
    amount: 1,
    type: 'formula'
}, function(error) {});
```

#### child
The display name of the child the bottle is for.

#### time (optional)
A Date object representing the date to use when recording the bottle. By default
the current time is used.

#### amount (optional)
The amount (in whatever unit is selected in your Baby Connect settings) that the
child consumed.

#### type (optional)
The type of food that was consumed. The default value is `formula`. Valid values
are:

- `milk`
- `formula`
- `water`
- `juice`