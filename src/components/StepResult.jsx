import React, { useState, useEffect } from 'react';
import { Gift, Lock, Mail, Check, ArrowRight, RefreshCw, Search, Share2, Copy, X, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/sound';

const IndividualModal = ({ user, assignment, settings, onClose, soundEnabled }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  
  const formatDate = (d) => {
    try { return new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }); } catch { return d; }
  };

  const generateShareText = () => {
    return `🤫 *AMIGO INVISIBLE*\n\n👤 Para: *${user}*\n🎁 Te toca regalar a: *${assignment}*\n\n📅 Fecha: ${formatDate(settings.date)}\n💰 Presupuesto: ${settings.budget}\n📝 Notas: ${settings.details || 'Sin notas'}\n\n¡Guarda este mensaje y no se lo digas a nadie!`;
  };

  const handleShare = async () => {
    const text = generateShareText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mi Amigo Invisible',
          text: text,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Copiado al portapapeles');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 flex flex-col items-center text-center min-h-[450px] justify-between relative">
          <button onClick={() => onClose(false)} className="absolute top-4 right-4 p-2 text-neutral-600 hover:text-white"><X size={24} /></button>
          
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
                   <span className="relative z-10 text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-neutral-400 drop-shadow-sm">{assignment}</span>
                </div>
                <div className="flex flex-col gap-1 text-neutral-500 text-xs font-medium mb-6">
                  <p>💰 {settings.budget}</p>
                  <p>📅 {formatDate(settings.date)}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 w-full mb-2">
                    <a 
                      href={`https://wa.me/?text=${encodeURIComponent(generateShareText())}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-xl transition-colors gap-1"
                      onClick={() => playSound('click', soundEnabled)}
                    >
                        <MessageCircle size={20} />
                        <span className="text-[10px] font-bold uppercase">WhatsApp</span>
                    </a>
                    <a 
                      href={`mailto:?subject=Mi Amigo Invisible&body=${encodeURIComponent(generateShareText())}`}
                      className="flex flex-col items-center justify-center p-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-colors gap-1"
                      onClick={() => playSound('click', soundEnabled)}
                    >
                        <Mail size={20} />
                        <span className="text-[10px] font-bold uppercase">Email</span>
                    </a>
                    <button 
                      onClick={() => { handleShare(); playSound('click', soundEnabled); }}
                      className="flex flex-col items-center justify-center p-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-xl transition-colors gap-1"
                    >
                        {navigator.share ? <Share2 size={20} /> : <Copy size={20} />}
                        <span className="text-[10px] font-bold uppercase">{navigator.share ? 'Compartir' : 'Copiar'}</span>
                    </button>
                </div>
                <p className="text-[10px] text-neutral-600 mb-4">Guarda tu resultado para no olvidarlo</p>
              </div>
            ) : (
              <button onClick={() => { playSound('pop', soundEnabled); setIsRevealed(true); confetti({ spread: 360, particleCount: 100, origin: { y: 0.6 } }); }} className="group relative w-full py-4 bg-white text-black rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-neutral-200 transition-all overflow-hidden">
                <span className="relative z-10 flex items-center justify-center gap-2"><Gift size={18} className="group-hover:-rotate-12 transition-transform" /> Ver Misión</span>
              </button>
            )}
          </div>

          <div className="w-full pt-4">
            {isRevealed && (
              <button onClick={() => onClose(true)} className="w-full py-4 rounded-xl bg-neutral-800 text-white font-bold text-sm hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-2"><Check size={18} /> Entendido</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PinModal = ({ user, onClose, onSuccess, soundEnabled }) => {
  const [pin, setPin] = useState('');
  
  const verify = (e) => {
    e.preventDefault();
    if (user.pin === pin) onSuccess();
    else {
      alert('PIN Incorrecto');
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xs bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-center">
        <Lock size={24} className="mx-auto mb-4 text-white" />
        <h3 className="text-lg font-bold text-white mb-2">Introduce el PIN</h3>
        <form onSubmit={verify}>
          <input 
            type="password" autoFocus maxLength="4" value={pin} onChange={(e) => setPin(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-4 text-white text-2xl text-center outline-none font-mono tracking-[0.5em] mb-6"
          />
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-neutral-800 text-white text-sm">Cancelar</button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-white text-black font-bold text-sm">Ver</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const StepResult = ({ 
  participants, 
  assignments, 
  settings, 
  onReset, 
  getShareLink,
  isSharedMode,
  soundEnabled 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [pendingUser, setPendingUser] = useState(null);
  const [copied, setCopied] = useState(null); // Stores ID of copied user link or 'all'

  // Auto-select user if URL param exists
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('u');
    if (userId && isSharedMode) {
      const user = participants.find(p => p.id === userId);
      if (user) {
        handleUserClick(user);
      }
    }
  }, [isSharedMode, participants]);

  const handleUserClick = (p) => {
    playSound('click', soundEnabled);
    if (p.pin) {
      setPendingUser(p);
    } else {
      setSelectedUser(p);
    }
  };

  const handlePinSuccess = () => {
    playSound('success', soundEnabled);
    setSelectedUser(pendingUser);
    setPendingUser(null);
  };

  const copyLink = (userId = null) => {
    const link = getShareLink(userId);
    navigator.clipboard.writeText(link);
    setCopied(userId || 'all');
    setTimeout(() => setCopied(null), 2000);
    playSound('success', soundEnabled);
  };

  // If in shared mode and no specific user selected, show search
  // If organizer mode, show list with copy buttons
  return (
    <div className="md:col-span-12 flex items-center justify-center py-12 animate-in fade-in duration-700">
      {selectedUser && (
        <IndividualModal 
          user={selectedUser.name} 
          assignment={assignments[selectedUser.name]} 
          settings={settings} 
          onClose={() => setSelectedUser(null)} 
          soundEnabled={soundEnabled} 
        />
      )}
      
      {pendingUser && (
        <PinModal 
          user={pendingUser} 
          onClose={() => setPendingUser(null)} 
          onSuccess={handlePinSuccess} 
          soundEnabled={soundEnabled} 
        />
      )}

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-neutral-900 rounded-2xl border border-neutral-800 mb-6 shadow-xl"><Gift size={32} className="text-white" /></div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
            {isSharedMode ? '¿Quién eres?' : 'Sorteo Generado'}
          </h2>
          <p className="text-neutral-500 text-sm mb-6">
            {isSharedMode 
              ? 'Busca tu nombre para descubrir tu misión.' 
              : 'Comparte el enlace general o envía uno individual a cada persona.'}
          </p>
          
          {!isSharedMode && (
            <button onClick={() => copyLink(null)} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-wider transition-all hover:bg-neutral-200 shadow-lg shadow-white/10 mb-8">
              {copied === 'all' ? <Check size={16} /> : <Share2 size={16} />}
              {copied === 'all' ? 'Enlace General Copiado' : 'Copiar Enlace General'}
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Search only visible in shared mode or if organizer wants to filter */}
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              placeholder={isSharedMode ? "Escribe tu nombre..." : "Buscar participante..."} 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full bg-neutral-900 border border-neutral-800 text-white pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-neutral-600 transition-all placeholder-neutral-600" 
            />
          </div>

          {/* List Logic: 
              - Shared Mode: Only show list IF searchTerm has content (Privacy)
              - Organizer Mode: Always show list
          */}
          {(searchTerm || !isSharedMode) && (
            <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
              {participants.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((p) => (
                  <div key={p.id} className="group flex items-center justify-between p-3 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-neutral-800 text-white">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-neutral-200">{p.name}</span>
                      {p.pin && <Lock size={12} className="text-yellow-500" />}
                    </div>
                    
                    {isSharedMode ? (
                      <button onClick={() => handleUserClick(p)} className="px-4 py-2 bg-neutral-800 hover:bg-white hover:text-black text-white text-xs font-bold rounded-lg transition-colors">
                        Ver Misión
                      </button>
                    ) : (
                      <button onClick={() => copyLink(p.id)} className="flex items-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white text-xs font-medium rounded-lg transition-colors">
                        {copied === p.id ? <Check size={14} /> : <Copy size={14} />}
                        {copied === p.id ? 'Copiado' : 'Copiar Enlace'}
                      </button>
                    )}
                  </div>
                ))}
                {participants.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                  <div className="py-8 text-center text-neutral-500 text-sm border border-dashed border-neutral-800 rounded-2xl">
                    No se encontraron participantes
                  </div>
                )}
            </div>
          )}
          
          {isSharedMode && !searchTerm && (
            <div className="py-12 text-center text-neutral-600 text-sm italic">
              Escribe tu nombre arriba para continuar...
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          {!isSharedMode && (
            <button onClick={onReset} className="mt-6 text-neutral-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500"><RefreshCw size={14} /> Empezar de nuevo</button>
          )}
        </div>
      </div>
    </div>
  );
};

