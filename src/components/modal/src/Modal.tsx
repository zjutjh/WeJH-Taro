import { defineComponent } from 'vue';
import '../styles/index.scss';

const modalProps = {
  title: {
    default: '帮助',
    type: String
  },
  mask: {
    type: Boolean,
    default: true
  },
  show: {
    type: Boolean,
    default: false
  },
  content: {
    type: String
  }
};
export default defineComponent({
  name: 'WModal',
  props: modalProps,
  methods: {
    closeModal() {
      this.$emit('update:show', false);
    }
  },
  render() {
    const { $slots, $props, closeModal } = this;
    return (
      <view class={['wjh-modal', !$props.show ? 'hidden' : undefined]}>
        <view class="wjh-modal-container">
          <view class="wjh-modal-header">
            {$props.title}
            {$slots.header}
          </view>
          <view class="wjh-modal-body">
            {$props.content}
            {$slots.default}
          </view>
          {$slots.footer ? (
            <view class="wjh-modal-footer">{$slots.footer}</view>
          ) : null}
        </view>
        {$props.mask ? (
          <view class="wjh-modal-mask" onTap={closeModal}></view>
        ) : null}
      </view>
    );
  }
});
