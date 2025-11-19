export const playSound = (type, enabled = true) => {
  if (!enabled) return;
  
  const sounds = {
    pop: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
    error: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3'
  };
  
  try {
    const audio = new Audio(sounds[type]);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch (e) {}
};
