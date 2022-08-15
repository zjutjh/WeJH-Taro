import { defineComponent } from 'vue';
import '../styles/index.scss';
import { WListItem } from '@/components/list';

const collapsePanelProps = {
  title: String,
  defaultActive: {
    type: Boolean,
    default: false
  },
  maxHeight: {
    type: String,
    default: '100px'
  },
  extra: String
};

export default defineComponent({
  name: 'CollapsePanel',
  props: collapsePanelProps,
  components: {
    WListItem
  },
  data() {
    return {
      isActive: this.defaultActive
    };
  },
  methods: {
    handleClick() {
      this.isActive = !this.isActive;
    }
  },
  render() {
    const { $slots, handleClick, title, isActive, maxHeight, extra } = this;

    return (
      <>
        {$slots.header ? (
          <WListItem
            class={[
              'wjh-collapse-panel-header',
              isActive ? 'wjh-collapse-panel-active' : undefined
            ]}
            onTap={handleClick}
            extra={extra}
          >
            {title ? <view>{title}</view> : null}
            {$slots.header()}
          </WListItem>
        ) : null}
        <view
          class="wjh-collapse-panel-content"
          style={{ maxHeight: isActive ? maxHeight : '0' }}
        >
          <WListItem>{$slots.default?.()}</WListItem>
        </view>
      </>
    );
  }
});
