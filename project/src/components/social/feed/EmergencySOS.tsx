import React, { useState } from 'react';
import { Phone, Camera, Mic, MessageSquare, AlertTriangle, X } from 'lucide-react';

export const EmergencySOS = () => {
  const [recording, setRecording] = useState(false);
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);
  const [message, setMessage] = useState('');

  const emergencyContacts = [
    { name: 'Local Police', number: '911' },
    { name: 'Fire Department', number: '911' },
    { name: 'Emergency Medical', number: '911' },
    { name: 'Emergency Contact 1', number: '+1234567890' },
    { name: 'Emergency Contact 2', number: '+0987654321' }
  ];

  const handleSendSOS = () => {
    // Handle SOS sending logic
    console.log('SOS sent');
  };

  return (
    <div className="space-y-6">
      {/* Emergency Banner */}
      <div className="bg-black/20 border border-white/20 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-white animate-pulse" />
          <h2 className="text-xl text-white">Emergency SOS</h2>
        </div>
        <p className="text-white/70">
          Use this feature in case of emergency. Your location and selected information will be sent to emergency services or your emergency contacts.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center space-x-3 p-6 bg-black/20 border border-white/20 rounded-lg hover:bg-black/40 transition-all">
          <Phone className="w-6 h-6 text-white" />
          <span className="text-white">Silent Call</span>
        </button>
        <button className="flex items-center justify-center space-x-3 p-6 bg-black/20 border border-white/20 rounded-lg hover:bg-black/40 transition-all">
          <Camera className="w-6 h-6 text-white" />
          <span className="text-white">Quick Photo</span>
        </button>
        <button 
          className={`flex items-center justify-center space-x-3 p-6 border rounded-lg transition-all ${
            recording
              ? 'bg-black/40 border-white/40'
              : 'bg-black/20 border-white/20 hover:bg-black/40'
          }`}
          onClick={() => setRecording(!recording)}
        >
          <Mic className={`w-6 h-6 ${recording ? 'text-white animate-pulse' : 'text-white'}`} />
          <span className="text-white">
            {recording ? 'Recording...' : 'Voice Record'}
          </span>
        </button>
        <button 
          className="flex items-center justify-center space-x-3 p-6 bg-black/20 border border-white/20 rounded-lg hover:bg-black/40 transition-all"
          onClick={() => setShowEmergencyContacts(!showEmergencyContacts)}
        >
          <MessageSquare className="w-6 h-6 text-white" />
          <span className="text-white">Quick Message</span>
        </button>
      </div>

      {/* Emergency Contacts */}
      {showEmergencyContacts && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-black rounded-lg p-6 w-full max-w-md border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl text-white">Emergency Contacts</h3>
              <button onClick={() => setShowEmergencyContacts(false)}>
                <X className="w-5 h-5 text-white/60 hover:text-white" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              {emergencyContacts.map((contact, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between p-4 bg-black/40 rounded-lg hover:bg-black/60 transition-colors border border-white/10"
                >
                  <div>
                    <div className="text-white">{contact.name}</div>
                    <div className="text-white/60 text-sm">{contact.number}</div>
                  </div>
                  <Phone className="w-5 h-5 text-white/60" />
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your emergency message..."
                className="w-full h-32 bg-black/40 border border-white/20 rounded-lg p-4 text-white placeholder-white/40 resize-none focus:border-white/40 transition-colors"
              />
              <button
                onClick={handleSendSOS}
                className="w-full py-3 bg-black/40 text-white border border-white/20 rounded-lg hover:bg-black/60 transition-colors"
              >
                Send SOS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};