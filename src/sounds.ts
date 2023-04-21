export const playNewsAlertSound = () => {
  const audio = new Audio('/sounds/news-alert.mp3');
  return audio.play();
};

export const playOrderFilledSound = () => {
  const audio = new Audio('/sounds/order-filled.mp3');
  return audio.play();
};
