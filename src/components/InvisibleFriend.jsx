import React, { useState } from 'react';
import { Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { useInvisibleFriend } from '../hooks/useInvisibleFriend';
import { StepInput } from './StepInput';
import { StepResult } from './StepResult';
import { ParticipantSettingsModal, PinModal, ResetModal } from './Modals';
import { playSound } from '../utils/sound';

const App = () => {
  const { state, actions } = useInvisibleFriend();
  const { participants, step, assignments, viewedUsers, settings, soundEnabled } = state;
  
  // UI Local State
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelection = (participant) => {
    // Deprecated in turn-based mode but kept for compatibility if needed
    playSound('click', soundEnabled);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-white selection:text-black flex items-center justify-center p-4 md:p-8">
      {showResetConfirm && <ResetModal onConfirm={() => { actions.resetGame(); setShowResetConfirm(false); }} onCancel={() => setShowResetConfirm(false)} />}
      {editingParticipant && <ParticipantSettingsModal participant={editingParticipant} participants={participants} onUpdate={actions.updateParticipant} onClose={() => setEditingParticipant(null)} />}
      
      <div className="w-full max-w-3xl grid grid-cols-1 gap-6">
        <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">Invisible<span className="text-neutral-600">.</span></h1>
            <p className="text-neutral-500 text-sm font-medium mt-1 tracking-wide">MINIMALIST GIFT EXCHANGE</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => actions.setSoundEnabled(!soundEnabled)} className={`p-2 rounded-full border transition-all ${soundEnabled ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-transparent border-transparent text-neutral-600'}`}>
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            {(step === 'result' || participants.length > 0) && (
              <button onClick={() => setShowResetConfirm(true)} className="p-2 bg-neutral-900 rounded-full border border-neutral-800 hover:border-neutral-600 transition-all text-neutral-400 hover:text-red-400">
                <RefreshCw size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[400px]">
          {step === 'input' && (
            <StepInput 
              settings={settings} setSettings={actions.setSettings}
              participants={participants} 
              addParticipant={actions.addParticipant} 
              removeParticipant={actions.removeParticipant}
              setEditingParticipant={setEditingParticipant}
              generatePairs={actions.generatePairs}
            />
          )}
          {step === 'result' && (
            <StepResult 
              participants={participants} 
              assignments={assignments} 
              viewedUsers={viewedUsers} 
              settings={settings}
              onSelectUser={handleUserSelection}
              onReset={() => setShowResetConfirm(true)}
              onSendEmails={actions.sendResultsByEmail}
              onUpdateParticipant={actions.updateParticipant}
              onSendNotification={actions.sendNotification}
              onMarkAsViewed={(name) => actions.setViewedUsers([...viewedUsers, name])}
              getShareLink={actions.getShareLink}
              isSharedMode={state.isSharedMode}
              soundEnabled={soundEnabled}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
