'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Users, X } from 'lucide-react';
import socketService from '@/lib/socket';

interface Message {
  userId: string;
  message: string;
  timestamp?: Date;
}

interface LiveChatProps {
  isVisible: boolean;
  onClose: () => void;
  userId: string;
}

const LiveChat: React.FC<LiveChatProps> = ({ isVisible, onClose, userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    // Écouter les nouveaux messages
    socketService.onNewMessage((message: Message) => {
      setMessages(prev => [...prev, { ...message, timestamp: new Date() }]);
    });

    return () => {
      // Cleanup handled by service
    };
  }, [isVisible]);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    socketService.sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed right-4 bottom-4 z-50 w-80 h-96"
      >
        <Card className="h-full bg-black/90 border-primary/30 text-white flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary" />
                Chat en Direct
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0 hover:bg-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Users className="w-3 h-3" />
              <span>Connecté</span>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-3 pt-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-2 mb-3 pr-2">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-2 rounded-lg text-sm ${
                      msg.userId === userId 
                        ? 'bg-primary/20 ml-4 border-l-2 border-primary' 
                        : 'bg-gray-800/50 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium ${
                        msg.userId === userId ? 'text-primary' : 'text-gray-400'
                      }`}>
                        {msg.userId === userId ? 'Vous' : msg.userId}
                      </span>
                      {msg.timestamp && (
                        <span className="text-xs text-gray-500">
                          {formatTime(msg.timestamp)}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-200">{msg.message}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {messages.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-8">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Aucun message pour le moment</p>
                  <p className="text-xs mt-1">Soyez le premier à commencer la conversation !</p>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie */}
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                className="flex-1 bg-black/50 border-primary/30 text-white placeholder-gray-400 text-sm"
                maxLength={200}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                size="sm"
                className="bg-primary hover:bg-primary/80 px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Compteur de caractères */}
            <div className="text-xs text-gray-500 mt-1 text-right">
              {inputMessage.length}/200
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default LiveChat; 