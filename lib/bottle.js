var login = require('./login');
var dateTime = require('./dateTime');

/**
 * Default parameter values.
 */
const defaults = {
    child: null,
    time: null,
    amount: 1,
    type: 'formula'
};

/**
 * Object to map values for bottle type to the selectors that represent them on
 * the web page.
 */
const bottleTypeMapping = {
    milk: '#bibMilk',
    formula: '#bibFormula',
    water: '#bibWater',
    juice: '#bibJuice'
}

/**
 * Records a bottle in baby-connect.
 * 
 * @param {{child: string, time: Date, amount: number, type: string}} parameters
 *  Specifies the parameters of the bottle to create.
 * 
 * @param {function(Object): void} callback
 *  Specifies a callback function to invoke when finished.
 */
function bottle(parameters, callback) {
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
    var childId = this.children[derivedParameters.child.toUpperCase()];
    if (!childId) {
        callback('No child specified, or child not found.');
        return;
    }

    var bottleType = bottleTypeMapping[derivedParameters.type];
    if (!bottleType) {
        callback('Invalid bottle type specified.');
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
                // Bring up the bottle dialog.
                .click("a[href='javascript:showBibDlg()']")
                .wait(500)

                // Select the right child.
                .select('#kidselector', childId)
                .wait(100)

                // Inject date and time
                .insert('#uiDatePicker', dateString)
                .wait(100)
                .type('#timeinput', false)
                .wait(500)
                .type('#timeinput', timeString)
                .wait(100)

                // Choose the bottle type.
                .click(bottleType)
                .wait(100)

                // Enter the amount.
                .type('.ui-autocomplete-input', false)
                .wait(100)
                .type('.ui-autocomplete-input', derivedParameters.amount)
                .wait(100)

                // Submit the form.
                .click('.defaultDlgButton')
                .wait(500)
                .end()

                // When done, invoke the callback.
                .then(function() {
                    callback();
                })
                
                // Exception handling.
                .catch(function(error) {
                    callback(error);
                });
        }
    });
}

module.exports = bottle;