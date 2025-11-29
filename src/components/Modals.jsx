import React, { useState } from 'react';
import { Settings, Lock, Ban, X, Mail } from 'lucide-react';

export const ParticipantSettingsModal = ({ participant, participants, onUpdate, onClose }) => {
  if (!participant) return null;
  
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings size={18} /> Configurar {participant.name}
          </h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-white"><X size={20} /></button>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
              <Mail size={12} /> Email (Opcional)
            </label>
            <input 
              type="email" placeholder="correo@ejemplo.com" value={participant.email || ''}
              onChange={(e) => onUpdate(participant.id, { email: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-white/40 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
              <Lock size={12} /> PIN de Seguridad
            </label>
            <input 
              type="text" maxLength="4" placeholder="Sin PIN" value={participant.pin}
              onChange={(e) => onUpdate(participant.id, { pin: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white outline-none focus:border-white/40 font-mono text-center tracking-widest"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
              <Ban size={12} /> Exclusiones (A quién NO puede regalar)
            </label>
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-2 max-h-[150px] overflow-y-auto custom-scrollbar">
              {participants.filter(p => p.id !== participant.id).map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    const current = participant.exclusions || [];
                    const newExclusions = current.includes(p.id) ? current.filter(id => id !== p.id) : [...current, p.id];
                    onUpdate(participant.id, { exclusions: newExclusions });
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg mb-1 text-sm transition-colors ${participant.exclusions?.includes(p.id) ? 'bg-red-500/10 text-red-400' : 'hover:bg-neutral-800 text-neutral-400'}`}
                >
                  <span>{p.name}</span>
                  {participant.exclusions?.includes(p.id) && <Ban size={14} />}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-neutral-800">
          <button onClick={onClose} className="w-full py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-neutral-200">Guardar</button>
        </div>
      </div>
    </div>
  );
};

export const PinModal = ({ user, onClose, onSuccess, soundEnabled }) => {
  const [pin, setPin] = useState('');
  
  const verify = () => {
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
        <input 
          type="password" autoFocus maxLength="4" value={pin} onChange={(e) => setPin(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-4 text-white text-2xl text-center outline-none font-mono tracking-[0.5em] mb-6"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-neutral-800 text-white text-sm">Cancelar</button>
          <button onClick={verify} className="flex-1 py-3 rounded-xl bg-white text-black font-bold text-sm">Ver</button>
        </div>
      </div>
    </div>
  );
};

export const ResetModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
    <div className="w-full max-w-xs bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-center">
      <h3 className="text-lg font-bold text-white mb-2">¿Reiniciar todo?</h3>
      <p className="text-neutral-400 text-sm mb-4">Se borrarán todos los datos.</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-neutral-800 text-white text-sm">Cancelar</button>
        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm">Reiniciar</button>
      </div>
    </div>
  </div>
);
