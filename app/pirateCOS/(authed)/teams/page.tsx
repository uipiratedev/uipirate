"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import CosIcon from "@/components/pirateCOS/CosIcon";

interface Team {
  _id: string;
  name: string;
  description?: string;
  workspace: string;
  brandVoiceOverride?: string;
  keywordsOverride?: string[];
  members: Array<{
    userId: string;
    role: "admin" | "editor" | "viewer";
  }>;
  createdAt: string;
}

export default function TeamsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTeams();
    }
  }, [user]);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/pirateCOS/teams");
      const data = await response.json();

      if (data.success) {
        setTeams(data.data.teams);
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = () => {
    setShowCreateModal(true);
  };

  const handleEditTeam = (teamId: string) => {
    router.push(`/pirateCOS/teams/${teamId}`);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-geist text-gray-900">Teams</h1>
              <p className="text-sm text-gray-500 font-geist mt-1">
                Manage teams and configure team-specific brand voices
              </p>
            </div>
            <button
              onClick={handleCreateTeam}
              className="px-4 py-2 bg-[#FF5B04] text-white rounded-xl text-sm font-semibold font-geist hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Team
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {teams.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-orange-50 text-[#FF5B04] rounded-full flex items-center justify-center mx-auto mb-4">
              <CosIcon name="users" size={32} />
            </div>
            <h3 className="text-lg font-bold font-geist text-gray-900 mb-2">No teams yet</h3>
            <p className="text-sm text-gray-500 font-geist mb-6">
              Create your first team to collaborate with others and configure team-specific brand voices.
            </p>
            <button
              onClick={handleCreateTeam}
              className="px-4 py-2 bg-[#FF5B04] text-white rounded-xl text-sm font-semibold font-geist hover:opacity-90 transition-opacity"
            >
              Create Your First Team
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div
                key={team._id}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleEditTeam(team._id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                    <CosIcon name="users" size={24} />
                  </div>
                  <span className="text-xs font-semibold font-jetbrains-mono text-gray-400 uppercase">
                    {team.members.length} {team.members.length === 1 ? "member" : "members"}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-geist text-gray-900 mb-2 line-clamp-1">
                  {team.name}
                </h3>
                
                {team.description && (
                  <p className="text-sm text-gray-500 font-geist mb-4 line-clamp-2">
                    {team.description}
                  </p>
                )}

                {team.brandVoiceOverride && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-orange-50 text-orange-700 text-xs font-medium font-geist rounded-lg border border-orange-200">
                      <CosIcon name="sparkles" size={12} />
                      Custom Brand Voice
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <CreateTeamModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchTeams();
          }}
        />
      )}
    </div>
  );
}

// Create Team Modal Component
function CreateTeamModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Team name is required");
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const response = await fetch("/api/pirateCOS/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
      } else {
        setError(data.error || "Failed to create team");
      }
    } catch (error) {
      console.error("Failed to create team:", error);
      setError("Failed to create team");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-geist text-gray-900">Create Team</h2>
              <p className="text-sm text-gray-500 font-geist mt-1">
                Create a new team to collaborate with others
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-700 font-geist">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold font-geist text-gray-700 mb-2">
                Team Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Marketing Team"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-geist focus:outline-none focus:ring-2 focus:ring-[#FF5B04]/20 focus:border-[#FF5B04]"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-semibold font-geist text-gray-700 mb-2">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this team for?"
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-geist focus:outline-none focus:ring-2 focus:ring-[#FF5B04]/20 focus:border-[#FF5B04] resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl text-sm font-geist font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              disabled={creating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-xl text-sm font-geist font-medium text-white bg-[#FF5B04] hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={creating || !name.trim()}
            >
              {creating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Creating...
                </>
              ) : (
                "Create Team"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
