import React from 'react';
import { Search, Mail, Calendar, Users, Heart, BookOpen, MessageCircle, Shield } from 'lucide-react';

interface AdminUsersTabProps {
  users: any[];
  loadingUsers: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function AdminUsersTab({ users, loadingUsers, searchTerm, onSearchChange }: AdminUsersTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 sm:py-3 rounded-xl bg-white border border-border text-base text-night placeholder:text-stone/50 focus:outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 transition-colors"
          />
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-light font-display text-night">{users.length}</p>
          <p className="text-[9px] font-mono uppercase tracking-wider text-stone">Total Users</p>
        </div>
      </div>

      <div className="hidden sm:block bg-white border border-border rounded-3xl overflow-hidden shadow-card">
        {loadingUsers ? (
          <div className="text-center py-12 text-stone text-xs">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-sand text-stone uppercase font-bold tracking-wider border-b border-border">
                  <th className="py-4 px-6 text-[10px] font-mono tracking-[0.25em]">User</th>
                  <th className="py-4 px-6 text-[10px] font-mono tracking-[0.25em]">Role</th>
                  <th className="py-4 px-6 text-[10px] font-mono tracking-[0.25em]">Joined</th>
                  <th className="py-4 px-6 text-center text-[10px] font-mono tracking-[0.25em]">Wishlist</th>
                  <th className="py-4 px-6 text-center text-[10px] font-mono tracking-[0.25em]">Itineraries</th>
                  <th className="py-4 px-6 text-center text-[10px] font-mono tracking-[0.25em]">Reviews</th>
                  <th className="py-4 px-6 text-center text-[10px] font-mono tracking-[0.25em]">Trips</th>
                  <th className="py-4 px-6 text-center text-[10px] font-mono tracking-[0.25em]">Chats</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-gray/60">
                {users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-cream/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {u.image ? (
                          <img src={u.image} alt={u.name || u.email} loading="lazy" className="w-9 h-9 rounded-full object-cover border border-border shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center shrink-0 border border-border">
                            <Users className="w-4 h-4 text-stone" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-night text-sm">{u.name || 'Unnamed'}</p>
                          <p className="text-[10px] text-stone mt-0.5 flex items-center gap-1"><Mail className="w-3 h-3" />{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {u.role === "ADMIN" ? (
                        <span className="bg-gold/10 text-gold border border-gold/20 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase flex items-center gap-1 w-fit">
                          <Shield className="w-3 h-3" />Admin
                        </span>
                      ) : (
                        <span className="bg-cream/40 text-stone px-2 py-0.5 rounded-full text-[9px] font-medium">User</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-stone font-mono text-[10px]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone/60" />
                        {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center font-mono text-[10px] text-night">{u._count?.bookmarks || 0}</td>
                    <td className="py-4 px-6 text-center font-mono text-[10px] text-night">{u._count?.savedItineraries || 0}</td>
                    <td className="py-4 px-6 text-center font-mono text-[10px] text-night">{u._count?.reviews || 0}</td>
                    <td className="py-4 px-6 text-center font-mono text-[10px] text-night">{u._count?.trips || 0}</td>
                    <td className="py-4 px-6 text-center font-mono text-[10px] text-night">{u._count?.conversations || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="sm:hidden space-y-3">
        {loadingUsers ? (
          <div className="text-center py-12 text-stone text-xs">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-stone">
            <Users className="w-12 h-12 mx-auto stroke-[1.2] mb-3 text-stone/40" />
            <p className="text-sm font-medium text-night">No users registered</p>
            <p className="text-xs mt-1">Users will appear once they sign in.</p>
          </div>
        ) : (
          users.map((u: any) => (
            <div key={u.id} className="bg-white border border-border rounded-2xl p-4 shadow-card">
              <div className="flex items-start gap-3">
                {u.image ? (
                  <img src={u.image} alt={u.name || u.email} className="w-12 h-12 rounded-full object-cover border border-border shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center shrink-0 border border-border">
                    <Users className="w-5 h-5 text-stone" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-night text-sm truncate">{u.name || 'Unnamed'}</p>
                    {u.role === "ADMIN" && (
                      <span className="bg-gold/10 text-gold border border-gold/20 px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase flex items-center gap-0.5"><Shield className="w-2.5 h-2.5" />Admin</span>
                    )}
                  </div>
                  <p className="text-[10px] text-stone mt-0.5">{u.email}</p>
                  <div className="flex gap-3 mt-2 text-[10px] text-stone">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{u._count?.bookmarks || 0}</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{u._count?.savedItineraries || 0}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{u._count?.conversations || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
