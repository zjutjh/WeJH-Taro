import { CardConsume } from "@/types/CardConsume";
import { ref } from "vue";
import { defineStore } from "pinia";

export interface CardServiceType {
  balance?: number;
  today: CardConsume[];
  history: CardConsume[];
  updateTime: {
    today?: Date;
    history?: Date;
    balance?: Date;
  };
}

export const useCardServiceStore = defineStore("card", () => {
  const balance = ref<number>();
  const history = ref<CardConsume[]>([]);
  const today = ref<CardConsume[]>([]);
  const updateTime = ref<{
    balance?: Date;
    history?: Date;
    today?: Date;
  }>({
    balance: undefined,
    history: undefined,
    today: undefined
  });

  const setCardBalance = (value: number) => {
    balance.value = value;
    updateTime.value.balance = new Date();
  };

  const setCardToday = (value: CardConsume[]) => {
    if (value !== null) today.value = value;
    else today.value = [];
    updateTime.value.today = new Date();
  };

  const clearCardToday = () => {
    today.value = [];
  };

  return {
    balance,
    history,
    today,
    updateTime,
    setCardBalance,
    setCardToday,
    clearCardToday
  };
});
