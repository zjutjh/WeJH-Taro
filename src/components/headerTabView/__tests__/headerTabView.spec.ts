import { mount } from '@vue/test-utils';
import headerTabView from '../index.vue';

test('completes a todo', async () => {
	const wrapper = mount(headerTabView);
	const todo = wrapper.find('.index').trigger('scroll');

	expect(true);
});
