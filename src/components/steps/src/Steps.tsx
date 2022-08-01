import { defineComponent } from 'vue';
import '../styles/index.scss';

const stepProps = {
  total: Number,
  current: Number
};

export default defineComponent({
  name: 'WSteps',
  props: stepProps,
  render() {
    const { $slots, $props } = this;
    const arr = new Array<number>($props.total)
      .fill(0)
      .map((item, index) => index + 1);
    return (
      <view class="wjh-steps">
        {arr.map((item, index) => {
          return (
            <view
              class={[
                'wjh-steps-item',
                index === $props.current - 1
                  ? 'wjh-steps-item-active'
                  : undefined
              ]}
            >
              {index === $props.current - 1 ? `0${$props.current}` : ''}
            </view>
          );
        })}
      </view>
    );
  }
});
