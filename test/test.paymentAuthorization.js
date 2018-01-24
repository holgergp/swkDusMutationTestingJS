const PaymentAuthorisation = require('../src/paymentAuthorisation');
const expect = require('chai').expect;

describe('payment authorization', () => {
    it('should be initialized with correct default values', () => {
        const paymentAuthorisation = new PaymentAuthorisation();
        
        expect(paymentAuthorisation).to.eql({
            approvalNeeded: false,
            primaryApprover: null
        });
    });

});