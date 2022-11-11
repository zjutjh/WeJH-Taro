import { defineComponent } from 'vue';
import '../styles/index.scss';
import { WListItem } from '@/components/list';

const collapsePanelProps = {
  title: {
    type: String
  },
  defaultActive: {
    type: Boolean,
    default: false
  },
  maxHeight: {
    type: String,
    default: '500px'
  },
  arrow: {
    type: Boolean,
    default: false
  }
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
    const { $slots, handleClick, isActive, maxHeight, arrow, title } = this;

    return (
      <>
        <WListItem
          class={[
            'wjh-collapse-panel-header',
            isActive ? 'wjh-collapse-panel-header-active' : undefined
          ]}
          onTap={handleClick}
          clickable={arrow}
        >
          {title}
          {$slots.header?.()}
        </WListItem>
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
