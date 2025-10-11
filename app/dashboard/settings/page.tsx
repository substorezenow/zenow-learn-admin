'use client';

import React, { useState } from 'react';
import { Save, Settings, Database, Mail, Shield, Globe } from 'lucide-react';
import { InputField, TextareaField, CheckboxField, SelectField, SubmitButton } from '../../../lib/formFields';

export default function AdminSettingsPage() {
  const initialData = {
    siteName: 'Zenow Academy',
    siteDescription: 'Learn and grow with our comprehensive online courses',
    siteUrl: 'https://zenowacademy.com',
    adminEmail: 'admin@zenowacademy.com',
    supportEmail: 'support@zenowacademy.com',
    maxFileSize: 10,
    allowedFileTypes: 'jpg,jpeg,png,gif,pdf,mp4,mp3',
    enableRegistration: true,
    requireEmailVerification: true,
    enableComments: true,
    enableRatings: true,
    defaultLanguage: 'en',
    timezone: 'UTC',
    currency: 'USD',
    enableNotifications: true,
    enableAnalytics: true,
    googleAnalyticsId: '',
    facebookPixelId: '',
    stripePublicKey: '',
    stripeSecretKey: '',
    paypalClientId: '',
    paypalClientSecret: '',
    emailProvider: 'smtp',
    smtpHost: '',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    smtpEncryption: 'tls'
  };

  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (fieldName: string, value: string | number | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // Mock API call - in real implementation, you'd call the API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Admin Settings
        </h1>
        <p className="text-gray-600 mt-1">Manage your platform settings and configuration</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-8">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name="siteName"
              value={formData.siteName}
              onChange={(value) => handleInputChange('siteName', value)}
              onBlur={() => {}}
              error={undefined}
              required
              label="Site Name"
              placeholder="Enter site name"
            />

            <InputField
              name="siteUrl"
              value={formData.siteUrl}
              onChange={(value) => handleInputChange('siteUrl', value)}
              onBlur={() => {}}
              error={undefined}
              required
              type="url"
              label="Site URL"
              placeholder="https://example.com"
            />

            <div className="md:col-span-2">
              <TextareaField
                name="siteDescription"
                value={formData.siteDescription}
                onChange={(value) => handleInputChange('siteDescription', value)}
                onBlur={() => {}}
                error={undefined}
                label="Site Description"
                placeholder="Brief description of your platform"
                rows={3}
              />
            </div>

            <InputField
              name="adminEmail"
              value={formData.adminEmail}
              onChange={(value) => handleInputChange('adminEmail', value)}
              onBlur={() => {}}
              error={undefined}
              required
              type="email"
              label="Admin Email"
              placeholder="admin@example.com"
            />

            <InputField
              name="supportEmail"
              value={formData.supportEmail}
              onChange={(value) => handleInputChange('supportEmail', value)}
              onBlur={() => {}}
              error={undefined}
              required
              type="email"
              label="Support Email"
              placeholder="support@example.com"
            />
          </div>
        </div>

        {/* File Upload Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">File Upload Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name="maxFileSize"
              value={formData.maxFileSize}
              onChange={(value) => handleInputChange('maxFileSize', Number(value))}
              onBlur={() => {}}
              error={undefined}
              required
              type="number"
              min={1}
              max={100}
              label="Max File Size (MB)"
              placeholder="10"
            />

            <InputField
              name="allowedFileTypes"
              value={formData.allowedFileTypes}
              onChange={(value) => handleInputChange('allowedFileTypes', value)}
              onBlur={() => {}}
              error={undefined}
              required
              label="Allowed File Types"
              placeholder="jpg,jpeg,png,gif,pdf"
              helpText="Comma-separated list of allowed file extensions"
            />
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Feature Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CheckboxField
              name="enableRegistration"
              value={formData.enableRegistration}
              onChange={(value) => handleInputChange('enableRegistration', value)}
              onBlur={() => {}}
              error={undefined}
              label="Enable User Registration"
            />

            <CheckboxField
              name="requireEmailVerification"
              value={formData.requireEmailVerification}
              onChange={(value) => handleInputChange('requireEmailVerification', value)}
              onBlur={() => {}}
              error={undefined}
              label="Require Email Verification"
            />

            <CheckboxField
              name="enableComments"
              value={formData.enableComments}
              onChange={(value) => handleInputChange('enableComments', value)}
              onBlur={() => {}}
              error={undefined}
              label="Enable Comments"
            />

            <CheckboxField
              name="enableRatings"
              value={formData.enableRatings}
              onChange={(value) => handleInputChange('enableRatings', value)}
              onBlur={() => {}}
              error={undefined}
              label="Enable Ratings"
            />

            <CheckboxField
              name="enableNotifications"
              value={formData.enableNotifications}
              onChange={(value) => handleInputChange('enableNotifications', value)}
              onBlur={() => {}}
              error={undefined}
              label="Enable Notifications"
            />

            <CheckboxField
              name="enableAnalytics"
              value={formData.enableAnalytics}
              onChange={(value) => handleInputChange('enableAnalytics', value)}
              onBlur={() => {}}
              error={undefined}
              label="Enable Analytics"
            />
          </div>
        </div>

        {/* Localization Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-900">Localization</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SelectField
              name="defaultLanguage"
              value={formData.defaultLanguage}
              onChange={(value) => handleInputChange('defaultLanguage', value)}
              onBlur={() => {}}
              error={undefined}
              required
              label="Default Language"
              options={[
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Spanish' },
                { value: 'fr', label: 'French' },
                { value: 'de', label: 'German' },
                { value: 'zh', label: 'Chinese' },
              ]}
            />

            <SelectField
              name="timezone"
              value={formData.timezone}
              onChange={(value) => handleInputChange('timezone', value)}
              onBlur={() => {}}
              error={undefined}
              required
              label="Timezone"
              options={[
                { value: 'UTC', label: 'UTC' },
                { value: 'America/New_York', label: 'Eastern Time' },
                { value: 'America/Chicago', label: 'Central Time' },
                { value: 'America/Denver', label: 'Mountain Time' },
                { value: 'America/Los_Angeles', label: 'Pacific Time' },
              ]}
            />

            <SelectField
              name="currency"
              value={formData.currency}
              onChange={(value) => handleInputChange('currency', value)}
              onBlur={() => {}}
              error={undefined}
              required
              label="Currency"
              options={[
                { value: 'USD', label: 'US Dollar ($)' },
                { value: 'EUR', label: 'Euro (€)' },
                { value: 'GBP', label: 'British Pound (£)' },
                { value: 'JPY', label: 'Japanese Yen (¥)' },
                { value: 'CAD', label: 'Canadian Dollar (C$)' },
              ]}
            />
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Email Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              name="emailProvider"
              value={formData.emailProvider}
              onChange={(value) => handleInputChange('emailProvider', value)}
              onBlur={() => {}}
              error={undefined}
              label="Email Provider"
              options={[
                { value: 'smtp', label: 'SMTP' },
                { value: 'sendgrid', label: 'SendGrid' },
                { value: 'mailgun', label: 'Mailgun' },
              ]}
            />

            <InputField
              name="smtpHost"
              value={formData.smtpHost}
              onChange={(value) => handleInputChange('smtpHost', value)}
              onBlur={() => {}}
              error={undefined}
              label="SMTP Host"
              placeholder="smtp.gmail.com"
            />

            <InputField
              name="smtpPort"
              value={formData.smtpPort}
              onChange={(value) => handleInputChange('smtpPort', value)}
              onBlur={() => {}}
              error={undefined}
              type="number"
              label="SMTP Port"
              placeholder="587"
            />

            <SelectField
              name="smtpEncryption"
              value={formData.smtpEncryption}
              onChange={(value) => handleInputChange('smtpEncryption', value)}
              onBlur={() => {}}
              error={undefined}
              label="SMTP Encryption"
              options={[
                { value: 'none', label: 'None' },
                { value: 'tls', label: 'TLS' },
                { value: 'ssl', label: 'SSL' },
              ]}
            />

            <InputField
              name="smtpUsername"
              value={formData.smtpUsername}
              onChange={(value) => handleInputChange('smtpUsername', value)}
              onBlur={() => {}}
              error={undefined}
              label="SMTP Username"
              placeholder="your-email@gmail.com"
            />

            <InputField
              name="smtpPassword"
              value={formData.smtpPassword}
              onChange={(value) => handleInputChange('smtpPassword', value)}
              onBlur={() => {}}
              error={undefined}
              type="password"
              label="SMTP Password"
              placeholder="Your email password"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <SubmitButton
            loading={loading}
            disabled={false}
            loadingText="Saving..."
            className="w-auto px-8"
          >
            <div className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Settings
            </div>
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}