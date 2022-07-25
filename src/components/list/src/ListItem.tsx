import '../styles/index.scss';

import { defineComponent } from 'vue';
export default defineComponent({
  name: 'ListItem',
  render() {
    const { $slots } = this;
    return (
      <view class="wjh-list-item">
        <view class="wjh-list-item__content">
          {$slots.prefix ? <view></view> : null}
          {$slots.default?.()}
          {$slots.suffix ? <view></view> : null}
        </view>
      </view>
    );
  }
});
