import { config } from '@vue/test-utils'
import ScrollView from '@tarojs/components/dist-h5/vue3/components/scroll-view'
import createFormsComponent from '@tarojs/components/dist-h5/vue3/createFormsComponent'
import Text from '@tarojs/components/dist-h5/vue3/components/text'
import Image from '@tarojs/components/dist-h5/vue3/components/image'
import Icon from '@tarojs/components/dist-h5/vue3/components/icon'

var Input = createFormsComponent('taro-input', 'input');
var Textarea = createFormsComponent('taro-textarea', 'input');
var Picker = createFormsComponent('taro-picker', 'change');
var Switch = createFormsComponent('taro-switch', 'change', 'checked');
var Slider = createFormsComponent('taro-slider', 'change', 'value', ['weui-slider-box']);

config.global.components = {
  Input,
  Textarea,
  Picker,
  Switch,
  Slider,
  ScrollView,
  Text,
  Image,
  Icon
}
