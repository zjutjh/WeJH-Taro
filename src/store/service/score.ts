import { Score } from "@/types/Score";

export interface ScoreServiceStoreType {
  checkReadinStore: checkReadinStoreType[];
}

export interface checkReadinStoreType {
  name: string;
  scorePoint: string;
  val: boolean;
}

export const ScoreServiceStore = {
  state: {
    checkReadinStore: []
  },

  mutations: {
    //判断是否是新成绩，若新成绩不在缓存中，则更新之
    setCheckReadinStore(state: ScoreServiceStoreType, item: Score){
        let flag = false;
        for(let index in state.checkReadinStore) {
          if(state.checkReadinStore[index].name === item.lessonID && state.checkReadinStore[index].scorePoint === item.scorePoint) {
            flag = true;
            break;
          }
        }
        if(flag === false) {
          state.checkReadinStore.push({name: item.lessonID ,scorePoint: item.scorePoint, val: false})
        }
    },

    //检测缓存中成绩是否全部已读,是则返回true
    tryCheckReadinStore(state: ScoreServiceStoreType) {
      for(let index in state.checkReadinStore) {
        if(state.checkReadinStore[index].val === false) {
          return false;
        }
      }
      return true;
    },

    //点进成绩卡片时触发，将当前缓存中成绩更新为已读
    changeCheckReadinStore(state: ScoreServiceStoreType ) {
      for(var index in state.checkReadinStore) {
        state.checkReadinStore[index].val = true;
      }
    }
  },
}
