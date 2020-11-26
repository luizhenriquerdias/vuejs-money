import VMoney from './directive';

function install(Vue) {
	Vue.directive('money', VMoney);
}

export default install;
