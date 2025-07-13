'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Timer, TrendingUp, Coins, Users, Zap } from 'lucide-react';
import socketService from '@/lib/socket';

interface BetData {
  question: string;
  options: string[];
  duration: number;
}

interface BettingPanelProps {
  isVisible: boolean;
  onClose: () => void;
  userBalance: number;
  onBalanceUpdate: (newBalance: number) => void;
}

const BettingPanel: React.FC<BettingPanelProps> = ({ 
  isVisible, 
  onClose, 
  userBalance, 
  onBalanceUpdate 
}) => {
  const [currentBet, setCurrentBet] = useState<BetData | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [betStatus, setBetStatus] = useState<'idle' | 'betting' | 'waiting' | 'result'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info');
  const [isPlacingBet, setIsPlacingBet] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    // Écouter les événements de paris
    socketService.onNewBet((bet: BetData) => {
      setCurrentBet(bet);
      setTimeRemaining(bet.duration);
      setBetStatus('betting');
      setSelectedOption(null);
      setBetAmount('');
      setStatusMessage('');
      setIsPlacingBet(false);
    });

    socketService.onBetAccepted((data: any) => {
      setBetStatus('waiting');
      setStatusMessage(data.message);
      setMessageType('success');
      onBalanceUpdate(data.newBalance);
      setIsPlacingBet(false);
    });

    socketService.onBetError((data: any) => {
      setStatusMessage(data.message);
      setMessageType('error');
      setIsPlacingBet(false);
    });

    socketService.onBetClosed((data: any) => {
      setBetStatus('result');
      setStatusMessage(data.message);
      setMessageType('info');
      setTimeRemaining(0);
    });

    socketService.onBetResult((data: any) => {
      setStatusMessage(data.message);
      setMessageType(data.winnings > 0 ? 'success' : 'error');
      onBalanceUpdate(data.newBalance);
      
      // Retour à l'état idle après 5 secondes
      setTimeout(() => {
        setBetStatus('idle');
        setStatusMessage('En attente du prochain pari...');
        setMessageType('info');
      }, 5000);
    });

    return () => {
      // Nettoyer les listeners (optionnel car le service gère déjà)
    };
  }, [isVisible, onBalanceUpdate]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && betStatus === 'betting') {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1000) {
            setBetStatus('waiting');
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, betStatus]);

  const handlePlaceBet = () => {
    if (selectedOption === null || !betAmount || isPlacingBet) return;

    const amount = parseInt(betAmount);
    if (isNaN(amount) || amount <= 0) {
      setStatusMessage('Montant invalide');
      setMessageType('error');
      return;
    }

    if (amount > userBalance) {
      setStatusMessage('Solde insuffisant');
      setMessageType('error');
      return;
    }

    setIsPlacingBet(true);
    socketService.placeBet(selectedOption, amount);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    switch (messageType) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          exit={{ y: 50 }}
          className="w-full max-w-lg mx-4"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <Card className="bg-gradient-to-br from-black/90 to-gray-900/90 border-primary/30 text-white shadow-2xl">
            <CardHeader className="text-center border-b border-primary/20">
              <CardTitle className="flex items-center justify-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                Paris en Direct
              </CardTitle>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-300 mt-2">
                <div className="flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full">
                  <Coins className="w-4 h-4 text-primary" />
                  <span className="font-semibold">{userBalance.toFixed(2)} CHZ</span>
                </div>
                {timeRemaining > 0 && (
                  <div className="flex items-center gap-2 bg-primary/20 px-3 py-1 rounded-full">
                    <Timer className="w-4 h-4 text-primary" />
                    <span className="font-mono text-primary">{formatTime(timeRemaining)}</span>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Question du pari */}
              {currentBet && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <h3 className="font-semibold text-center mb-3">
                    {currentBet.question}
                  </h3>
                  
                  {/* Options de pari */}
                  <div className="space-y-2">
                    {currentBet.options.map((option, index) => (
                      <Button
                        key={index}
                        variant={selectedOption === index ? "default" : "outline"}
                        className={`w-full justify-start ${
                          selectedOption === index 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-transparent border-primary/30 hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedOption(index)}
                        disabled={betStatus !== 'betting' || isPlacingBet}
                      >
                        <span className="flex-1 text-left">{option}</span>
                        {selectedOption === index && (
                          <Zap className="w-4 h-4 ml-2" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Montant du pari */}
              {betStatus === 'betting' && selectedOption !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium">Montant (CHZ)</label>
                  <Input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    placeholder="Montant à parier"
                    className="bg-black/50 border-primary/30 text-white"
                    min="1"
                    max={userBalance}
                    disabled={isPlacingBet}
                  />
                  <div className="flex gap-2">
                    {[5, 10, 25, 50].map(amount => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setBetAmount(amount.toString())}
                        disabled={amount > userBalance || isPlacingBet}
                        className="flex-1 bg-transparent border-primary/30 hover:border-primary/50"
                      >
                        {amount}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Bouton de pari */}
              {betStatus === 'betting' && selectedOption !== null && betAmount && (
                <Button
                  onClick={handlePlaceBet}
                  disabled={isPlacingBet || timeRemaining <= 0}
                  className="w-full bg-primary hover:bg-primary/80"
                >
                  {isPlacingBet ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Placer le pari
                    </>
                  )}
                </Button>
              )}

              {/* Message de statut */}
              {statusMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-center p-3 rounded-lg bg-black/50 ${getStatusColor()}`}
                >
                  {statusMessage}
                </motion.div>
              )}

              {/* État d'attente */}
              {betStatus === 'idle' && (
                <div className="text-center py-8 text-gray-400">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>En attente du prochain pari...</p>
                </div>
              )}

              {/* Bouton fermer */}
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full bg-transparent border-gray-600 hover:border-gray-500"
              >
                Fermer
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BettingPanel; 