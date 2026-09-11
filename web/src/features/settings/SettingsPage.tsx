import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        
        <div>
          <h1 className="text-3xl font-bold text-primary" style={{ marginBottom: 'var(--space-1)', letterSpacing: '-0.02em' }}>Settings</h1>
          <p className="text-secondary text-sm">Manage your clinical profile, preferences, and account security.</p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-8)', alignItems: 'flex-start' }}>
          
          {/* Settings Sidebar Nav */}
          <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', flexShrink: 0 }}>
            {[
              { id: 'profile', label: 'Clinical Profile' },
              { id: 'preferences', label: 'Preferences' },
              { id: 'notifications', label: 'Notifications' },
              { id: 'security', label: 'Security & Session' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  textAlign: 'left',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: activeTab === tab.id ? 'var(--color-primary-50)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--color-primary-800)' : 'var(--color-text-secondary)',
                  fontWeight: activeTab === tab.id ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                  fontSize: 'var(--font-size-sm)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Settings Content Area */}
          <div style={{ flex: 1, maxWidth: '640px' }}>
            
            {activeTab === 'profile' && (
              <Card className="animate-fade-up">
                <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid var(--color-border-light)' }}>
                  <h2 className="text-lg font-semibold text-primary">Clinical Profile</h2>
                  <p className="text-sm text-secondary">This information is visible to your patients during intake.</p>
                </div>
                
                <form onSubmit={handleSave} style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-2)' }}>Full Name</label>
                      <input type="text" defaultValue={user?.full_name} style={{ width: '100%', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-2)' }}>Title / Degree</label>
                      <input type="text" defaultValue="BAMS, MD (Ayurveda)" style={{ width: '100%', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-2)' }}>Facility / Clinic</label>
                    <input type="text" defaultValue="Main Campus OPD" disabled style={{ width: '100%', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-muted)', color: 'var(--color-text-muted)' }} />
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>Facility is managed by your system administrator.</p>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-2)' }}>Bio / Description (Optional)</label>
                    <textarea rows={3} style={{ width: '100%', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', resize: 'vertical' }}></textarea>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                    {saved && <span className="text-sm" style={{ color: 'var(--color-routine)' }}>✓ Settings saved</span>}
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </Card>
            )}

            {activeTab === 'preferences' && (
              <Card className="animate-fade-up">
                <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid var(--color-border-light)' }}>
                  <h2 className="text-lg font-semibold text-primary">System Preferences</h2>
                  <p className="text-sm text-secondary">Customize your SwasthyaSaathi experience.</p>
                </div>
                <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>Default Dashboard View</h3>
                      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Choose which list loads when you sign in.</p>
                    </div>
                    <select style={{ padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', fontSize: 'var(--font-size-sm)' }}>
                      <option>All Waiting</option>
                      <option>Action Required</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>Enable AI Summary Drafts</h3>
                      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Automatically generate a prose summary of the patient's condition.</p>
                    </div>
                    <div style={{ width: '40px', height: '20px', background: 'var(--color-primary-800)', borderRadius: 'var(--radius-full)', position: 'relative', cursor: 'pointer' }}>
                      <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px' }}></div>
                    </div>
                  </div>

                </div>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card className="animate-fade-up">
                <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid var(--color-border-light)' }}>
                  <h2 className="text-lg font-semibold text-primary">Notifications</h2>
                  <p className="text-sm text-secondary">Manage alerts and notifications.</p>
                </div>
                <div style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
                  <p className="text-secondary">Notification settings are managed at the facility level.</p>
                </div>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card className="animate-fade-up">
                <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid var(--color-border-light)' }}>
                  <h2 className="text-lg font-semibold text-primary">Security & Session</h2>
                  <p className="text-sm text-secondary">Manage your account security.</p>
                </div>
                <div style={{ padding: 'var(--space-6)' }}>
                  <Button variant="outline" size="sm">Change Password</Button>
                  <div style={{ marginTop: 'var(--space-8)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--color-border-light)' }}>
                    <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-emergency)', marginBottom: 'var(--space-2)' }}>Active Sessions</h3>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>You are currently signed in on this device.</p>
                  </div>
                </div>
              </Card>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
