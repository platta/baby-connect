var login = require('./login');
var dateTime = require('./dateTime');

/**
 * Default parameter values.
 */
const defaults = {
    child: null,
    time: null,
    type: 'wet'
};

/**
 * Object to map values for diaper type to the selectors that represent them on
 * the web page.
 */
const diaperTypeMapping = {
    bm: '#diaper1',
    bmWet: '#diaper2',
    wet: '#diaper3',
    dry: '#diaper4'
}

/**
 * Records a diaper in baby-connect.
 * 
 * @param {{child: string, time: Date, type: string}} parameters
 *  Specifies the parameters of the diaper to create.
 * 
 * @param {function(Object)} callback
 *  Specifies a callback function to invoke when finished.
 */
function diaper(parameters, callback) {
    // Begin with the default parameters, then assign the default value for the
    // time.
    var derivedParameters = {};
    Object.assign(derivedParameters, defaults, {time: new Date()});

    // Apply caller-specified parameters on top of the defaults.
    try {
        Object.assign(derivedParameters, parameters);
    } catch (error) {
        callback(error);
        return;
    }

    // Prepare parameter values.
    var childId = this.children[derivedParameters.child];
    if (!childId) {
        callback('No child specified, or child not found.');
        return;
    }

    var diaperType = diaperTypeMapping[derivedParameters.type];
    if (!diaperType) {
        callback('Invalid diaper type specified.');
        return;
    }

    var eventDate = dateTime.ensureDate(derivedParameters.time);
    if (!eventDate) {
        callback('Invalid date/time specified.');
        return;
    }
    var dateString = dateTime.getDateString(eventDate);
    var timeString = dateTime.getTimeString(eventDate);

    // Take action.
    login(this.email, this.password, function(error, data) {
        if (error) {
            callback(error);
        } else {
            data
                // Bring up the diaper dialog.
                .click("a[href='javascript:showDiaperDlg()']")
                .wait(500)

                // Select the right child.
                .select('#kidselector', childId)
                .wait(100)

                // Select the diaper type.
                .click(diaperType)
                .wait(100)

                // Inject date and time
                .insert('#uiDatePicker', dateString)
                .wait(100)
                .type('#timeinput', false)
                .wait(500)
                .type('#timeinput', timeString)
                .wait(100)

                // Submit.
                .click('.defaultDlgButton')
                .wait(500)
                .end()

                // When complete, invoke callback.
                .then(function() {
                    callback();
                })

                // Exception handling.
                .catch(function(error) {
                    callback(error);
                });
        }
    });
};

module.exports = diaper;