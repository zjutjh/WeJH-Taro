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
              :clickable="!user.isBindZF"
              @tap="renderForm('zf')"
            >
              正方教务系统
            </w-list-item>
          </w-list>
          <w-list class="bind-list">
            <w-list-item
              :extra="user.isBindCard ? '已绑定' : '未绑定'"
              :class="{ binded: user.isBindCard }"
              :clickable="!user.isBindCard"
              @tap="renderForm('card')"
            >
              校园卡
            </w-list-item>
          </w-list>
          <w-list class="bind-list">
            <w-list-item
              :extra="user.isBindLibrary ? '已绑定' : '未绑定'"
              :class="{ binded: user.isBindLibrary }"
              :clickable="!user.isBindLibrary"
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
              placeholder="输入正方教务系统密码"
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
            <w-button size="large" block @tap="bindZFClick">
              确认绑定
            </w-button>
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
            <w-button size="large" block @tap="bindCardClick">
              确认绑定
            </w-button>
          </template>
        </card>
        <card title="绑定账号" v-if="bindTab === 'library'">
          <text>图书馆账户密码</text>
          <view>
            <input
              type="password"
              placeholder="输入图书馆账户密码"
              v-model="libpass"
            />
          </view>
          <template #footer>
            <w-button size="large" block @tap="bindLibClick">
              确认绑定
            </w-button>
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
  import { UserService, errCodeHandler } from '@/services';
  import { serviceStore } from '@/store';
  import { helpText } from '@/constants/copywriting';
  import './index.scss';

  export default {
    components: {
      TitleBar,
      Card,
      WButton,
      WList,
      WListItem,
      WModal
    },
    computed: {
      user() {
        return serviceStore.user;
      }
    },
    data() {
      return {
        zfpass: '',
        libpass: '',
        cardpass: '',
        bindTab: undefined,
        helpContent: undefined,
        isShowHelp: false
      };
    },
    methods: {
      async bindZFClick() {
        Taro.showLoading({
          title: '正在绑定',
          mask: true
        });
        let res = await UserService.bindZF({ password: this.zfpass });
        // Taro.hideLoading();
        await this.popModal(res.code);
      },
      async bindLibClick() {
        Taro.showLoading({
          title: '正在绑定',
          mask: true
        });
        let res = await UserService.bindLibrary({ password: this.libpass });
        await this.popModal(res.code);
      },
      async bindCardClick() {
        Taro.showLoading({
          title: '正在绑定',
          mask: true
        });
        let res = await UserService.bindSchoolCard({ password: this.cardpass });
        await this.popModal(res.code);
      },
      async popModal(code: number) {
        if (code === 1) {
          await Taro.showToast({
            icon: 'success',
            title: '绑定成功'
          });
        }
      },

      renderForm(type: string) {
        if (type === 'zf' && this.user.isBindZF) return;
        if (type === 'card' && this.user.isBindCard) return;
        if (type === 'library' && this.user.isBindLibrary) return;
        this.bindTab = type;
      },
      showHelp(prop: 'zf') {
        this.isShowHelp = true;
        if (prop === 'zf') this.helpContent = helpText.bind.zf;
      }
    }
  };
</script>
