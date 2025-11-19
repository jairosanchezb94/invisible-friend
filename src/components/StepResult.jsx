import React, { useState } from 'react';
import { Gift, Search, Check, Lock, RefreshCw, Share2, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/sound';

const IndividualModal = ({ user, assignment, settings, onClose, soundEnabled }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  
  const formatDate = (d) => {
    try { return new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }); } catch { return d; }
  };

  const generateWhatsAppLink = () => {
    const text = `\u2728 *INVISIBLE FRIEND* \u2728\n\n\uD83D\uDC64 Para: *${user}*\n\uD83C\uDF81 Te toca regalar a: *${assignment}*\n\n\uD83D\uDCC5 ${formatDate(settings.date)}\n\uD83D\uDCB0 Presupuesto: ${settings.budget}\n\uD83D\uDCDD Notas: ${settings.details}\n\n\uD83E\uDD2B _Mantén el secreto_`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
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
                <div className="flex flex-col gap-1 text-neutral-500 text-xs font-medium mb-4">
                  <p>💰 {settings.budget}</p>
                  <p>📅 {formatDate(settings.date)}</p>
                </div>
                <a href={generateWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2 text-xs uppercase tracking-widest"><Share2 size={14} /> Guardar Misión</a>
              </div>
            ) : (
              <button onClick={() => { playSound('pop', soundEnabled); setIsRevealed(true); confetti({ spread: 360, particleCount: 100, origin: { y: 0.6 } }); }} className="group relative w-full py-4 bg-white text-black rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-neutral-200 transition-all overflow-hidden">
                <span className="relative z-10 flex items-center justify-center gap-2"><Gift size={18} className="group-hover:-rotate-12 transition-transform" /> Ver Misión</span>
              </button>
            )}
          </div>

          <div className="w-full pt-8">
            {isRevealed && (
              <button onClick={() => onClose(true)} className="w-full py-4 rounded-xl bg-neutral-800 text-white font-bold text-sm hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-2"><Check size={18} /> Entendido, finalizar turno</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const StepResult = ({ participants, viewedUsers, onSelectUser, onReset }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="md:col-span-12 flex items-center justify-center py-12 animate-in fade-in duration-700">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-neutral-900 rounded-2xl border border-neutral-800 mb-6 shadow-xl"><Gift size={32} className="text-white" /></div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">¿Quién eres?</h2>
          <p className="text-neutral-500 text-sm">Selecciona tu tarjeta para descubrir tu misión.</p>
        </div>

        <div className="space-y-4">
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-white transition-colors" />
            <input type="text" placeholder="Buscar mi nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 text-white pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-neutral-600 transition-all placeholder-neutral-600" />
          </div>

          <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
            {participants.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .sort((a, b) => {
                const aViewed = viewedUsers.includes(a.name);
                const bViewed = viewedUsers.includes(b.name);
                return aViewed === bViewed ? 0 : aViewed ? 1 : -1;
              })
              .map((p) => {
                const isViewed = viewedUsers.includes(p.name);
                return (
                  <button key={p.id} disabled={isViewed} onClick={() => onSelectUser(p)} className={`relative p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between min-h-[100px] group ${isViewed ? 'bg-neutral-900/30 border-neutral-800/50 opacity-40 cursor-not-allowed grayscale' : 'bg-neutral-900 border-neutral-800 hover:border-white hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.15)] hover:-translate-y-1'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-3 transition-colors ${isViewed ? 'bg-neutral-800 text-neutral-600' : 'bg-neutral-800 text-white group-hover:bg-white group-hover:text-black'}`}>{p.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <span className={`block font-bold truncate ${isViewed ? 'text-neutral-600 line-through' : 'text-neutral-200 group-hover:text-white'}`}>{p.name}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">{isViewed ? 'Completado' : 'Disponible'}</span>
                        {p.pin && !isViewed && <Lock size={10} className="text-yellow-500" />}
                      </div>
                    </div>
                    {isViewed && <div className="absolute top-3 right-3 text-neutral-700"><Check size={16} /></div>}
                  </button>
                )
              })}
              {participants.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && <div className="col-span-2 py-8 text-center text-neutral-500 text-sm border border-dashed border-neutral-800 rounded-2xl">No se encontraron participantes</div>}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-600 font-medium uppercase tracking-wider">{viewedUsers.length} de {participants.length} participantes listos</p>
          <div className="w-full bg-neutral-900 h-1 mt-3 rounded-full overflow-hidden"><div className="bg-white h-full transition-all duration-1000 ease-out" style={{ width: `${(viewedUsers.length / participants.length) * 100}%` }} /></div>
          {viewedUsers.length === participants.length && (
            <button onClick={onReset} className="mt-6 text-neutral-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500"><RefreshCw size={14} /> Empezar de nuevo</button>
          )}
        </div>
      </div>
    </div>
  );
};

export { IndividualModal };
