export const ScoreServiceStore = {
  state: {
    checkReadinStore: [{}]
  },

  mutations: {
    setCheckReadinStoreL(state:any , item:any){
        var flag = false;
        for(var index in state.checkReadinStore) {
          if(state.checkReadinStore[index].name === item.lessonID) {
            flag = true;
            break;
          }
        }
        if(flag === false) {
          state.checkReadinStore.push({name:item.lessonID , val: false})
        }
    },

    tryCheckReadinStore(state:any) {
      //检测是否全部已读,是则返回true
      for(var index in state.checkReadinStore) {
        if(state.checkReadinStore[index].val === false) {
          return false;
        }
      }
      return true;
    },

    changeCheckReadinStore(state:any ) {
      for(var index in state.checkReadinStore) {
        state.checkReadinStore[index].val = true;
      }
    }
  },
}
