const Money = require('../src/Money');
const expect = require('chai').expect;

describe('money', () => {
    it('should convert to undefined params to zero', () => {
        const money = new Money();
        expect(money.toDecimal()).to.eql(0);
    });

    it('should convert a zero major amount params to zero', () => {
        const money = new Money(0);
        expect(money.toDecimal()).to.eql(0);
    });

    it('should convert a zero minor and major amount params to zero', () => {
        const money = new Money(0,0);
        expect(money.toDecimal()).to.eql(0);
    });

    it('should convert major amount of 1 to 100', () => {
        const money = new Money(1,0);
        expect(money.toDecimal()).to.eql(100);
    });

    it('should convert major amount of 1 and minor amount of 1 to 101', () => {
        const money = new Money(1,1);
        expect(money.toDecimal()).to.eql(101);
    });



});