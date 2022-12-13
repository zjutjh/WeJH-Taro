import { WList } from "@/components/list";
import { defineComponent } from "vue";
import "../styles/index.scss";

const collapseProps = {
  defaultAvtiveKey: {
    type: Array,
    default: []
  }
};
export default defineComponent({
  name: "Collapse",
  props: collapseProps,
  components: {
    WList
  },
  render() {
    const { $slots } = this;
    return (
      <view class="wjh-collapse">
        <WList size="small">{$slots.default?.()}</WList>
      </view>
    );
  }
});
