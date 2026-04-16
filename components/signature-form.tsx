import React from 'react';
import Image from 'next/image';
import { User, Briefcase, Phone, Twitter, Linkedin, Globe } from 'lucide-react';
import { InputField } from '@/components/ui/input-field';
import { SpotlightWrapper } from '@/components/ui/spotlight-wrapper';
import type { SignatureData } from '@/lib/types';

interface SignatureFormProps {
  signatureData: SignatureData;
  updateField: (field: keyof SignatureData) => (value: string) => void;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SignatureForm = React.memo(({ signatureData, updateField, handleLogoUpload }: SignatureFormProps) => {
  return (
    <SpotlightWrapper
      className="glass-dark transition-all duration-700 border border-white/5 rounded-lg px-3 pb-2 shadow-2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
        <InputField
          label="Full Name"
          icon={User}
          value={signatureData.name}
          onChange={updateField('name')}
          placeholder="e.g. Geralt of Rivia"
          onClear={() => updateField('name')('')}
        />
        <InputField
          label="Job Title"
          icon={Briefcase}
          value={signatureData.title}
          onChange={updateField('title')}
          placeholder="e.g. Monster Hunter"
          onClear={() => updateField('title')('')}
        />
        <InputField
          label="Company"
          icon={Globe}
          value={signatureData.company}
          onChange={updateField('company')}
          placeholder="e.g. Witcher Services LLC"
          onClear={() => updateField('company')('')}
        />
        <InputField
          label="Phone Number"
          icon={Phone}
          value={signatureData.phone}
          onChange={updateField('phone')}
          placeholder="e.g. +1 (555) 000-WOLF"
          onClear={() => updateField('phone')('')}
        />
        <InputField
          label="Twitter / X"
          icon={Twitter}
          value={signatureData.twitter}
          onChange={updateField('twitter')}
          placeholder="e.g. @blaviken_butcher"
          onClear={() => updateField('twitter')('')}
        />
        <InputField
          label="LinkedIn"
          icon={Linkedin}
          value={signatureData.linkedin}
          onChange={updateField('linkedin')}
          placeholder="e.g. geralt-of-rivia"
          onClear={() => updateField('linkedin')('')}
        />
        <InputField
          label="Website"
          icon={Globe}
          value={signatureData.website}
          onChange={updateField('website')}
          placeholder="e.g. https://sigsmith.vercel.app"
          onClear={() => updateField('website')('')}
        />

        {/* Logo Upload - Integrated into grid but smaller */}
        <div className="space-y-0.5 mt-0.5">
          <label className="text-[8px] font-bold text-zinc-500 ml-1 uppercase tracking-wider font-outfit">
            Company Logo
          </label>
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 bg-zinc-900/80 border border-zinc-800 rounded-md overflow-hidden flex-shrink-0 backdrop-blur-sm">
              {signatureData.logoUrl && (
                <Image
                  src={signatureData.logoUrl}
                  alt="Logo Preview"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
            <label className="flex-1 flex items-center justify-center px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-md text-[9px] font-bold text-zinc-500 hover:text-white hover:border-rose-500/50 cursor-pointer transition-all uppercase tracking-tighter">
              <span>Change Logo</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
            </label>
          </div>
        </div>
      </div>
    </SpotlightWrapper>
  );
});

SignatureForm.displayName = 'SignatureForm';
