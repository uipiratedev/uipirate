"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
    email?: string;
  }>;
  createdAt: string;
}

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth(true);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"settings" | "brand" | "members">("settings");

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brandVoice, setBrandVoice] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");

  // Add member modal state
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<"admin" | "editor" | "viewer">("editor");
  const [addingMember, setAddingMember] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchTeam();
    }
  }, [params.id]);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/pirateCOS/teams/${params.id}`);
      const data = await response.json();

      if (data.success) {
        const teamData = data.data.team;
        setTeam(teamData);
        setName(teamData.name);
        setDescription(teamData.description || "");
        setBrandVoice(teamData.brandVoiceOverride || "");
        setKeywords(teamData.keywordsOverride || []);
      }
    } catch (error) {
      console.error("Failed to fetch team:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/pirateCOS/teams/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          brandVoiceOverride: brandVoice || undefined,
          keywordsOverride: keywords.length > 0 ? keywords : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Team updated successfully!");
        fetchTeam();
      } else {
        alert("Failed to update team: " + data.error);
      }
    } catch (error) {
      console.error("Failed to save team:", error);
      alert("Failed to save team");
    } finally {
      setSaving(false);
    }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) {
      alert("Please enter an email address");
      return;
    }

    // Check if member already exists
    if (team?.members.some((m) => m.userId === newMemberEmail || m.email === newMemberEmail)) {
      alert("This user is already a member of the team");
      return;
    }

    setAddingMember(true);
    try {
      const response = await fetch(`/api/pirateCOS/teams/${params.id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newMemberEmail.trim(),
          role: newMemberRole,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowAddMemberModal(false);
        setNewMemberEmail("");
        setNewMemberRole("editor");
        fetchTeam(); // Refresh team data
      } else {
        alert("Failed to add member: " + data.error);
      }
    } catch (error) {
      console.error("Failed to add member:", error);
      alert("Failed to add member");
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm(`Are you sure you want to remove this member?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/pirateCOS/teams/${params.id}/members`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (data.success) {
        fetchTeam(); // Refresh team data
      } else {
        alert("Failed to remove member: " + data.error);
      }
    } catch (error) {
      console.error("Failed to remove member:", error);
      alert("Failed to remove member");
    }
  };

  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && keywordInput.trim()) {
      e.preventDefault();
      const keyword = keywordInput.trim().replace(/,$/, "");
      if (keyword && !keywords.includes(keyword)) {
        setKeywords([...keywords, keyword]);
      }
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h2 className="text-xl font-bold font-geist text-gray-900 mb-2">Team not found</h2>
        <button
          onClick={() => router.push("/pirateCOS/teams")}
          className="text-sm text-[#FF5B04] font-geist hover:underline"
        >
          ← Back to Teams
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => router.push("/pirateCOS/teams")}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold font-geist text-gray-900">{team.name}</h1>
              {team.description && (
                <p className="text-sm text-gray-500 font-geist mt-1">{team.description}</p>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-[#FF5B04] text-white rounded-xl text-sm font-semibold font-geist hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            {[
              { id: "settings", label: "Settings", icon: "settings" },
              { id: "brand", label: "Brand Voice", icon: "sparkles" },
              { id: "members", label: "Members", icon: "users" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-sm font-semibold font-geist flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[#FF5B04] text-[#FF5B04]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <CosIcon name={tab.icon as any} size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "settings" && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold font-geist text-gray-700 mb-2">
                Team Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-geist focus:outline-none focus:ring-2 focus:ring-[#FF5B04]/20 focus:border-[#FF5B04]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold font-geist text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-geist focus:outline-none focus:ring-2 focus:ring-[#FF5B04]/20 focus:border-[#FF5B04] resize-none"
              />
            </div>
          </div>
        )}

        {activeTab === "brand" && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex gap-3">
              <CosIcon name="info" size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold font-geist text-orange-900 mb-1">
                  Team-Specific Brand Voice
                </p>
                <p className="text-xs font-geist text-orange-700 leading-relaxed">
                  Override the workspace brand voice for this team. Leave empty to use workspace defaults.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold font-geist text-gray-700 mb-2">
                Brand Voice Override
              </label>
              <textarea
                value={brandVoice}
                onChange={(e) => setBrandVoice(e.target.value)}
                placeholder="e.g., Professional yet approachable, with a focus on technical accuracy..."
                rows={6}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-geist focus:outline-none focus:ring-2 focus:ring-[#FF5B04]/20 focus:border-[#FF5B04] resize-none"
              />
              <p className="text-xs text-gray-500 font-geist mt-2">
                This brand voice will be used for all content created by this team.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold font-geist text-gray-700 mb-2">
                Keywords Override
              </label>
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleAddKeyword}
                placeholder="Type keyword and press Enter..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-geist focus:outline-none focus:ring-2 focus:ring-[#FF5B04]/20 focus:border-[#FF5B04]"
              />
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 text-sm font-medium font-geist rounded-lg border border-purple-200"
                    >
                      {keyword}
                      <button
                        onClick={() => handleRemoveKeyword(keyword)}
                        className="text-purple-400 hover:text-purple-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold font-geist text-gray-900">Team Members</h3>
              <button
                onClick={() => setShowAddMemberModal(true)}
                className="px-3 py-1.5 bg-[#FF5B04] text-white rounded-lg text-sm font-semibold font-geist hover:opacity-90 transition-opacity"
              >
                Add Member
              </button>
            </div>

            {team.members.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <CosIcon name="users" size={32} className="mx-auto mb-2" />
                <p className="text-sm font-geist">No members yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {team.members.map((member) => (
                  <div
                    key={member.userId}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                        {member.email?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold font-geist text-gray-900">
                          {member.email || member.userId}
                        </p>
                        <p className="text-xs text-gray-500 font-geist capitalize">{member.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveMember(member.userId)}
                      className="text-xs text-red-600 hover:text-red-700 font-semibold font-geist"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddMemberModal(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold font-geist text-gray-900">Add Team Member</h3>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold font-geist text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-geist text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5B04]/20 focus:border-[#FF5B04]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold font-geist text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as "admin" | "editor" | "viewer")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-geist text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5B04]/20 focus:border-[#FF5B04]"
                >
                  <option value="viewer">Viewer - Can view content</option>
                  <option value="editor">Editor - Can create and edit</option>
                  <option value="admin">Admin - Full access</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddMemberModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold font-geist text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMember}
                  disabled={addingMember || !newMemberEmail.trim()}
                  className="flex-1 px-4 py-2 bg-[#FF5B04] text-white rounded-lg font-semibold font-geist text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingMember ? "Adding..." : "Add Member"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
