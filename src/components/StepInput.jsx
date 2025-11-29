import React, { useState } from 'react';
import { Sparkles, Calendar, DollarSign, MessageCircle, Plus, ArrowRight, Settings, X, Ban, Lock } from 'lucide-react';

export const StepInput = ({ settings, setSettings, participants, addParticipant, removeParticipant, setEditingParticipant, generatePairs }) => {
  const [newName, setNewName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addParticipant(newName);
    setNewName('');
  };

  return (
    <>
      <div className="md:col-span-4 space-y-4">
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-5 backdrop-blur-sm">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Sparkles size={12} /> Config</h3>
          <div className="space-y-3">
            {[
              { icon: Calendar, label: 'Fecha', type: 'date', val: settings.date, key: 'date' },
              { icon: DollarSign, label: 'Budget', type: 'text', val: settings.budget, key: 'budget' },
              { icon: MessageCircle, label: 'Notas', type: 'text', val: settings.details, key: 'details' }
            ].map((field, i) => (
              <div key={i} className="group">
                <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block ml-1">{field.label}</label>
                <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 group-focus-within:border-neutral-500 transition-colors">
                  <field.icon size={14} className="text-neutral-400 mr-2"/>
                  <input 
                    type={field.type} value={field.val} 
                    onChange={(e) => setSettings({...settings, [field.key]: e.target.value})}
                    className="bg-transparent w-full outline-none text-sm text-white placeholder-neutral-600"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="md:col-span-8 flex flex-col">
        <div className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-5 flex-1 backdrop-blur-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <Plus size={12} /> Participantes <span className="bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded text-[10px]">{participants.length}</span>
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="relative mb-6 group">
            <input 
              type="text" className="w-full bg-neutral-950 border border-neutral-800 text-white text-lg px-4 py-4 rounded-xl outline-none focus:border-white/40 transition-all placeholder-neutral-700" 
              placeholder="Añadir nombre..." value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus 
            />
            <button type="submit" disabled={!newName.trim()} className="absolute right-2 top-2 bottom-2 aspect-square bg-white text-black rounded-lg flex items-center justify-center hover:bg-neutral-200 disabled:opacity-0 disabled:scale-90 transition-all">
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2 max-h-[400px]">
            {participants.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-neutral-700 border-2 border-dashed border-neutral-800 rounded-xl min-h-[200px]"><p className="text-sm">La lista está vacía</p></div>
            ) : (
              participants.map((p, idx) => (
                <div key={p.id} className="group flex items-center justify-between p-3 bg-neutral-950 border border-neutral-800 rounded-xl hover:border-neutral-600 transition-all animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-400">{idx + 1}</div>
                    <span className="font-medium text-neutral-200">{p.name}</span>
                    {p.pin && <Lock size={12} className="text-yellow-500" title="Tiene PIN" />}
                    {p.exclusions.length > 0 && <Ban size={12} className="text-red-500" title="Tiene exclusiones" />}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditingParticipant(p)} className="p-2 text-neutral-600 hover:text-white transition-colors"><Settings size={16} /></button>
                    <button onClick={() => removeParticipant(p.id)} className="p-2 text-neutral-600 hover:text-red-400 transition-colors"><X size={16} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-6 pt-6 border-t border-neutral-800">
            <button onClick={generatePairs} disabled={participants.length < 3} className="w-full bg-white text-black py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
              {participants.length < 3 ? `Faltan ${3 - participants.length} participantes` : 'Generar Sorteo'}
              {participants.length >= 3 && <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
