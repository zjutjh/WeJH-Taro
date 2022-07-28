import { defineComponent, PropType } from 'vue';
import '../styles/index.scss';

const listProps = {
  size: {
    type: String as PropType<'small' | 'middle'>,
    default: 'middle'
  }
};

export default defineComponent({
  name: 'List',
  props: listProps,
  render() {
    const { $slots, $props } = this;
    return (
      <view class={`wjh-list wjh-list-size-${$props.size}`}>
        {$slots.header ? (
          <view class="wjh-list-header">{$slots.header()}</view>
        ) : null}
        {$slots.default?.()}
        {$slots.footer ? (
          <view class="wjh-list-footer">{$slots.footer()}</view>
        ) : null}
      </view>
    );
  }
});
