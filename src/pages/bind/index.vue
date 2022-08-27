<template>
  <view class="bind-view background">
    <title-bar title="绑定"></title-bar>
    <scroll-view :scrollY="true">
      <view class="flex-column">
        <card title="信息绑定">
          <w-list class="bind-list">
            <w-list-item
              :extra="user.isBindZF ? '已绑定' : '未绑定'"
              :class="{ binded: user.isBindZF }"
              :clickable="true"
              @tap="renderForm('zf')"
            >
              正方教务系统
            </w-list-item>
          </w-list>
          <w-list class="bind-list">
            <w-list-item
              :extra="user.isBindCard ? '已绑定' : '未绑定'"
              :class="{ binded: user.isBindCard }"
              :clickable="true"
              @tap="renderForm('card')"
            >
              校园卡
            </w-list-item>
          </w-list>
          <w-list class="bind-list">
            <w-list-item
              :extra="user.isBindLibrary ? '已绑定' : '未绑定'"
              :class="{ binded: user.isBindLibrary }"
              :clickable="true"
              @tap="renderForm('library')"
            >
              图书馆账号
            </w-list-item>
          </w-list>
        </card>
        <card title="绑定账号" v-if="bindTab === 'zf'">
          <text>正方教务系统</text>
          <view>
            <input
              v-if="!user.isBindZF"
              type="password"
              placeholder="默认密码为zjut+身份证后六位"
              v-model="zfpass"
            />
            <input
              v-else
              type="password"
              placeholder="*******"
              v-model="zfpass"
            />
          </view>
          <template #footer>
            <view class="form-help-wrapper">
              <view class="form-help" @tap="showHelp('zf')">
                <view class="iconfont icon-help"></view>
                <view>帮助</view>
              </view>
            </view>
            <w-button block @tap="bindZFClick"> 确认绑定 </w-button>
          </template>
        </card>
        <card title="绑定账号" v-if="bindTab === 'card'">
          <text>校园卡密码</text>
          <view>
            <input
              type="password"
              placeholder="默认密码为学号后6位"
              v-model="cardpass"
            />
          </view>
          <template #footer>
            <w-button block @tap="bindCardClick"> 确认绑定 </w-button>
          </template>
        </card>
        <card title="绑定账号" v-if="bindTab === 'library'">
          <text>图书馆账户密码</text>
          <view>
            <input
              type="password"
              placeholder="默认密码为学号"
              v-model="libpass"
            />
          </view>
          <template #footer>
            <view class="form-help-wrapper">
              <view class="form-help" @tap="showHelp('library')">
                <view class="iconfont icon-help"></view>
                <view>帮助</view>
              </view>
            </view>
            <w-button block @tap="bindLibClick"> 确认绑定 </w-button>
          </template>
        </card>
      </view>
    </scroll-view>
    <w-modal :content="helpContent" v-model:show="isShowHelp"> </w-modal>
  </view>
</template>

<script lang="ts">
  import Card from '@/components/Card/index.vue';
  import Taro from '@tarojs/taro';
  import TitleBar from '@/components/TitleBar/index.vue';
  import { WButton } from '@/components/button';
  import { WList, WListItem } from '@/components/list';
  import { WModal } from '@/components/modal';
  import { UserService } from '@/services';
  import store, { serviceStore } from '@/store';
  import { helpText } from '@/constants/copywriting';
  import './index.scss';
  import { computed, onMounted, ref } from 'vue';

  export default {
    components: {
      TitleBar,
      Card,
      WButton,
      WList,
      WListItem,
      WModal
    },
    setup() {
      const zfpass = ref('');
      const libpass = ref('');
      const cardpass = ref('');
      const bindTab = ref<string | undefined>(undefined);
      const helpContent = ref<string | undefined>(undefined);
      const isShowHelp = ref(false);

      const user = computed(() => serviceStore.user);

      onMounted(() => {
        getUserBindInfo();
      });

      async function getUserBindInfo() {
        store.commit('startLoading');
        await UserService.getUserInfo();
        store.commit('stopLoading');
      }

      async function bindZFClick() {
        Taro.showLoading({
          title: '正在绑定',
          mask: true
        });
        let res = await UserService.bindZF({ password: zfpass.value });
        await popModal(res.code);
      }
      async function bindLibClick() {
        Taro.showLoading({
          title: '正在绑定',
          mask: true
        });
        let res = await UserService.bindLibrary({ password: libpass.value });
        await popModal(res.code);
      }
      async function bindCardClick() {
        Taro.showLoading({
          title: '正在绑定',
          mask: true
        });
        let res = await UserService.bindSchoolCard({
          password: cardpass.value
        });
        await popModal(res.code);
      }
      async function popModal(code: number) {
        if (code === 1) {
          await Taro.showToast({
            icon: 'success',
            title: '绑定成功'
          });
        }
      }

      function renderForm(type: string) {
        bindTab.value = type;
      }
      function showHelp(prop: 'zf' | 'library') {
        isShowHelp.value = true;
        if (prop === 'zf') helpContent.value = helpText.bind.zf;
        else if (prop === 'library') helpContent.value = helpText.bind.library;
      }
      return {
        zfpass,
        libpass,
        cardpass,
        bindTab,
        helpContent,
        isShowHelp,
        user,
        bindZFClick,
        bindCardClick,
        bindLibClick,
        popModal,
        renderForm,
        showHelp
      };
    }
  };
</script>
