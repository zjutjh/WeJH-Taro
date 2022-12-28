export const LibraryServiceStore = {
    state: () => ({
        history: [],
        current: [],
        updateTime: {
            history: undefined,
            current: undefined
        }
    }),
    mutations: {
        setLibraryHistory(state: any, value: Array<object>) {
            state.history = value;
            state.updateTime.history = new Date();
        },
        setLibraryCurrent(state: any, value: Array<object>) {
            state.current = value;
            state.updateTime.current = new Date();
        }
    }
};
