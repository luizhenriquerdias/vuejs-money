function toStr(value) {
	return value ? value.toString() : '';
}

function onlyNumbers(input) {
	return toStr(input).replace(/\D+/g, '') || '0';
}

function between(min, n, max) {
	return Math.max(min, Math.min(n, max));
}

function fixed(precision) {
	return between(0, precision, 20);
}

function numbersToCurrency(numbers, precision) {
	const exp = 10 ** precision;
	const float = parseFloat(numbers) / exp;
	return float.toFixed(fixed(precision));
}

function addThousandSeparator(integer, separator) {
	return integer.replace(/(\d)(?=(?:\d{3})+\b)/gm, `$1${separator}`);
}

function joinIntegerAndDecimal(integer, decimal, separator) {
	return decimal ? integer + separator + decimal : integer;
}

function format(input = 0, opt) {
	const value = typeof input === 'number' ? input.toFixed(fixed(opt.precision)) : (input || '0');
	const numbers = onlyNumbers(value);
	const currency = numbersToCurrency(numbers, opt.precision);
	const parts = toStr(currency).split('.');
	const [integerDirty, decimal] = parts;
	const integer = addThousandSeparator(integerDirty, opt.thousands);
	return [
		opt.prefix,
		joinIntegerAndDecimal(integer, decimal, opt.decimal)
	].join('');
}

function setCursor(el, position) {
	function setSelectionRange() {
		el.setSelectionRange(position, position);
	}
	if (el === document.activeElement) {
		setSelectionRange();
		setTimeout(setSelectionRange, 1); // Android Fix
	}
}

export { format, setCursor };
