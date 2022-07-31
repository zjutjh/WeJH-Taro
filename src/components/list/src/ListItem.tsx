import { defineComponent } from 'vue';
import '../styles/index.scss';

const listItemProps = {
  extra: String,
  clickable: {
    type: Boolean,
    default: false
  }
};
export default defineComponent({
  name: 'ListItem',
  props: listItemProps,
  render() {
    const { $slots, $props } = this;
    console.log(this);
    return (
      <view class="wjh-list-item">
        <view class="wjh-list-item-content">
          <view class="wjh-list-item-content-main">{$slots.default?.()}</view>
          {$props.extra ? (
            <view class="wjh-list-item-content-extra">{$props.extra}</view>
          ) : null}
          {$props.clickable ? (
            <view class="wjh-list-item-content-arrow iconfont icon-arrow-right"></view>
          ) : null}
        </view>
      </view>
    );
  }
});
