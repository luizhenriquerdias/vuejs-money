import { format, setCursor } from './utils';
import opt from './options';

function run(el, eventName, config) {
	let positionFromEnd = el.value.length - el.selectionEnd;
	el.value = format(el.value, config);
	positionFromEnd = el.value.length - positionFromEnd;
	positionFromEnd = Math.max(positionFromEnd, config.prefix.length + 1); // left
	setCursor(el, positionFromEnd);
	el.dispatchEvent(new Event(eventName));
}

function getInput(el) {
	if (el.tagName.toLocaleUpperCase() !== 'INPUT') {
		const els = el.getElementsByTagName('input');
		if (els.length !== 1)
			throw new Error(`v-money requires 1 input, found ${els.length}`);
		else
			el = els[0];
	}
	return el;
}

function getConfig(binding) {
	const config = opt;
	if (binding.value) {
		const { value } = binding;
		if (value.precision) {
			const precision = value.precision;
			if (typeof precision === 'number' && precision > 0 && precision < 6 && precision === parseInt(precision, 10))
				config.precision = precision;
		}

		if (typeof value.prefix === 'string')
			config.prefix = value.prefix;

		if (typeof value.thousands === 'string')
			config.thousands = value.thousands;

		if (typeof value.decimal === 'string')
			config.decimal = value.decimal;
	}
	return config;
}

function bind(el, binding) {
	if (binding.value === false)
		return;

	el = getInput(el);
	run(el, 'input', getConfig(binding));
}

function componentUpdated(el, binding, vnode, oldVnode) {
	if (binding.value === false)
		return;

	const data = vnode.data.props || vnode.data.model;
	const oldData = oldVnode.data.props || oldVnode.data.model;

	if (data && data.value === oldData.value)
		return; // Prevent firing endless events

	el = getInput(el);
	el.value = data ? data.value : el.value;
	run(el, 'input', getConfig(binding));
}

export default { bind, componentUpdated };
