function Money(majorAmount = 0, minorAmount = 0) {
    this.majorAmount = majorAmount;
    this.minorAmount = minorAmount;
    this.currency = 'EUR';
    return Object.freeze(this);
}
Money.prototype.toDecimal = function () {
    return this.majorAmount * 10 * 10 + this.minorAmount;
};
Money.prototype.compareTo = function (other) {
    return this.toDecimal() - other.toDecimal();
};
module.exports = Money;