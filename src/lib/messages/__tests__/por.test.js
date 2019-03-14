// Chai is a commonly used library for creating unit test suites. It is easily extended with plugins.
const chai = require('chai');
const assert = chai.assert;

// Sinon is a library used for mocking or verifying function calls in JavaScript.
const sinon = require('sinon');

// Require firebase-admin so we can stub out some of its methods.
const admin = require('firebase-admin');
// Require and initialize firebase-functions-test. Since we are not passing in any parameters, it will
// be initialized in an "offline mode", which means we have to stub out all the methods that interact
// with Firebase services.
const test = require('firebase-functions-test')();

describe('Cloud Functions', () => {
    let messages //, adminInitStub;
    beforeEach(() => {
        //adminInitStub = sinon.stub(admin, 'initializeApp');
        // Now we can require created.js and save the exports inside a namespace called messages.
        messages = require('../created.js');
    });

    afterEach(() => {
        // Restore admin.initializeApp() to its original method.
        //adminInitStub.restore();
        // Do other cleanup tasks.
        test.cleanup();
      });

    describe('POR', () => {
        let database;
        beforeEach(() => {
            database = admin.database;
        });

        afterEach(() => {
            admin.database = database
        });

        it('Get ACK on DEP', (done) => {
            // [START assertOffline]
            const childParam = 'uppercase';
            const setParam = 'INPUT';
            // Stubs are objects that fake and/or record function calls.
            // These are excellent for verifying that functions have been called and to validate the
            // parameters passed to those functions.
            const childStub = sinon.stub();
            const setStub = sinon.stub();
            // [START fakeSnap]
            // The following lines creates a fake snapshot, 'snap', which returns 'input' when snap.val() is called,
            // and returns true when snap.ref.parent.child('uppercase').set('INPUT') is called.
            let object = {
                TM: "DEP",
                RN: 1,
                RC: "L337",
                MA: "Dag",
                DA: "20190213",
                TI: "1327",
                PO: "DKFMO",
                ZD: "20190212",
                ZT: "1900",
                OB: "POR 200",
                PD: "20190212",
                PT: "2000",
                LA: "N011",
                LO: "E170",
                AC: "FIS",
                DS: "LKO"
            }
            const snap = {
                data: () => 
                    object
            };
            childStub.withArgs(childParam).returns({ set: setStub });
            setStub.withArgs(setParam).returns(true);
            // [END fakeSnap]
            // Wrap the makeUppercase function.
            const wrapped = test.wrap(messages.message);
            // Since we've stubbed snap.ref.parent.child(childParam).set(setParam) to return true if it was
            // called with the parameters we expect, we assert that it indeed returned true.
            let params = {
                params: {
                  userId: "WXpUkGMJVaUg5jSyYNNkAV6rT4I3",
                  messageId: "Nr9XJBsB6F7s8JL4NzIU"
                }
            }
            return assert.equal(wrapped(snap, params), true);
            // [END assertOffline]
        })
    });
});