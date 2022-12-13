import { defineComponent, PropType } from "vue";
import "../styles/index.scss";

const descriptionsProps = {
  size: {
    type: String as PropType<"small" | "middle">,
    default: "middle"
  },
  title: String
};

export default defineComponent({
  name: "Descriptions",
  props: descriptionsProps,
  render() {
    const { $slots, $props } = this;
    return (
      <view class={`wjh-descriptions wjh-desriptions-size-${$props.size}`}>
        {$props.title ? (
          <view class="wjh-descriptions-header">{$slots.header()}</view>
        ) : null}
        <view class="wjh-descriptions-view">{$slots.default?.()}</view>
      </view>
    );
  }
});
