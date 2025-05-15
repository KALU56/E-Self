// app/settings/page.tsx
'use client';
import { useAuth } from '../../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-[#1D1616]">Settings</h2>
      
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-4 text-[#8E1616]">Account Settings</h3>
          <div className="space-y-2">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Username:</strong> {user?.username || 'Not set'}</p>
          </div>
        </div>

        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-4 text-[#8E1616]">Preferences</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="notifications" />
              <label htmlFor="notifications">Email Notifications</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="dark-mode" />
              <label htmlFor="dark-mode">Dark Mode</label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-[#8E1616]">Danger Zone</h3>
          <div className="space-y-2">
            <button className="text-red-600 border border-red-600 px-4 py-2 rounded-md hover:bg-red-50">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}