import { defineComponent } from 'vue';
import '../styles/index.scss';
import { WListItem } from '@/components/list';

const collapsePanelProps = {
  defaultActive: {
    type: Boolean,
    default: false
  },
  maxHeight: {
    type: String,
    default: '500px'
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
    const { $slots, handleClick, isActive, maxHeight, extra } = this;

    return (
      <>
        {$slots.header ? (
          <WListItem
            class={[
              'wjh-collapse-panel-header',
              isActive ? 'wjh-collapse-panel-header-active' : undefined
            ]}
            onTap={handleClick}
            extra={extra}
          >
            {$slots.header()}
          </WListItem>
        ) : null}
        <view
          class={[
            'wjh-collapse-panel-content',
            isActive ? 'wjh-collapse-panel-content-active' : undefined
          ]}
          style={{ maxHeight: isActive ? maxHeight : '0' }}
        >
          <WListItem>{$slots.default?.()}</WListItem>
        </view>
      </>
    );
  }
});
