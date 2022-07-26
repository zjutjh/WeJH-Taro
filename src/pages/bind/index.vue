<template>
  <view class="bind-view background">
    <title-bar title="绑定"></title-bar>
    <scroll-view scrollY="true">
      <view class="flex-column">
        <card title="信息绑定">
          <text>正方教务系统</text>
          <text v-if="user.isBindZF" class="bind-info">(已绑定)</text>
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
            <button class="active" @tap="bindZFClick" :disabled="zfpass === ''">
              <text v-if="!user.isBindZF">绑定</text>
              <text v-else>修改</text>
            </button>
          </view>
          <text>校园卡</text>
          <text v-if="user.isBindCard" class="bind-info">(已绑定)</text>
          <view>
            <input
              v-if="!user.isBindCard"
              type="password"
              placeholder="输入校园卡密码"
              v-model="cardpass"
            />
            <input
              v-else
              type="password"
              placeholder="********"
              v-model="cardpass"
            />
            <button
              class="active"
              @tap="bindCardClick"
              :disabled="cardpass === ''"
            >
              <text v-if="!user.isBindCard">绑定</text>
              <text v-else>修改</text>
            </button>
          </view>
          <text>图书馆</text>
          <text v-if="user.isBindLibrary" class="bind-info">(已绑定)</text>
          <view>
            <input
              v-if="!user.isBindLibrary"
              type="password"
              placeholder="输入图书馆密码"
              v-model="libpass"
            />
            <input
              v-else
              type="password"
              placeholder="********"
              v-model="libpass"
            />
            <button
              class="active"
              @tap="bindLibClick"
              :disabled="libpass === ''"
            >
              <text v-if="!user.isBindLibrary">绑定</text>
              <text v-else>修改</text>
            </button>
          </view>
        </card>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts">
  import Card from '@/components/Card/index.vue';
  import Taro from '@tarojs/taro';
  import TitleBar from '@/components/TitleBar/index.vue';
  import { UserService, errCodeHandler } from '@/services';
  import { serviceStore } from '@/store';
  import './index.scss';

  export default {
    components: {
      TitleBar,
      Card
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
        cardpass: ''
      };
    },
    methods: {
      async bindZFClick() {
        let res = await UserService.bindZF({ password: this.zfpass }, false);
        await this.popModal(res.code);
      },
      async bindLibClick() {
        let res = await UserService.bindLibrary(
          { password: this.libpass },
          false
        );
        await this.popModal(res.code);
      },
      async bindCardClick() {
        let res = await UserService.bindSchoolCard(
          { password: this.cardpass },
          false
        );
        await this.popModal(res.code);
      },
      async popModal(code) {
        if (code === 1) {
          await Taro.showToast({
            icon: 'success',
            title: '绑定成功'
          });
        } else errCodeHandler(code);
      }
    }
  };
</script>
