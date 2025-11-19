import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/sound';

export const useInvisibleFriend = () => {
  // State initialization with lazy loading
  const [participants, setParticipants] = useState(() => JSON.parse(localStorage.getItem('if_participants') || '[]'));
  const [step, setStep] = useState(() => localStorage.getItem('if_step') || 'input');
  const [assignments, setAssignments] = useState(() => JSON.parse(localStorage.getItem('if_assignments') || '{}'));
  const [viewedUsers, setViewedUsers] = useState(() => JSON.parse(localStorage.getItem('if_viewed') || '[]'));
  const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('if_settings') || JSON.stringify({
    budget: '20€', date: new Date().toISOString().split('T')[0], details: 'Sin calcetines'
  })));
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Persistence
  useEffect(() => localStorage.setItem('if_participants', JSON.stringify(participants)), [participants]);
  useEffect(() => localStorage.setItem('if_step', step), [step]);
  useEffect(() => localStorage.setItem('if_assignments', JSON.stringify(assignments)), [assignments]);
  useEffect(() => localStorage.setItem('if_viewed', JSON.stringify(viewedUsers)), [viewedUsers]);
  useEffect(() => localStorage.setItem('if_settings', JSON.stringify(settings)), [settings]);

  // Actions
  const addParticipant = (name) => {
    if (!name.trim() || participants.some(p => p.name === name.trim())) return;
    playSound('click', soundEnabled);
    setParticipants([...participants, { id: Date.now().toString(), name: name.trim(), pin: '', exclusions: [] }]);
  };

  const removeParticipant = (id) => {
    playSound('click', soundEnabled);
    setParticipants(participants.filter(p => p.id !== id));
  };

  const updateParticipant = (id, data) => {
    setParticipants(participants.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const generatePairs = () => {
    if (participants.length < 2) return;
    playSound('click', soundEnabled);

    let attempt = 0;
    while (attempt++ < 100) {
      let shuffled = [...participants].sort(() => Math.random() - 0.5);
      const pairs = {};
      let valid = true;

      for (let i = 0; i < shuffled.length; i++) {
        const giver = shuffled[i];
        const receiver = shuffled[(i + 1) % shuffled.length];
        if (giver.exclusions.includes(receiver.id) || giver.id === receiver.id) {
          valid = false;
          break;
        }
        pairs[giver.name] = receiver.name;
      }

      if (valid) {
        setAssignments(pairs);
        setStep('result');
        playSound('success', soundEnabled);
        confetti({ spread: 360, particleCount: 100, origin: { y: 0.6 } });
        return;
      }
    }
    alert('Imposible generar sorteo con estas restricciones.');
  };

  const resetGame = () => {
    playSound('click', soundEnabled);
    setParticipants([]);
    setAssignments({});
    setStep('input');
    setViewedUsers([]);
    localStorage.clear();
  };

  return {
    state: { participants, step, assignments, viewedUsers, settings, soundEnabled },
    actions: { setSettings, setSoundEnabled, addParticipant, removeParticipant, updateParticipant, generatePairs, resetGame, setViewedUsers }
  };
};
