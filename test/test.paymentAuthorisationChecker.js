var expect = require('chai').expect;
var User = require('../src/user.js');
var Money = require('../src/money.js');
var Payment = require('../src/payment.js');
var checkFor = require('../src/paymentAuthorisationChecker.js');

describe('#checkFor()', function() {
  it('should not need approval if payment by initiator with limit more than amount', function() {
    initiator = new User('dave', new Money(200, 0));
    payment = new Payment(new Money(123, 45), initiator);
    authorisation = checkFor(payment);
    expect(authorisation.approvalNeeded).to.eql(false);
  });
  it('should need approval by supervisor if payment by initiator with limit less than amount', function() {
    supervisor = new User('liz', new Money(200, 0));
    initiator = new User('dave', new Money(100, 0), supervisor);
    payment = new Payment(new Money(123, 45), initiator);
    authorisation = checkFor(payment);
    expect(authorisation.approvalNeeded).to.eql(true);
    console.log(authorisation.primaryApprover.name);
  });
  it('should need approval by supervisor of supervisor if payment by initiator and supervisor with limit less than amount', function() {
    supervisorOfSupervisor = new User('mary', new Money(200, 0));
    supervisor = new User('liz', new Money(100, 0), supervisorOfSupervisor);
    initiator = new User('dave', new Money(50, 0), supervisor);
    payment = new Payment(new Money(123, 45), initiator);
    authorisation = checkFor(payment);
    expect(authorisation.approvalNeeded).to.eql(true);
    console.log(authorisation.primaryApprover.name);
  });
  it('should need no approval if amount is zero', () => {
    initiator = new User('dave', new Money(200, 0));
    payment = new Payment(new Money(0), initiator);
    authorisation = checkFor(payment);
    expect(authorisation.approvalNeeded).to.eql(false);
  });

  it('should need approval if amount is above limit', () => {
    supervisor = new User('liz', new Money(300, 0));

    initiator = new User('dave', new Money(200, 0), supervisor);
    payment = new Payment(new Money(300), initiator);
    authorisation = checkFor(payment);
    expect(authorisation.approvalNeeded).to.eql(true);
    expect(authorisation.primaryApprover).to.eql(supervisor);
  });

  it('should need no approval if amount is below limit', () => {

    initiator = new User('dave', new Money(2, 0), supervisor);
    payment = new Payment(new Money(1), initiator);
    authorisation = checkFor(payment);
    expect(authorisation.approvalNeeded).to.eql(false);
    expect(authorisation.primaryApprover).to.eql(null);
  });

  it('should get no approval if amount is way above limit', () => {
    const ourSupervisor = createSupervisorChain();
    initiator = new User('dave', new Money(200, 0),ourSupervisor );
    payment = new Payment(new Money(5000000), initiator);
    authorisation = checkFor(payment);
    expect(authorisation.approvalNeeded).to.eql(true);
    expect(authorisation.primaryApprover.name).to.eql('a');
  });

  function createSupervisorChain() {
    const a = new User('a', new Money(0, 0));
    const b = new User('b', new Money(0, 0), a);
    const c = new User('c', new Money(0, 0), b);
    const d = new User('d', new Money(0, 0), c);
    const e = new User('e', new Money(0, 0), d);
    const f = new User('f', new Money(0, 0), e);
    const g = new User('g', new Money(0, 0), f);
    const h = new User('h', new Money(0, 0), g);
    const i = new User('i', new Money(0, 0), h);
    const j = new User('j', new Money(0, 0), i);
    const k = new User('k', new Money(0, 0), j);

    return k;
  }

  it('should not take longer than 100ms for supervisor chain of 10', function(){
    this.timeout(50);
    const ourSupervisor = createSupervisorChain();
    initiator = new User('dave', new Money(200, 0),ourSupervisor );
    payment = new Payment(new Money(5000000), initiator);
    authorisation = checkFor(payment);
    expect(authorisation.approvalNeeded).to.eql(true);
    expect(authorisation.primaryApprover.name).to.eql('a');
  });
});
