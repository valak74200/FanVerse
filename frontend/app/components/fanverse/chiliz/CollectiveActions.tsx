'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, ThumbsUp, ThumbsDown, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import socketService from '@/lib/socket';

interface CollectiveAction {
  _id: string;
  action: string;
  proposer: string;
  yesVotes: number;
  noVotes: number;
  voters: string[];
  status: 'active' | 'success' | 'failed';
  createdAt: Date;
}

interface CollectiveActionsProps {
  isVisible: boolean;
  onClose: () => void;
  userId: string;
}

const CollectiveActions: React.FC<CollectiveActionsProps> = ({ isVisible, onClose, userId }) => {
  const [actions, setActions] = useState<CollectiveAction[]>([]);
  const [newAction, setNewAction] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!isVisible || !socketService.socket) return;

    // Écouter les événements d'actions collectives
    socketService.socket.on('new_action', (action: CollectiveAction) => {
      setActions(prev => [action, ...prev]);
    });

    socketService.socket.on('action_update', (updatedAction: CollectiveAction) => {
      setActions(prev => prev.map(action => 
        action._id === updatedAction._id ? updatedAction : action
      ));
    });

    socketService.socket.on('action_result', (result: any) => {
      setActions(prev => prev.map(action => 
        action._id === result.actionId 
          ? { ...action, status: result.status, yesVotes: result.yes, noVotes: result.no }
          : action
      ));
    });

    socketService.socket.on('action_error', (error: any) => {
      console.error('Erreur action:', error.message);
    });

    return () => {
      if (socketService.socket) {
        socketService.socket.off('new_action');
        socketService.socket.off('action_update');
        socketService.socket.off('action_result');
        socketService.socket.off('action_error');
      }
    };
  }, [isVisible]);

  const handleCreateAction = () => {
    if (!newAction.trim() || isCreating || !socketService.socket) return;

    setIsCreating(true);
    socketService.socket.emit('create_action', { action: newAction });
    setNewAction('');
    setTimeout(() => setIsCreating(false), 1000);
  };

  const handleVote = (actionId: string, vote: 'yes' | 'no') => {
    if (!socketService.socket) return;
    socketService.socket.emit('vote_action', { actionId, vote });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'border-green-400/30 bg-green-400/10';
      case 'failed': return 'border-red-400/30 bg-red-400/10';
      default: return 'border-yellow-400/30 bg-yellow-400/10';
    }
  };

  const hasUserVoted = (action: CollectiveAction) => {
    return action.voters.includes(userId);
  };

  const getVotePercentage = (votes: number, total: number) => {
    return total > 0 ? (votes / total) * 100 : 0;
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
          className="w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <Card className="bg-gradient-to-br from-black/90 to-gray-900/90 border-primary/30 text-white shadow-2xl">
            <CardHeader className="text-center border-b border-primary/20">
              <CardTitle className="flex items-center justify-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                Actions Collectives
              </CardTitle>
              <p className="text-gray-400 text-sm mt-2">Proposez et votez pour des actions de groupe</p>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Formulaire de création d'action */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Proposer une Action
                </h3>
                <div className="flex gap-3">
                  <Input
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value)}
                    placeholder="Ex: Chanter la marseillaise, faire une ola..."
                    className="flex-1 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                    maxLength={100}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateAction()}
                  />
                  <Button
                    onClick={handleCreateAction}
                    disabled={!newAction.trim() || isCreating}
                    className="bg-gradient-to-r from-primary to-accent-comp hover:from-primary/80 hover:to-accent-comp/80"
                  >
                    {isCreating ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  {newAction.length}/100
                </div>
              </div>

              {/* Liste des actions */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <h3 className="font-semibold">Actions Proposées</h3>
                
                {actions.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune action proposée pour le moment</p>
                    <p className="text-sm mt-2">Soyez le premier à proposer une action collective !</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {actions.map((action) => {
                      const totalVotes = action.yesVotes + action.noVotes;
                      const yesPercentage = getVotePercentage(action.yesVotes, totalVotes);
                      const noPercentage = getVotePercentage(action.noVotes, totalVotes);
                      const userVoted = hasUserVoted(action);
                      
                      return (
                        <motion.div
                          key={action._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 rounded-lg border ${getStatusColor(action.status)}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {getStatusIcon(action.status)}
                                <Badge variant="outline" className="text-xs">
                                  {action.status === 'active' ? 'En cours' : 
                                   action.status === 'success' ? 'Adoptée' : 'Rejetée'}
                                </Badge>
                              </div>
                              <p className="font-medium text-white">{action.action}</p>
                              <p className="text-sm text-gray-400 mt-1">
                                Proposé par {action.proposer === userId ? 'vous' : action.proposer}
                              </p>
                            </div>
                          </div>

                          {/* Résultats de vote */}
                          <div className="space-y-2 mb-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-green-400">Pour: {action.yesVotes}</span>
                              <span className="text-red-400">Contre: {action.noVotes}</span>
                            </div>
                            
                            <div className="flex gap-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="bg-green-400 transition-all duration-500"
                                style={{ width: `${yesPercentage}%` }}
                              />
                              <div 
                                className="bg-red-400 transition-all duration-500"
                                style={{ width: `${noPercentage}%` }}
                              />
                            </div>
                          </div>

                          {/* Boutons de vote */}
                          {action.status === 'active' && (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleVote(action._id, 'yes')}
                                disabled={userVoted}
                                variant="outline"
                                size="sm"
                                className="flex-1 border-green-400/30 text-green-400 hover:bg-green-400/10"
                              >
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                Pour
                              </Button>
                              <Button
                                onClick={() => handleVote(action._id, 'no')}
                                disabled={userVoted}
                                variant="outline"
                                size="sm"
                                className="flex-1 border-red-400/30 text-red-400 hover:bg-red-400/10"
                              >
                                <ThumbsDown className="w-4 h-4 mr-1" />
                                Contre
                              </Button>
                            </div>
                          )}

                          {userVoted && action.status === 'active' && (
                            <p className="text-center text-sm text-gray-400 mt-2">
                              Vous avez déjà voté pour cette action
                            </p>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

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

export default CollectiveActions; 