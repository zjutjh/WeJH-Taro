import { Button } from '@tarojs/components';
import { defineComponent, PropType } from 'vue';
import '../styles/index.scss';

const buttonProps = {
  size: {
    type: String as PropType<'small' | 'middle' | 'large'>,
    default: 'middle'
  },
  shape: {
    type: String as PropType<'circle' | 'rounded' | 'default'>,
    default: 'default'
  },
  block: {
    type: Boolean,
    default: false
  },
  color: {
    type: String as PropType<'green' | 'yellow' | 'blue' | 'cyan'>
  }
};
export default defineComponent({
  name: 'WButton',
  props: buttonProps,
  render() {
    const { $slots } = this;
    const colorStyle = this.color
      ? { backgroundColor: `var(--wjh-color-${this.color})` }
      : '';
    const sizeClass = `wjh-button-${this.size}`;
    const blockClass = this.block ? 'wjh-button-block' : undefined;
    const shapeClass = `wjh-button-shape-${this.shape}`;
    return (
      <Button
        style={[colorStyle]}
        class={['wjh-button', sizeClass, blockClass, shapeClass]}
      >
        {$slots.default?.()}
      </Button>
    );
  }
});
