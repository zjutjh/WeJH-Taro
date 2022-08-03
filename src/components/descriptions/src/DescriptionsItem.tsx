import { defineComponent } from 'vue';
import '../styles/index.scss';

const descriptionsItemProps = {
  label: String,
  labelSpan: {
    type: Number,
    default: 6
  }
};

export default defineComponent({
  name: 'DescriptionsItem',
  props: descriptionsItemProps,
  render() {
    const { $slots, $props } = this;
    return (
      <view class="wjh-descriptions-item">
        <view class="wjh-descriptions-item-container">
          <view
            class="wjh-descriptions-item-label"
            style={{
              flex: `0 0 calc(100% / 24 * ${$props.labelSpan})`,
              maxHeight: `0 0 calc(100% / 24 * ${$props.labelSpan})`
            }}
          >
            {$props.label}
          </view>
          <view
            class={`wjh-descriptions-item-content wjh-col-${
              24 - $props.labelSpan
            }`}
          >
            {$slots.default?.()}
          </view>
        </view>
      </view>
    );
  }
});
