import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import LZString from 'lz-string';
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
  const [isSharedMode, setIsSharedMode] = useState(false);

  // Load from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (data) {
      try {
        const decompressed = LZString.decompressFromEncodedURIComponent(data);
        if (decompressed) {
          const parsed = JSON.parse(decompressed);
          setParticipants(parsed.p || []);
          setAssignments(parsed.a || {});
          setSettings(parsed.s || {});
          setStep('result');
          setIsSharedMode(true);
        }
      } catch (e) {
      }
    }
  }, []);

  // Persistence (only if not in shared mode to avoid overwriting local games with shared ones immediately, 
  // though for simplicity we might want to save it so they can refresh)
  useEffect(() => {
    if (!isSharedMode) {
      localStorage.setItem('if_participants', JSON.stringify(participants));
      localStorage.setItem('if_step', step);
      localStorage.setItem('if_assignments', JSON.stringify(assignments));
      localStorage.setItem('if_viewed', JSON.stringify(viewedUsers));
      localStorage.setItem('if_settings', JSON.stringify(settings));
    }
  }, [participants, step, assignments, viewedUsers, settings, isSharedMode]);

  // Actions
  const addParticipant = (name) => {
    if (!name.trim() || participants.some(p => p.name === name.trim())) return;
    playSound('click', soundEnabled);
    setParticipants([...participants, { id: Date.now().toString(), name: name.trim(), email: '', pin: '', exclusions: [] }]);
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
    // Clear URL params
    window.history.pushState({}, document.title, window.location.pathname);
    setIsSharedMode(false);
  };

  const getShareLink = (userId = null) => {
    const data = JSON.stringify({
      p: participants,
      a: assignments,
      s: settings
    });
    const compressed = LZString.compressToEncodedURIComponent(data);
    let url = `${window.location.origin}${window.location.pathname}?data=${compressed}`;
    if (userId) {
      url += `&u=${userId}`;
    }
    return url;
  };

  const sendResultsByEmail = async () => {
    playSound('click', soundEnabled);
    const results = participants.map(p => ({
      name: p.name,
      email: p.email,
      assignment: assignments[p.name]
    })).filter(r => r.email && r.assignment);

    if (results.length === 0) {
      alert('No hay participantes con email asignado para enviar resultados.');
      return;
    }

    if (!confirm(`Se enviarán correos a ${results.length} participantes. ¿Continuar?`)) return;

    try {
      const response = await fetch('/api/send-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results, settings })
      });
      
      if (response.ok) {
        alert('Correos enviados correctamente (Revisa la consola del servidor si estás en modo simulación).');
        playSound('success', soundEnabled);
      } else {
        const data = await response.json();
        alert(`Error al enviar correos: ${data.error || 'Desconocido'}`);
      }
    } catch (error) {
      alert('Error de conexión al intentar enviar los correos.');
    }
  };

  const sendNotification = async (participant, assignment) => {
    if (!participant.email) return { success: false, error: 'Email no definido' };
    
    try {
      const response = await fetch('/api/send-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          results: [{ name: participant.name, email: participant.email, assignment }], 
          settings 
        })
      });
      
      if (response.ok) {
        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    state: { participants, step, assignments, viewedUsers, settings, soundEnabled, isSharedMode },
    actions: { setSettings, setSoundEnabled, addParticipant, removeParticipant, updateParticipant, generatePairs, resetGame, setViewedUsers, sendResultsByEmail, sendNotification, getShareLink }
  };
};
