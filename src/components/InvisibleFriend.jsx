import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Gift, Share2, Sparkles, RefreshCw, Eye, EyeOff, MessageCircle, Calendar, DollarSign, ArrowRight, X, Users, List, AlertTriangle, Check, ChevronDown, Search, Settings, Lock, Volume2, VolumeX, Ban } from 'lucide-react';
import confetti from 'canvas-confetti';

// Sound Manager
const playSound = (type) => {
  const sounds = {
    pop: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', // Pop sound
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Click sound
    success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Success sound
    error: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3' // Error sound
  };
  
  try {
    const audio = new Audio(sounds[type]);
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Audio play failed', e));
  } catch (e) {
    console.log('Audio error', e);
  }
};

const App = () => {
  // State with Persistence
  const [participants, setParticipants] = useState(() => {
    const saved = localStorage.getItem('if_participants');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newName, setNewName] = useState('');
  const [step, setStep] = useState(() => localStorage.getItem('if_step') || 'input');
  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem('if_assignments');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [viewedUsers, setViewedUsers] = useState(() => {
    const saved = localStorage.getItem('if_viewed');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('if_settings');
    return saved ? JSON.parse(saved) : {
      budget: '20€',
      date: new Date().toISOString().split('T')[0],
      details: 'Sin calcetines'
    };
  });

  // UI States
  const [selectedUser, setSelectedUser] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingParticipant, setEditingParticipant] = useState(null); // For settings modal
  const [pinInput, setPinInput] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingUserSelection, setPendingUserSelection] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Persistence Effects
  useEffect(() => localStorage.setItem('if_participants', JSON.stringify(participants)), [participants]);
  useEffect(() => localStorage.setItem('if_step', step), [step]);
  useEffect(() => localStorage.setItem('if_assignments', JSON.stringify(assignments)), [assignments]);
  useEffect(() => localStorage.setItem('if_viewed', JSON.stringify(viewedUsers)), [viewedUsers]);
  useEffect(() => localStorage.setItem('if_settings', JSON.stringify(settings)), [settings]);

  // Helper para formatear fecha bonita
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha pendiente';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  // Añadir usuario
  const handleAddName = (e) => {
    e.preventDefault();
    if (newName.trim() && !participants.some(p => p.name === newName.trim())) {
      if (soundEnabled) playSound('click');
      setParticipants([...participants, { 
        id: Date.now().toString(),
        name: newName.trim(),
        pin: '',
        exclusions: []
      }]);
      setNewName('');
    }
  };

  const removeParticipant = (id) => {
    if (soundEnabled) playSound('click');
    setParticipants(participants.filter(p => p.id !== id));
  };

  const updateParticipant = (id, updates) => {
    setParticipants(participants.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  // Algoritmo de sorteo con exclusiones
  const generatePairs = () => {
    if (participants.length < 2) return;
    if (soundEnabled) playSound('click');

    const maxAttempts = 100;
    let attempt = 0;
    
    while (attempt < maxAttempts) {
      let shuffled = [...participants];
      shuffled.sort(() => Math.random() - 0.5);
      
      const pairs = {};
      let valid = true;

      for (let i = 0; i < shuffled.length; i++) {
        const giver = shuffled[i];
        const receiver = shuffled[(i + 1) % shuffled.length];
        
        // Check exclusions
        if (giver.exclusions.includes(receiver.id) || giver.id === receiver.id) {
          valid = false;
          break;
        }
        pairs[giver.name] = receiver.name;
      }

      if (valid) {
        setAssignments(pairs);
        setStep('result');
        if (soundEnabled) playSound('success');
        launchConfetti();
        return;
      }
      attempt++;
    }
    
    alert('No se pudo generar un sorteo válido con las restricciones actuales. Intenta reducir las exclusiones.');
  };

  const launchConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100, colors: ['#ffffff', '#a8a29e', '#fbbf24'] };
    const randomInRange = (min, max) => Math.random() * (max - min) + min;
    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const triggerReset = () => setShowResetConfirm(true);

  const confirmReset = () => {
    if (soundEnabled) playSound('click');
    setParticipants([]);
    setAssignments({});
    setStep('input');
    setSelectedUser(null);
    setViewedUsers([]);
    setShowResetConfirm(false);
    localStorage.clear(); // Clear all
  };

  const handleUserSelection = (participant) => {
    if (soundEnabled) playSound('click');
    if (participant.pin) {
      setPendingUserSelection(participant);
      setPinInput('');
      setShowPinModal(true);
    } else {
      setSelectedUser(participant.name);
    }
  };

  const verifyPin = () => {
    if (pendingUserSelection && pendingUserSelection.pin === pinInput) {
      if (soundEnabled) playSound('success');
      setSelectedUser(pendingUserSelection.name);
      setShowPinModal(false);
      setPendingUserSelection(null);
      setPinInput('');
    } else {
      if (soundEnabled) playSound('error');
      alert('PIN Incorrecto');
      setPinInput('');
    }
  };

  const generateWhatsAppLink = (giver, receiver) => {
    const text = `\u2728 *INVISIBLE FRIEND* \u2728\n\n\uD83D\uDC64 Para: *${giver}*\n\uD83C\uDF81 Te toca regalar a: *${receiver}*\n\n\uD83D\uDCC5 ${formatDate(settings.date)}\n\uD83D\uDCB0 Presupuesto: ${settings.budget}\n\uD83D\uDCDD Notas: ${settings.details}\n\n\uD83E\uDD2B _Mantén el secreto_`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  const markAsViewed = (user) => {
    if (!viewedUsers.includes(user)) {
      setViewedUsers([...viewedUsers, user]);
    }
    setSelectedUser(null);
  };

  // Modals
  const ParticipantSettingsModal = () => {
    if (!editingParticipant) return null;
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Settings size={18} /> Configurar {editingParticipant.name}
            </h3>
            <button onClick={() => setEditingParticipant(null)} className="text-neutral-500 hover:text-white"><X size={20} /></button>
          </div>
          
          <div className="space-y-6">
            {/* PIN Section */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                <Lock size={12} /> PIN de Seguridad
              </label>
              <input 
                type="text" 
                maxLength="4"
                placeholder="Sin PIN"
                value={editingParticipant.pin}
                onChange={(e) => updateParticipant(editingParticipant.id, { pin: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-white/40 transition-all font-mono tracking-widest text-center"
              />
              <p className="text-[10px] text-neutral-600">Opcional: 4 dígitos para proteger el resultado.</p>
            </div>

            {/* Exclusions Section */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                <Ban size={12} /> Exclusiones (No regalar a)
              </label>
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                {participants.filter(p => p.id !== editingParticipant.id).map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      const currentExclusions = editingParticipant.exclusions || [];
                      const newExclusions = currentExclusions.includes(p.id)
                        ? currentExclusions.filter(id => id !== p.id)
                        : [...currentExclusions, p.id];
                      updateParticipant(editingParticipant.id, { exclusions: newExclusions });
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg mb-1 text-sm transition-colors ${editingParticipant.exclusions?.includes(p.id) ? 'bg-red-500/10 text-red-400' : 'hover:bg-neutral-800 text-neutral-400'}`}
                  >
                    <span>{p.name}</span>
                    {editingParticipant.exclusions?.includes(p.id) && <Ban size={14} />}
                  </button>
                ))}
                {participants.length <= 1 && <p className="text-center text-neutral-600 text-xs py-2">No hay otros participantes</p>}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-800">
            <button onClick={() => setEditingParticipant(null)} className="w-full py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-neutral-200 transition-colors">Guardar Cambios</button>
          </div>
        </div>
      </div>
    );
  };

  const PinModal = () => (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xs bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-4 text-white">
          <Lock size={24} />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Introduce el PIN</h3>
        <p className="text-neutral-400 text-sm mb-6">Seguridad para {pendingUserSelection?.name}</p>
        
        <input 
          type="password" 
          autoFocus
          maxLength="4"
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-4 text-white text-2xl text-center outline-none focus:border-white/40 transition-all font-mono tracking-[0.5em] mb-6"
        />
        
        <div className="flex gap-3">
          <button onClick={() => { setShowPinModal(false); setPendingUserSelection(null); }} className="flex-1 py-3 rounded-xl bg-neutral-800 text-white font-medium text-sm hover:bg-neutral-700">Cancelar</button>
          <button onClick={verifyPin} className="flex-1 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-neutral-200">Ver Misión</button>
        </div>
      </div>
    </div>
  );

  const ResetModal = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xs bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl p-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">¿Reiniciar todo?</h3>
            <p className="text-neutral-400 text-sm mt-1">Se borrarán los participantes y el sorteo actual.</p>
          </div>
          <div className="flex gap-3 w-full mt-2">
            <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-2.5 rounded-xl bg-neutral-800 text-white font-medium text-sm hover:bg-neutral-700 transition-colors">Cancelar</button>
            <button onClick={confirmReset} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition-colors">Reiniciar</button>
          </div>
        </div>
      </div>
    </div>
  );

  const IndividualModal = ({ user, onClose }) => {
    const [isRevealed, setIsRevealed] = useState(false);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
        <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-8 flex flex-col items-center text-center min-h-[450px] justify-between relative">
            <div className="absolute top-4 right-4">
              <button onClick={() => onClose(false)} className="p-2 text-neutral-600 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center w-full mt-4">
              <div className="w-16 h-16 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-4 shadow-inner">
                <span className="text-2xl font-bold text-white">{user.charAt(0).toUpperCase()}</span>
              </div>
              <p className="text-neutral-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">Identidad Confirmada</p>
              <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">{user}</h2>

              {isRevealed ? (
                <div className="animate-in zoom-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center w-full">
                  <p className="text-neutral-400 text-xs uppercase tracking-widest mb-3">Tu objetivo es</p>
                  <div className="p-8 bg-gradient-to-b from-neutral-800 to-neutral-950 rounded-2xl border border-neutral-700 w-full mb-6 relative overflow-hidden group shadow-2xl">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
                     <span className="relative z-10 text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-neutral-400 drop-shadow-sm">
                        {assignments[user]}
                     </span>
                  </div>
                  <div className="flex flex-col gap-1 text-neutral-500 text-xs font-medium mb-4">
                    <p>💰 {settings.budget}</p>
                    <p>📅 {formatDate(settings.date)}</p>
                  </div>
                  
                  <a 
                    href={generateWhatsAppLink(user, assignments[user])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2 text-xs uppercase tracking-widest"
                  >
                    <Share2 size={14} />
                    Guardar Misión
                  </a>
                </div>
              ) : (
                <button 
                  onClick={() => { 
                    if(soundEnabled) playSound('pop');
                    setIsRevealed(true); 
                    launchConfetti(); 
                  }}
                  className="group relative w-full py-4 bg-white text-black rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-neutral-200 transition-all overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Gift size={18} className="group-hover:-rotate-12 transition-transform" />
                    Ver Misión
                  </span>
                </button>
              )}
            </div>

            <div className="w-full pt-8">
              {isRevealed && (
                <button 
                  onClick={() => onClose(true)} // true = mark as viewed
                  className="w-full py-4 rounded-xl bg-neutral-800 text-white font-bold text-sm hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Entendido, finalizar turno
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-white selection:text-black flex items-center justify-center p-4 md:p-8">
      {showResetConfirm && <ResetModal />}
      {editingParticipant && <ParticipantSettingsModal />}
      {showPinModal && <PinModal />}
      
      <div className="w-full max-w-3xl grid grid-cols-1 gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
              Invisible<span className="text-neutral-600">.</span>
            </h1>
            <p className="text-neutral-500 text-sm font-medium mt-1 tracking-wide">MINIMALIST GIFT EXCHANGE</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setSoundEnabled(!soundEnabled)} className={`p-2 rounded-full border transition-all ${soundEnabled ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-transparent border-transparent text-neutral-600'}`}>
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            {(step === 'result' || participants.length > 0) && (
              <button onClick={triggerReset} className="p-2 bg-neutral-900 rounded-full border border-neutral-800 hover:border-neutral-600 transition-all text-neutral-400 hover:text-red-400">
                <RefreshCw size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[400px]">
          
          {/* STEP 1: INPUT */}
          {step === 'input' && (
            <>
              <div className="md:col-span-4 space-y-4">
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-5 backdrop-blur-sm">
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Sparkles size={12} /> Config</h3>
                  <div className="space-y-3">
                    <div className="group">
                      <label htmlFor="date-input" className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block ml-1">Fecha</label>
                      <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 group-focus-within:border-neutral-500 transition-colors">
                        <Calendar size={14} className="text-neutral-400 mr-2"/>
                        <input 
                          id="date-input"
                          type="date" 
                          value={settings.date} 
                          onChange={(e) => setSettings({...settings, date: e.target.value})}
                          className="bg-transparent w-full outline-none text-sm text-white placeholder-neutral-600"
                          style={{ colorScheme: "dark" }}
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label htmlFor="budget-input" className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block ml-1">Budget</label>
                      <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 group-focus-within:border-neutral-500 transition-colors">
                        <DollarSign size={14} className="text-neutral-400 mr-2"/>
                        <input 
                          id="budget-input"
                          type="text" 
                          value={settings.budget} 
                          onChange={(e) => setSettings({...settings, budget: e.target.value})} 
                          className="bg-transparent w-full outline-none text-sm text-white placeholder-neutral-600" 
                          placeholder="..."
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label htmlFor="notes-input" className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block ml-1">Notas</label>
                      <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 group-focus-within:border-neutral-500 transition-colors">
                        <MessageCircle size={14} className="text-neutral-400 mr-2"/>
                        <input 
                          id="notes-input"
                          type="text" 
                          value={settings.details} 
                          onChange={(e) => setSettings({...settings, details: e.target.value})} 
                          className="bg-transparent w-full outline-none text-sm text-white placeholder-neutral-600" 
                          placeholder="..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-8 flex flex-col">
                <div className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-5 flex-1 backdrop-blur-sm flex flex-col">
                  <div className="flex justify-between items-center mb-4"><h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2"><Plus size={12} /> Participantes <span className="bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded text-[10px]">{participants.length}</span></h3></div>
                  <form onSubmit={handleAddName} className="relative mb-6 group"><input type="text" className="w-full bg-neutral-950 border border-neutral-800 text-white text-lg px-4 py-4 rounded-xl outline-none focus:border-white/40 transition-all placeholder-neutral-700" placeholder="Añadir nombre..." value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus /><button type="submit" disabled={!newName.trim()} className="absolute right-2 top-2 bottom-2 aspect-square bg-white text-black rounded-lg flex items-center justify-center hover:bg-neutral-200 disabled:opacity-0 disabled:scale-90 transition-all"><ArrowRight size={20} /></button></form>
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2 max-h-[400px]">
                    {participants.length === 0 ? (<div className="h-full flex flex-col items-center justify-center text-neutral-700 border-2 border-dashed border-neutral-800 rounded-xl min-h-[200px]"><p className="text-sm">La lista está vacía</p></div>) : (participants.map((p, idx) => (
                      <div key={p.id} className="group flex items-center justify-between p-3 bg-neutral-950 border border-neutral-800 rounded-xl hover:border-neutral-600 transition-all animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-400">{idx + 1}</div>
                          <span className="font-medium text-neutral-200">{p.name}</span>
                          {p.pin && <Lock size={12} className="text-yellow-500" />}
                          {p.exclusions.length > 0 && <Ban size={12} className="text-red-500" />}
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setEditingParticipant(p)} className="p-2 text-neutral-600 hover:text-white transition-colors"><Settings size={16} /></button>
                          <button onClick={() => removeParticipant(p.id)} className="p-2 text-neutral-600 hover:text-red-400 transition-colors"><X size={16} /></button>
                        </div>
                      </div>
                    )))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-neutral-800"><button onClick={generatePairs} disabled={participants.length < 3} className="w-full bg-white text-black py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">{participants.length < 3 ? `Faltan ${3 - participants.length} participantes` : 'Generar Sorteo'}{participants.length >= 3 && <ArrowRight size={16} />}</button></div>
                </div>
              </div>
            </>
          )}

          {/* STEP 2: RESULTS */}
          {step === 'result' && (
             <div className="md:col-span-12 flex items-center justify-center py-12 animate-in fade-in duration-700">
               <div className="w-full max-w-md">
                 
                 <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-neutral-900 rounded-2xl border border-neutral-800 mb-6 shadow-xl">
                      <Gift size={32} className="text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">¿Quién eres?</h2>
                    <p className="text-neutral-500 text-sm">Selecciona tu tarjeta para descubrir tu misión.</p>
                 </div>

                 {/* Search & Grid System */}
                 <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative group">
                      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-white transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Buscar mi nombre..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 text-white pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-neutral-600 transition-all placeholder-neutral-600"
                      />
                    </div>

                    {/* Names Grid */}
                    <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                      {participants
                        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .sort((a, b) => {
                          const aViewed = viewedUsers.includes(a.name);
                          const bViewed = viewedUsers.includes(b.name);
                          return aViewed === bViewed ? 0 : aViewed ? 1 : -1;
                        })
                        .map((p) => {
                          const isViewed = viewedUsers.includes(p.name);
                          return (
                            <button
                              key={p.id}
                              disabled={isViewed}
                              onClick={() => handleUserSelection(p)}
                              className={`
                                relative p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between min-h-[100px] group
                                ${isViewed 
                                  ? 'bg-neutral-900/30 border-neutral-800/50 opacity-40 cursor-not-allowed grayscale' 
                                  : 'bg-neutral-900 border-neutral-800 hover:border-white hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.15)] hover:-translate-y-1'
                                }
                              `}
                            >
                              <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-3 transition-colors
                                ${isViewed ? 'bg-neutral-800 text-neutral-600' : 'bg-neutral-800 text-white group-hover:bg-white group-hover:text-black'}
                              `}>
                                {p.name.charAt(0).toUpperCase()}
                              </div>
                              
                              <div>
                                <span className={`block font-bold truncate ${isViewed ? 'text-neutral-600 line-through' : 'text-neutral-200 group-hover:text-white'}`}>
                                  {p.name}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
                                    {isViewed ? 'Completado' : 'Disponible'}
                                  </span>
                                  {p.pin && !isViewed && <Lock size={10} className="text-yellow-500" />}
                                </div>
                              </div>

                              {isViewed && (
                                <div className="absolute top-3 right-3 text-neutral-700">
                                  <Check size={16} />
                                </div>
                              )}
                            </button>
                          )
                        })}
                        
                        {participants.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                          <div className="col-span-2 py-8 text-center text-neutral-500 text-sm border border-dashed border-neutral-800 rounded-2xl">
                            No se encontraron participantes
                          </div>
                        )}
                    </div>
                 </div>

                 {/* Status Text */}
                 <div className="mt-8 text-center">
                   <p className="text-xs text-neutral-600 font-medium uppercase tracking-wider">
                     {viewedUsers.length} de {participants.length} participantes listos
                   </p>
                   <div className="w-full bg-neutral-900 h-1 mt-3 rounded-full overflow-hidden">
                     <div 
                       className="bg-white h-full transition-all duration-1000 ease-out" 
                       style={{ width: `${(viewedUsers.length / participants.length) * 100}%` }}
                     />
                   </div>
                   
                   {viewedUsers.length === participants.length && (
                     <button 
                       onClick={triggerReset}
                       className="mt-6 text-neutral-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500"
                     >
                       <RefreshCw size={14} />
                       Empezar de nuevo
                     </button>
                   )}
                 </div>

               </div>

               {/* Modal Overlay */}
               {selectedUser && (
                 <IndividualModal 
                   user={selectedUser} 
                   onClose={(shouldMark) => {
                      if(shouldMark) markAsViewed(selectedUser);
                      else setSelectedUser(null);
                   }} 
                 />
               )}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
