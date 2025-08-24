'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { subscribeToSession, addPlayer, updatePlayerChips, addBuyIn } from '@/lib/sessions';
import { SessionData, Player } from '@/types';

export default function SessionPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [chipAmount, setChipAmount] = useState('');
  const [buyInAmount, setBuyInAmount] = useState('');

  useEffect(() => {
    if (!sessionId) return;

    const unsubscribe = subscribeToSession(sessionId, (data) => {
      setSessionData(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [sessionId]);

  const handleAddPlayer = async () => {
    if (!newPlayerName.trim()) return;

    try {
      await addPlayer(sessionId, newPlayerName.trim());
      setNewPlayerName('');
      setShowAddPlayer(false);
    } catch (error) {
      console.error('Failed to add player:', error);
    }
  };

  const handleUpdateChips = async (playerId: string, newChips: number) => {
    try {
      await updatePlayerChips(sessionId, playerId, newChips);
    } catch (error) {
      console.error('Failed to update chips:', error);
    }
  };

  const handleAddBuyIn = async (playerId: string, amount: number) => {
    try {
      await addBuyIn(sessionId, playerId, amount);
    } catch (error) {
      console.error('Failed to add buy-in:', error);
    }
  };

  const players = sessionData ? Object.values(sessionData.players) : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading session...</div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Session not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl mb-4 p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Session: {sessionData.code}</h1>
              <p className="text-gray-600">{players.length} players</p>
            </div>
            <button
              onClick={() => setShowAddPlayer(true)}
              className="bg-poker-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              + Add Player
            </button>
          </div>

          {/* Players Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player) => (
              <div key={player.id} className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{player.name}</h3>
                  <div className="text-right text-sm text-gray-600">
                    Total Buy-in: ${player.totalBuyIn}
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="text-2xl font-bold text-poker-green mb-1">
                    ${player.chips}
                  </div>
                  <div className="text-sm text-gray-500">
                    P&L: {player.chips - player.totalBuyIn >= 0 ? '+' : ''}${player.chips - player.totalBuyIn}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedPlayer(player);
                      setChipAmount(player.chips.toString());
                    }}
                    className="flex-1 bg-poker-green text-white py-1 px-2 rounded text-sm hover:bg-green-600 transition-colors"
                  >
                    Edit Chips
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPlayer(player);
                      setBuyInAmount('');
                    }}
                    className="flex-1 bg-poker-gold text-black py-1 px-2 rounded text-sm hover:bg-yellow-500 transition-colors"
                  >
                    Buy-in
                  </button>
                </div>
              </div>
            ))}
          </div>

          {players.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No players yet. Add your first player to get started!
            </div>
          )}
        </div>
      </div>

      {/* Add Player Modal */}
      {showAddPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Player</h3>
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Player name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-poker-green focus:border-transparent"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowAddPlayer(false);
                  setNewPlayerName('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPlayer}
                disabled={!newPlayerName.trim()}
                className="flex-1 bg-poker-green text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                Add Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Chips Modal */}
      {selectedPlayer && chipAmount !== '' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Chips - {selectedPlayer.name}</h3>
            <input
              type="number"
              value={chipAmount}
              onChange={(e) => setChipAmount(e.target.value)}
              placeholder="Chip amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-poker-green focus:border-transparent"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedPlayer(null);
                  setChipAmount('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const amount = parseInt(chipAmount);
                  if (!isNaN(amount) && amount >= 0) {
                    handleUpdateChips(selectedPlayer.id, amount);
                  }
                  setSelectedPlayer(null);
                  setChipAmount('');
                }}
                className="flex-1 bg-poker-green text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buy-in Modal */}
      {selectedPlayer && buyInAmount !== '' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Buy-in - {selectedPlayer.name}</h3>
            <input
              type="number"
              value={buyInAmount}
              onChange={(e) => setBuyInAmount(e.target.value)}
              placeholder="Buy-in amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-poker-green focus:border-transparent"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedPlayer(null);
                  setBuyInAmount('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const amount = parseInt(buyInAmount);
                  if (!isNaN(amount) && amount > 0) {
                    handleAddBuyIn(selectedPlayer.id, amount);
                  }
                  setSelectedPlayer(null);
                  setBuyInAmount('');
                }}
                className="flex-1 bg-poker-gold text-black py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors"
              >
                Add Buy-in
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}