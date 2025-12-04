import { useState } from 'react';
import { AuditLog } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Edit, History } from 'lucide-react';

interface SystemSettingsPageProps {
  auditLogs: AuditLog[];
  onUpdateSetting: (setting: string, value: string) => void;
}

interface Setting {
  id: string;
  name: string;
  description: string;
  value: string;
  category: string;
}

export function SystemSettingsPage({ auditLogs, onUpdateSetting }: SystemSettingsPageProps) {
  const [settings, setSettings] = useState<Setting[]>([
    {
      id: 'site-name',
      name: 'Site Name',
      description: 'The name displayed on the website',
      value: 'ElectroStore',
      category: 'General'
    },
    {
      id: 'delivery-fee',
      name: 'Delivery Fee',
      description: 'Default delivery fee for orders',
      value: '$10',
      category: 'Delivery'
    },
    {
      id: 'free-shipping-threshold',
      name: 'Free Shipping Threshold',
      description: 'Minimum order amount for free shipping',
      value: '$100',
      category: 'Delivery'
    },
    {
      id: 'discount-threshold',
      name: 'Discount Threshold',
      description: 'Minimum order amount for discount',
      value: '$1000',
      category: 'Promotions'
    },
    {
      id: 'discount-amount',
      name: 'Discount Amount',
      description: 'Discount amount for orders above threshold',
      value: '$50',
      category: 'Promotions'
    },
    {
      id: 'max-login-attempts',
      name: 'Max Login Attempts',
      description: 'Maximum failed login attempts before lockout',
      value: '5',
      category: 'Security'
    },
    {
      id: 'session-timeout',
      name: 'Session Timeout',
      description: 'User session timeout in minutes',
      value: '30',
      category: 'Security'
    }
  ]);
  
  const [editingSetting, setEditingSetting] = useState<Setting | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const categories = Array.from(new Set(settings.map(s => s.category)));
  
  const handleEdit = (setting: Setting) => {
    setEditingSetting(setting);
    setEditValue(setting.value);
    setIsEditDialogOpen(true);
  };
  
  const handleSave = () => {
    if (editingSetting) {
      setSettings(prev =>
        prev.map(s =>
          s.id === editingSetting.id ? { ...s, value: editValue } : s
        )
      );
      onUpdateSetting(editingSetting.name, editValue);
      setIsEditDialogOpen(false);
      setEditingSetting(null);
      setEditValue('');
    }
  };
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">System Settings</h1>
        <p className="text-gray-600">Configure system-wide settings and preferences</p>
      </div>
      
      {/* Settings by Category */}
      <div className="space-y-6 mb-12">
        {categories.map((category) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
              <CardDescription>{category} configuration settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settings
                  .filter(s => s.category === category)
                  .map((setting) => (
                    <div
                      key={setting.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-1">{setting.name}</h3>
                        <p className="text-sm text-gray-600">{setting.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-blue-600">{setting.value}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(setting)}
                        >
                          <Edit className="size-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Audit Log */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <History className="size-5 text-gray-600" />
            <h2 className="text-gray-900">Audit Log</h2>
          </div>
          <p className="text-sm text-gray-600 mt-1">Track all system configuration changes</p>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Changed By</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Field</TableHead>
                <TableHead>Previous Value</TableHead>
                <TableHead>New Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-gray-600">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-gray-900">{log.changedBy}</TableCell>
                  <TableCell className="text-gray-600">{log.entity}</TableCell>
                  <TableCell className="text-gray-900">{log.field}</TableCell>
                  <TableCell className="text-gray-600">{log.previousValue}</TableCell>
                  <TableCell className="text-blue-600">{log.newValue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {auditLogs.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No audit logs available
          </div>
        )}
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Setting</DialogTitle>
          </DialogHeader>
          
          {editingSetting && (
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-gray-900">{editingSetting.name}</Label>
                <p className="text-sm text-gray-600 mb-3">{editingSetting.description}</p>
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="Enter new value"
                />
              </div>
              
              <div className="flex gap-3 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingSetting(null);
                    setEditValue('');
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
