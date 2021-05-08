import { mount } from '@vue/test-utils';
import appListItem from '../index.vue';
import Taro from '@tarojs/taro';
test('fill label', async () => {
	const wrapper = mount(appListItem);
	const label = wrapper.get("[data-test='label'");
	await wrapper.setProps({ label: 'we-test' });
	expect(label.text()).toEqual('we-test');
});

test('no label', async () => {
	const wrapper = mount(appListItem);
	const label = wrapper.get("[data-test='label'");
	await wrapper.setProps({ label: '' });
	expect(label.text()).toEqual('');
});

test('bg color', async () => {
	const wrapper = mount(appListItem);
	const bg = wrapper.get("[data-test='bg'");
	await wrapper.setProps({ bg: '#FFFFFF' });
	expect(bg.attributes('style')).toEqual('background-color: rgb(255, 255, 255);');
});
