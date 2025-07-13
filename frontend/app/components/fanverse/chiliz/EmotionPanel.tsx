'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Zap, Frown, Smile, AlertCircle, Angry } from 'lucide-react';
import socketService from '@/lib/socket';

interface EmotionData {
  anger: number;
  surprise: number;
  joy: number;
  hype: number;
  fear: number;
  sadness: number;
}

interface EmotionPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

const EmotionPanel: React.FC<EmotionPanelProps> = ({ isVisible, onClose }) => {
  const [emotions, setEmotions] = useState<EmotionData>({
    anger: 0,
    surprise: 0,
    joy: 0,
    hype: 0,
    fear: 0,
    sadness: 0
  });
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [emotionCooldown, setEmotionCooldown] = useState(false);

  const emotionConfig = [
    { 
      key: 'joy', 
      icon: Smile, 
      label: 'Joie', 
      color: 'text-yellow-400', 
      bgColor: 'bg-yellow-400/20',
      emoji: '😊'
    },
    { 
      key: 'hype', 
      icon: Zap, 
      label: 'Hype', 
      color: 'text-purple-400', 
      bgColor: 'bg-purple-400/20',
      emoji: '🔥'
    },
    { 
      key: 'surprise', 
      icon: AlertCircle, 
      label: 'Surprise', 
      color: 'text-blue-400', 
      bgColor: 'bg-blue-400/20',
      emoji: '😮'
    },
    { 
      key: 'anger', 
      icon: Angry, 
      label: 'Colère', 
      color: 'text-red-400', 
      bgColor: 'bg-red-400/20',
      emoji: '😠'
    },
    { 
      key: 'fear', 
      icon: Frown, 
      label: 'Peur', 
      color: 'text-gray-400', 
      bgColor: 'bg-gray-400/20',
      emoji: '😰'
    },
    { 
      key: 'sadness', 
      icon: Heart, 
      label: 'Tristesse', 
      color: 'text-indigo-400', 
      bgColor: 'bg-indigo-400/20',
      emoji: '😢'
    }
  ];

  useEffect(() => {
    if (!isVisible) return;

    socketService.onEmotionUpdate((data: EmotionData) => {
      setEmotions(data);
    });

    return () => {
      // Cleanup handled by service
    };
  }, [isVisible]);

  const handleEmotionClick = (emotionKey: string) => {
    if (emotionCooldown) return;

    setSelectedEmotion(emotionKey);
    socketService.sendEmotion(emotionKey);
    
    // Cooldown de 2 secondes
    setEmotionCooldown(true);
    setTimeout(() => {
      setEmotionCooldown(false);
      setSelectedEmotion(null);
    }, 2000);
  };

  const getTotalEmotions = () => {
    return Object.values(emotions).reduce((sum, count) => sum + count, 0);
  };

  const getEmotionPercentage = (count: number) => {
    const total = getTotalEmotions();
    return total > 0 ? (count / total) * 100 : 0;
  };

  const getDominantEmotion = () => {
    const entries = Object.entries(emotions);
    const maxEntry = entries.reduce((max, current) => 
      current[1] > max[1] ? current : max
    );
    return maxEntry[0];
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
          <Card className="bg-black/80 border-primary/30 text-white">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Émotions du Public
              </CardTitle>
              <div className="text-sm text-gray-300">
                {getTotalEmotions()} émotions exprimées
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Visualisation des émotions */}
              <div className="space-y-3">
                <h3 className="font-semibold text-center">État Émotionnel Actuel</h3>
                <div className="grid grid-cols-2 gap-3">
                  {emotionConfig.map((emotion) => {
                    const count = emotions[emotion.key as keyof EmotionData];
                    const percentage = getEmotionPercentage(count);
                    const isDominant = getDominantEmotion() === emotion.key && getTotalEmotions() > 0;
                    
                    return (
                      <motion.div
                        key={emotion.key}
                        className={`p-3 rounded-lg border transition-all ${
                          isDominant 
                            ? `${emotion.bgColor} border-current` 
                            : 'bg-black/30 border-gray-600'
                        }`}
                        animate={isDominant ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{emotion.emoji}</span>
                            <span className={`text-sm ${emotion.color}`}>
                              {emotion.label}
                            </span>
                          </div>
                          <Badge variant="secondary" className="bg-black/50">
                            {count}
                          </Badge>
                        </div>
                        
                        {/* Barre de progression */}
                        <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${emotion.bgColor.replace('/20', '/60')}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        
                        <div className="text-xs text-gray-400 mt-1">
                          {percentage.toFixed(1)}%
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Boutons d'émotions */}
              <div className="space-y-3">
                <h3 className="font-semibold text-center">Exprimez votre émotion</h3>
                <div className="grid grid-cols-3 gap-3">
                  {emotionConfig.map((emotion) => {
                    const IconComponent = emotion.icon;
                    const isSelected = selectedEmotion === emotion.key;
                    
                    return (
                      <Button
                        key={emotion.key}
                        variant={isSelected ? "default" : "outline"}
                        className={`h-16 flex-col gap-1 ${
                          isSelected 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-transparent border-primary/30 hover:border-primary/50'
                        }`}
                        onClick={() => handleEmotionClick(emotion.key)}
                        disabled={emotionCooldown}
                      >
                        <motion.div
                          animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          <IconComponent className="w-5 h-5" />
                        </motion.div>
                        <span className="text-xs">{emotion.label}</span>
                      </Button>
                    );
                  })}
                </div>
                
                {emotionCooldown && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-sm text-gray-400"
                  >
                    Attendez avant d'exprimer une nouvelle émotion...
                  </motion.div>
                )}
              </div>

              {/* Émotion dominante */}
              {getTotalEmotions() > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-center"
                >
                  <h4 className="font-semibold mb-2">Émotion Dominante</h4>
                  <div className="flex items-center justify-center gap-2">
                    {(() => {
                      const dominantConfig = emotionConfig.find(e => e.key === getDominantEmotion());
                      return dominantConfig ? (
                        <>
                          <span className="text-2xl">{dominantConfig.emoji}</span>
                          <span className={`font-semibold ${dominantConfig.color}`}>
                            {dominantConfig.label}
                          </span>
                        </>
                      ) : null;
                    })()}
                  </div>
                </motion.div>
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

export default EmotionPanel; 