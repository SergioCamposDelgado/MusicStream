import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/button';
import { Input } from './ui/input';

export interface AdminUserData {
  id?: number;
  name: string;
  email: string;
  password?: string;
  isArtist: boolean;
  isAdmin: boolean;
  locked: boolean;
}

interface AdminUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AdminUserData) => Promise<void>;
  initialData?: AdminUserData;
}

export function AdminUserModal({ isOpen, onClose, onSave, initialData }: AdminUserModalProps) {
  const { colors: themeColors } = useTheme();
  
  const [formData, setFormData] = useState<AdminUserData>({
    name: '',
    email: '',
    password: '',
    isArtist: false,
    isAdmin: false,
    locked: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData?.id;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...initialData, password: '' }); // Don't show existing password
      } else {
        setFormData({
          name: '',
          email: '',
          password: '',
          isArtist: false,
          isAdmin: false,
          locked: false,
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div 
        className="w-full max-w-md p-6 rounded-xl shadow-2xl"
        style={{ 
          backgroundColor: themeColors.bgSecondary,
          border: `1px solid ${themeColors.border}`
        }}
      >
        <h2 
          className="text-xl font-bold mb-6"
          style={{ color: themeColors.textPrimary }}
        >
          {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1" style={{ color: themeColors.textSecondary }}>Nombre</label>
            <Input 
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{ backgroundColor: themeColors.bgPrimary, color: themeColors.textPrimary, borderColor: themeColors.border }}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: themeColors.textSecondary }}>Email</label>
            <Input 
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{ backgroundColor: themeColors.bgPrimary, color: themeColors.textPrimary, borderColor: themeColors.border }}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: themeColors.textSecondary }}>
              Contraseña {isEditing && "(Dejar en blanco para mantener actual)"}
            </label>
            <Input 
              required={!isEditing}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{ backgroundColor: themeColors.bgPrimary, color: themeColors.textPrimary, borderColor: themeColors.border }}
            />
          </div>

          <div className="flex flex-col gap-3 py-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.isArtist}
                onChange={(e) => setFormData({...formData, isArtist: e.target.checked})}
                className="w-4 h-4 rounded"
              />
              <span style={{ color: themeColors.textPrimary }}>Es Artista</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.isAdmin}
                onChange={(e) => setFormData({...formData, isAdmin: e.target.checked})}
                className="w-4 h-4 rounded"
              />
              <span style={{ color: themeColors.textPrimary }}>Es Administrador</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.locked}
                onChange={(e) => setFormData({...formData, locked: e.target.checked})}
                className="w-4 h-4 rounded"
              />
              <span style={{ color: '#d4183d' }}>Cuenta Bloqueada</span>
            </label>
          </div>

          <div className="flex gap-3 mt-8 justify-end">
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{ backgroundColor: 'transparent', border: `1px solid ${themeColors.border}`, color: themeColors.textPrimary }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              style={{ backgroundColor: themeColors.accentPrimary, color: themeColors.textPrimary }}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Usuario'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
