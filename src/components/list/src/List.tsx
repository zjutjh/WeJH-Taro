import { defineComponent } from 'vue';
import '../styles/index.scss';

export default defineComponent({
  name: 'WList',
  props: {},
  render() {
    const { $slots } = this;
    return (
      <view class="wjh-list">
        {$slots.header ? <view class="wjh-list__header"></view> : null}
        {$slots.default?.()}
        {$slots.footer ? <view class="wjh-list__footer"></view> : null}
      </view>
    );
  }
});
