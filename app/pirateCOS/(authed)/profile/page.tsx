"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { user, refreshAuth } = useAuth(true);

  // Tab State: 'profile' | 'security' | 'organisation'
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "organisation">("profile");

  // Profile fields state
  const [name, setName] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Avatar Upload State
  const [dragActive, setDragActive] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Organisation Onboarding Wizard State
  const [step, setStep] = useState(1);
  const [orgName, setOrgName] = useState("");
  const [orgWebsite, setOrgWebsite] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  const [primaryFocus, setPrimaryFocus] = useState("");
  const [ICPDescription, setICPDescription] = useState("");
  const [inviteEmails, setInviteEmails] = useState("");

  const [converting, setConverting] = useState(false);
  const [convertError, setConvertError] = useState<string | null>(null);

  // Organisation Details State
  const [orgDetails, setOrgDetails] = useState<any>(null);
  const [orgLoading, setOrgLoading] = useState(false);
  const [orgDetailsError, setOrgDetailsError] = useState<string | null>(null);

  // Invite Member Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "editor" | "viewer">("editor");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteError(null);
    try {
      const res = await fetch("/api/pirateCOS/org/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setShowInviteModal(false);
      setInviteEmail("");
      setInviteRole("editor");
      fetchOrgDetails();
    } catch (err: any) {
      setInviteError(err.message || "Failed to invite member");
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveOrgMember = async (memberId: string) => {
    if (!confirm("Remove this member from the organisation?")) return;
    setRemovingMemberId(memberId);
    try {
      const res = await fetch("/api/pirateCOS/org/members", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      fetchOrgDetails();
    } catch (err: any) {
      alert(err.message || "Failed to remove member");
    } finally {
      setRemovingMemberId(null);
    }
  };

  const fetchOrgDetails = async () => {
    setOrgLoading(true);
    setOrgDetailsError(null);
    try {
      const res = await fetch("/api/pirateCOS/org/details");
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to load organisation details");
      }
      setOrgDetails(data.data);
    } catch (err: any) {
      setOrgDetailsError(err.message || "An unexpected error occurred");
    } finally {
      setOrgLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "organisation" && user?.accountType === "organization" && !orgDetails) {
      fetchOrgDetails();
    }
  }, [activeTab, user]);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF5B04]"></div>
      </div>
    );
  }

  // Profile save (name change)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setProfileSaving(true);
    setProfileError(null);
    setProfileSaved(false);

    try {
      const res = await fetch("/api/pirateCOS/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to update profile");
      }

      setProfileSaved(true);
      await refreshAuth();
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err: any) {
      setProfileError(err.message || "Something went wrong");
    } finally {
      setProfileSaving(false);
    }
  };

  // Avatar drag/drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadAvatarFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadAvatarFile(e.target.files[0]);
    }
  };

  const uploadAvatarFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setAvatarError("Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("File size must be under 5MB.");
      return;
    }

    setAvatarUploading(true);
    setAvatarError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // 1. Upload to Cloudinary endpoint
      const uploadRes = await fetch("/api/pirateCOS/media/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadData.success) {
        throw new Error(uploadData.error || "Upload failed");
      }

      const imageUrl = uploadData.url;

      // 2. Save image URL to profile
      const updateRes = await fetch("/api/pirateCOS/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: imageUrl }),
      });
      const updateData = await updateRes.json();

      if (!updateData.success) {
        throw new Error(updateData.error || "Failed to save avatar image.");
      }

      await refreshAuth();
    } catch (err: any) {
      setAvatarError(err.message || "An error occurred during upload.");
    } finally {
      setAvatarUploading(false);
    }
  };

  // Password save
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    setPasswordSaving(true);
    setPasswordError(null);
    setPasswordSaved(false);

    try {
      const res = await fetch("/api/pirateCOS/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to update password");
      }

      setPasswordSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (err: any) {
      setPasswordError(err.message || "Failed to change password");
    } finally {
      setPasswordSaving(false);
    }
  };

  // Convert to Organization Wizard completion
  const handleConvertToOrg = async () => {
    if (!orgName.trim()) {
      setConvertError("Organisation name is required");
      return;
    }

    setConverting(true);
    setConvertError(null);

    try {
      const res = await fetch("/api/pirateCOS/org/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgName: orgName.trim(),
          orgDescription: orgDescription.trim(),
          orgWebsite: orgWebsite.trim(),
          ICPDescription: ICPDescription.trim(),
          primaryFocus: primaryFocus.trim(),
          inviteEmails: inviteEmails.trim(),
        }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to convert account");
      }

      // Reload page to re-authenticate and redraw the workspace view
      window.location.reload();
    } catch (err: any) {
      setConvertError(err.message || "Conversion failed");
      setConverting(false);
    }
  };

  return (
    <>
    <div className="space-y-8 px-8 py-4 font-geist text-gray-700">
      {/* Page Header */}
      <div className="pt-2">
        <p
          className="text-xs font-jetbrains-mono uppercase tracking-widest mb-1"
          style={{ color: "#FF5B04" }}
        >
          Settings
        </p>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          My Account Profile
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage your personal details, credentials, and organisation settings.
        </p>
      </div>

      {/* Modern Pill-Styled Segment Control Switcher */}
      <div className="flex p-1 space-x-1 bg-gray-100 rounded-xl max-w-md border border-gray-200/50">
        {(["profile", "security", "organisation"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg capitalize transition-all duration-200 ${
              activeTab === tab
                ? "bg-white text-gray-900 shadow-sm border border-black/5"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab === "profile" ? "Profile Info" : tab}
          </button>
        ))}
      </div>

      {/* Inline styles for simple animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
      `}</style>

      {/* Tab Contents */}
      <div className="transition-all duration-300">
        
        {/* Tab 1: Profile Info */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl p-6 shadow-card border border-black/5 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Avatar Drag & Drop */}
              <div className="flex flex-col items-center">
                <label className="block text-xs font-bold text-gray-500 mb-3 self-start">
                  Profile Photo
                </label>
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`w-full flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all duration-200 relative min-h-[220px] ${
                    dragActive
                      ? "border-[#FF5B04] bg-[#FF5B04]/5"
                      : "border-gray-200 bg-gray-50/30 hover:bg-gray-50/85 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="file"
                    id="avatar-input"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={avatarUploading}
                  />

                  {avatarUploading ? (
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF5B04]"></div>
                      <p className="text-xs text-gray-500 animate-pulse font-medium">Uploading image...</p>
                    </div>
                  ) : (
                    <label
                      htmlFor="avatar-input"
                      className="cursor-pointer flex flex-col items-center text-center space-y-4 w-full h-full"
                    >
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-white shadow-md relative group">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl font-bold text-gray-400">
                            {user.name
                              ? user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)
                              : "?"}
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700">Drag & drop avatar here</p>
                        <p className="text-[10px] text-gray-400 mt-1">or click to browse local files (max 5MB)</p>
                      </div>
                    </label>
                  )}

                  {avatarError && (
                    <p className="text-[10px] text-red-500 mt-3 font-semibold text-center">{avatarError}</p>
                  )}
                </div>
              </div>

              {/* Right Column: Profile Form Details */}
              <div className="lg:col-span-2 flex flex-col justify-between">
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2">
                    Profile Information
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Display Name
                    </label>
                    <input
                      type="text"
                      className="w-full text-sm bg-gray-50 rounded-lg px-3 py-2.5 outline-none border border-black/10 focus:border-[#FF5B04]/50 focus:bg-white transition-colors"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your display name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full text-sm bg-gray-100 rounded-lg px-3 py-2.5 outline-none border border-black/5 text-gray-400 cursor-not-allowed"
                      value={user.email}
                      disabled
                    />
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      Email address is read-only to safeguard account credentials.
                    </span>
                  </div>

                  <div className="pt-2">
                    <span className="text-xs font-semibold text-gray-500 block mb-1.5">
                      Subscription Tier
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-[#FF5B04]/20 text-xs font-semibold text-[#FF5B04] capitalize">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
                      {user.plan} Plan
                    </span>
                  </div>

                  {profileError && (
                    <p className="text-xs text-red-500 mt-2 font-geist">{profileError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={profileSaving || !name.trim() || name.trim() === user.name}
                    className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: profileSaved ? "#16a34a" : "#FF5B04" }}
                  >
                    {profileSaving ? "Saving…" : profileSaved ? "✓ Profile Updated!" : "Update Profile"}
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Security */}
        {activeTab === "security" && (
          <div className="bg-white rounded-2xl p-6 shadow-card border border-black/5 animate-fadeIn">
            <div className="max-w-xl">
              <h2 className="text-lg font-bold font-geist text-gray-900 mb-2">
                Security & Password
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                Update your account password below. Keep it secure and complex.
              </p>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full text-sm bg-gray-50 rounded-lg px-3 py-2.5 outline-none border border-black/10 focus:border-[#FF5B04]/50 focus:bg-white transition-colors"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full text-sm bg-gray-50 rounded-lg px-3 py-2.5 outline-none border border-black/10 focus:border-[#FF5B04]/50 focus:bg-white transition-colors"
                  placeholder="At least 6 characters"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-sm bg-gray-50 rounded-lg px-3 py-2.5 outline-none border border-black/10 focus:border-[#FF5B04]/50 focus:bg-white transition-colors"
                  placeholder="Repeat new password"
                />
              </div>

              {passwordError && (
                <p className="text-xs text-red-500 mt-2 font-geist">{passwordError}</p>
              )}

              <button
                type="submit"
                disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
                className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
                style={{ background: passwordSaved ? "#16a34a" : "#FF5B04" }}
              >
                {passwordSaving ? "Saving…" : passwordSaved ? "✓ Password Changed!" : "Change Password"}
              </button>
            </form>
            </div>
          </div>
        )}

        {/* Tab 3: Organisation */}
        {activeTab === "organisation" && (
          <div className="animate-fadeIn">
            {user.accountType === "organization" ? (
              orgLoading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-black/5 shadow-card min-h-[350px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF5B04] mb-4"></div>
                  <p className="text-xs text-gray-500 font-semibold animate-pulse">Retrieving organisation configuration...</p>
                </div>
              ) : orgDetailsError ? (
                <div className="p-8 bg-white rounded-2xl border border-red-100 shadow-card text-center max-w-xl mx-auto py-12">
                  <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mx-auto mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Failed to Load Details</h3>
                  <p className="text-xs text-gray-500 mb-4">{orgDetailsError}</p>
                  <button
                    onClick={fetchOrgDetails}
                    className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-colors"
                  >
                    Retry Loading
                  </button>
                </div>
              ) : orgDetails ? (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Row 1: Workspace Profile & Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-card border border-black/5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-bold text-gray-900">Workspace Profile</h3>
                          <span className="inline-flex px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold rounded-full">
                            Active Tenant
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Organisation Name</span>
                            <span className="text-sm font-semibold text-gray-800">{orgDetails.workspace?.name || orgDetails.brandBrain?.workspaceName || "UI Pirate"}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Website URL</span>
                            {orgDetails.brandBrain?.companyWebsite ? (
                              <a href={orgDetails.brandBrain.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#FF5B04] hover:underline">
                                {orgDetails.brandBrain.companyWebsite}
                              </a>
                            ) : (
                              <span className="text-sm text-gray-400">Not configured</span>
                            )}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Industry / Business Scope</span>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                              {orgDetails.brandBrain?.workspaceDescription || orgDetails.workspace?.description || "Central workspace details for the organisation."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-card border border-black/5 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-4">Account Metadata</h3>
                        <div className="space-y-3 text-xs">
                          <div className="flex justify-between border-b border-gray-50 pb-2">
                            <span className="text-gray-400">My Role</span>
                            <span className="font-semibold text-gray-800 capitalize">
                              {user.orgRole === "org-admin" ? "Organisation Owner" : user.orgRole}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-50 pb-2">
                            <span className="text-gray-400">Account Type</span>
                            <span className="font-semibold text-gray-800 capitalize">{user.accountType}</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-50 pb-2">
                            <span className="text-gray-400">Tenant Owner</span>
                            <span className="font-semibold text-gray-800 truncate max-w-[120px]">{orgDetails.owner?.name || orgDetails.owner?.email}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Tenant ID Boundary</span>
                            <span className="font-mono text-[10px] bg-gray-50 border border-gray-100 rounded px-1.5 py-0.5 block text-gray-500 select-all overflow-x-auto whitespace-nowrap">
                              {user.tenantId}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Brand Settings (AI Config Profile) */}
                  <div className="bg-white rounded-2xl p-6 shadow-card border border-black/5">
                    <h3 className="text-sm font-bold text-gray-900 mb-4">Brand Brain & AI Core Parameters</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Primary Writing Focus</span>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {orgDetails.brandBrain?.products || "Not specified."}
                        </p>
                      </div>
                      <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Target ICP / Audience ICP</span>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {orgDetails.brandBrain?.audienceICP || "Not specified."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Team Members & Collaboration */}
                  <div className="bg-white rounded-2xl p-6 shadow-card border border-black/5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">Organisation Members</h3>
                        <p className="text-[10px] text-gray-400 mt-0.5">Manage editors, administrators, and guest accounts.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.orgRole === "org-admin" && (
                          <button
                            onClick={() => { setInviteError(null); setShowInviteModal(true); }}
                            className="px-3.5 py-1.5 rounded-lg bg-[#FF5B04] text-white text-xs font-bold hover:opacity-90 transition-opacity"
                          >
                            + Invite Member
                          </button>
                        )}
                        <a
                          href="/pirateCOS/teams"
                          className="px-3.5 py-1.5 rounded-lg border border-[#FF5B04]/20 hover:border-[#FF5B04]/50 bg-orange-50/20 hover:bg-orange-50/50 text-xs font-bold text-[#FF5B04] transition-all"
                        >
                          Manage Teams
                        </a>
                      </div>
                    </div>

                    <div className="overflow-hidden border border-gray-100 rounded-xl bg-gray-50/50">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50">
                            <th className="px-4 py-3">Member</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Joined Date</th>
                            {user.orgRole === "org-admin" && <th className="px-4 py-3" />}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs">
                          {orgDetails.members?.map((member: any) => (
                            <tr key={member._id} className="hover:bg-gray-50/80 transition-colors">
                              <td className="px-4 py-3 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-gray-100 flex items-center justify-center font-bold text-gray-500 text-xs shadow-sm flex-shrink-0">
                                  {member.avatar ? (
                                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <span>
                                      {member.name
                                        ? member.name
                                            .split(" ")
                                            .map((n: string) => n[0])
                                            .join("")
                                            .toUpperCase()
                                            .slice(0, 2)
                                        : "?"}
                                    </span>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-gray-800 truncate">{member.name}</div>
                                  <div className="text-[10px] text-gray-400 truncate">{member.email}</div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${
                                  member.orgRole === "org-admin"
                                    ? "bg-orange-50 text-[#FF5B04] border-[#FF5B04]/20"
                                    : member.orgRole === "admin"
                                    ? "bg-blue-50 text-blue-600 border-blue-200"
                                    : "bg-gray-50 text-gray-600 border-gray-200"
                                }`}>
                                  {member.orgRole === "org-admin" ? "Owner" : member.orgRole}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                                  member.isActive ? "text-emerald-600" : "text-gray-400"
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    member.isActive ? "bg-emerald-500" : "bg-gray-300"
                                  }`} />
                                  {member.isActive ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-400 font-mono text-[10px]">
                                {new Date(member.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                              </td>
                              {user.orgRole === "org-admin" && (
                                <td className="px-4 py-3 text-right">
                                  {member.orgRole !== "org-admin" && (
                                    <button
                                      onClick={() => handleRemoveOrgMember(member._id)}
                                      disabled={removingMemberId === member._id}
                                      className="text-[10px] font-semibold text-red-500 hover:text-red-700 disabled:opacity-40 transition-colors"
                                    >
                                      {removingMemberId === member._id ? "Removing…" : "Remove"}
                                    </button>
                                  )}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Row 4: API Keys */}
                  <div className="bg-white rounded-2xl p-6 shadow-card border border-black/5">
                    <h3 className="text-sm font-bold text-gray-900 mb-1">Organisation Access Credentials</h3>
                    <p className="text-[10px] text-gray-400 mb-4">Use these API keys to integrate and publish content programmatically.</p>
                    
                    <div className="overflow-hidden border border-gray-100 rounded-xl bg-gray-50/50">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50">
                            <th className="px-4 py-3">Key Name</th>
                            <th className="px-4 py-3">Prefix</th>
                            <th className="px-4 py-3">Scopes</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Created</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs">
                          {orgDetails.apiKeys && orgDetails.apiKeys.length > 0 ? (
                            orgDetails.apiKeys.map((apiKey: any) => (
                              <tr key={apiKey.keyPrefix} className="hover:bg-gray-50/80 transition-colors">
                                <td className="px-4 py-3 font-semibold text-gray-800">{apiKey.name}</td>
                                <td className="px-4 py-3 font-mono text-gray-600 text-[10px]">{apiKey.keyPrefix}</td>
                                <td className="px-4 py-3">
                                  <div className="flex gap-1 flex-wrap">
                                    {apiKey.scopes?.map((s: string) => (
                                      <span key={s} className="inline-flex px-1.5 py-0.5 bg-gray-100 border border-gray-200 text-gray-500 text-[9px] rounded font-bold uppercase">
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                                    apiKey.isActive ? "text-emerald-600" : "text-gray-400"
                                  }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                      apiKey.isActive ? "bg-emerald-500" : "bg-gray-300"
                                    }`} />
                                    {apiKey.isActive ? "Active" : "Inactive"}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-gray-400 font-mono text-[10px]">
                                  {new Date(apiKey.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-xs">
                                No active organisation API keys found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              ) : null
            ) : (
              /* Onboarding Multi-Step Wizard */
              <div className="w-full">
                
                {/* Wizard Step Navigation Indicator */}
                <div className="mb-10 max-w-2xl mx-auto">
                  <div className="flex items-center justify-between">
                    {[
                      { stepNum: 1, label: "Identity" },
                      { stepNum: 2, label: "Workspace" },
                      { stepNum: 3, label: "Team" },
                    ].map((s, idx) => (
                      <div key={s.stepNum} className="flex-1 relative">
                        <div className="flex flex-col items-center">
                          {/* Step circle */}
                          <button
                            type="button"
                            onClick={() => {
                              if (s.stepNum < step) {
                                setStep(s.stepNum);
                              } else if (s.stepNum === 2 && orgName.trim()) {
                                setStep(2);
                              } else if (s.stepNum === 3 && orgName.trim()) {
                                setStep(3);
                              }
                            }}
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs border-2 transition-all duration-300 z-10 ${
                              step === s.stepNum
                                ? "bg-[#FF5B04] text-white border-[#FF5B04] shadow-md shadow-[#FF5B04]/20"
                                : step > s.stepNum
                                ? "bg-emerald-500 text-white border-emerald-500"
                                : "bg-white text-gray-400 border-gray-200 cursor-not-allowed"
                            }`}
                          >
                            {step > s.stepNum ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              s.stepNum
                            )}
                          </button>
                          
                          {/* Step Label */}
                          <span
                            className={`text-xs font-semibold mt-2 transition-all duration-300 ${
                              step === s.stepNum ? "text-gray-900 font-bold" : "text-gray-400"
                            }`}
                          >
                            {s.label}
                          </span>
                        </div>
                        
                        {/* Connector Line */}
                        {idx < 2 && (
                          <div
                            className="absolute top-4.5 left-[50%] right-[-50%] h-[2px] -translate-y-[50%] -z-0 bg-gray-100"
                            style={{
                              background:
                                step > s.stepNum
                                  ? "#10b981"
                                  : step === s.stepNum
                                  ? "linear-gradient(90deg, #FF5B04 0%, #e2e8f0 100%)"
                                  : "#e2e8f0",
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step Form Wrapper Card */}
                <div className="bg-white rounded-2xl p-8 shadow-card border border-black/5 flex flex-col transition-all duration-300 min-h-[380px] justify-between">
                  <div className="max-w-xl w-full mx-auto flex flex-col justify-between flex-1">
                    <div>
                      {/* STEP 1: IDENTITY */}
                    {step === 1 && (
                      <div className="space-y-4">
                        <div className="border-b border-gray-100 pb-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">Step 1: Organisation Identity</h3>
                          <p className="text-xs text-gray-400 mt-0.5">Let's define the name and business metadata of your organisation.</p>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                            Organisation Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            className="w-full text-sm bg-gray-50 rounded-lg px-3 py-2.5 outline-none border border-black/10 focus:border-[#FF5B04]/50 focus:bg-white transition-colors"
                            placeholder="e.g. Acme Corporation"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                            Website URL
                          </label>
                          <input
                            type="url"
                            value={orgWebsite}
                            onChange={(e) => setOrgWebsite(e.target.value)}
                            className="w-full text-sm bg-gray-50 rounded-lg px-3 py-2.5 outline-none border border-black/10 focus:border-[#FF5B04]/50 focus:bg-white transition-colors"
                            placeholder="e.g. https://acme.com"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                            Industry / Business Description
                          </label>
                          <textarea
                            value={orgDescription}
                            onChange={(e) => setOrgDescription(e.target.value)}
                            className="w-full text-sm bg-gray-50 rounded-lg px-3 py-2.5 outline-none border border-black/10 focus:border-[#FF5B04]/50 focus:bg-white transition-colors resize-none h-20"
                            placeholder="Briefly describe your business scope, e.g. B2B enterprise software provider"
                          />
                        </div>
                      </div>
                    )}

                    {/* STEP 2: WORKSPACE SPECS */}
                    {step === 2 && (
                      <div className="space-y-4">
                        <div className="border-b border-gray-100 pb-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">Step 2: Workspace Focus & Audience</h3>
                          <p className="text-xs text-gray-400 mt-0.5">Define your brand direction so our AI engines can tune voice outputs for your teams.</p>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                            Primary Writing Focus
                          </label>
                          <textarea
                            value={primaryFocus}
                            onChange={(e) => setPrimaryFocus(e.target.value)}
                            className="w-full text-sm bg-gray-50 rounded-lg px-3 py-2.5 outline-none border border-black/10 focus:border-[#FF5B04]/50 focus:bg-white transition-colors resize-none h-24"
                            placeholder="What does your team write? e.g. High-converting SaaS landing pages, SEO blogs, and product release newsletters"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                            Target ICP / Audience Summary
                          </label>
                          <textarea
                            value={ICPDescription}
                            onChange={(e) => setICPDescription(e.target.value)}
                            className="w-full text-sm bg-gray-50 rounded-lg px-3 py-2.5 outline-none border border-black/10 focus:border-[#FF5B04]/50 focus:bg-white transition-colors resize-none h-24"
                            placeholder="Who is your target reader? e.g. Technical product managers, CMOs of scale-up companies, and growth leads"
                          />
                        </div>
                      </div>
                    )}

                    {/* STEP 3: TEAM INVITES & FINISH */}
                    {step === 3 && (
                      <div className="space-y-4">
                        <div className="border-b border-gray-100 pb-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">Step 3: Collaborate with your Team</h3>
                          <p className="text-xs text-gray-400 mt-0.5">Invite editors and admins to write, customize brand voice rules, and publish together.</p>
                        </div>

                        {/* Irreversible Caution Banner */}
                        <div className="bg-amber-50 border border-amber-100 text-amber-800 text-xs p-4 rounded-xl leading-relaxed mb-4">
                          <div className="flex gap-2.5">
                            <svg className="w-5 h-5 flex-shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div>
                              <strong className="font-semibold block mb-0.5 font-geist">Non-Reversible Action</strong>
                              Converting is final. Your existing solo workspace and brand voice profiles will be migrated into your new organisation context.
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                            Invite Team Members (Emails)
                          </label>
                          <textarea
                            value={inviteEmails}
                            onChange={(e) => setInviteEmails(e.target.value)}
                            className="w-full text-sm bg-gray-50 rounded-lg px-3 py-2.5 outline-none border border-black/10 focus:border-[#FF5B04]/50 focus:bg-white transition-colors resize-none h-28"
                            placeholder="e.g. devon@acme.com, brandon@acme.com"
                          />
                          <span className="text-[10px] text-gray-400 mt-1.5 block leading-normal">
                            Separate emails with commas, spaces, or newlines. Invited users will be registered as editor members in your new default Marketing team.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Errors display */}
                  {convertError && (
                    <p className="text-xs text-red-500 mt-4 font-semibold">{convertError}</p>
                  )}

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-6">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                    ) : (
                      <div />
                    )}

                    {step < 3 ? (
                      <button
                        type="button"
                        disabled={step === 1 && !orgName.trim()}
                        onClick={() => setStep(step + 1)}
                        className="px-5 py-2 text-xs font-bold text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-[#FF5B04] hover:bg-[#e04f03]"
                      >
                        Next Step
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleConvertToOrg}
                        disabled={converting}
                        className="px-5 py-2 text-xs font-bold text-white rounded-xl transition-all disabled:opacity-40 bg-[#FF5B04] hover:bg-[#e04f03] flex items-center gap-1.5"
                      >
                        {converting ? (
                          <>
                            <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                            Converting…
                          </>
                        ) : (
                          "Complete Setup & Convert"
                        )}
                      </button>
                    )}
                  </div>
                  
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

      </div>
    </div>

    {/* Invite Member Modal */}
    {showInviteModal && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) setShowInviteModal(false); }}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Invite Organisation Member</h3>
              <p className="text-xs text-gray-400 mt-0.5">They must already have a PirateCOS account.</p>
            </div>
            <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleInviteMember(); }}
                placeholder="user@example.com"
                autoFocus
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5B04]/20 focus:border-[#FF5B04]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as "admin" | "editor" | "viewer")}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5B04]/20 focus:border-[#FF5B04]"
              >
                <option value="viewer">Viewer — read-only access</option>
                <option value="editor">Editor — create & edit content</option>
                <option value="admin">Admin — full access except billing</option>
              </select>
            </div>

            {inviteError && (
              <p className="text-xs text-red-500 font-medium">{inviteError}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInviteMember}
                disabled={inviting || !inviteEmail.trim()}
                className="flex-1 px-4 py-2.5 bg-[#FF5B04] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {inviting ? "Inviting…" : "Add to Organisation"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
