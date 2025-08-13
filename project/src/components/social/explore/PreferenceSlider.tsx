import React from 'react';
import styles from './PreferenceSlider.module.css';

interface PreferenceSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export const PreferenceSlider = ({ label, value, onChange }: PreferenceSliderProps) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-zinc-400 text-sm">
        {label}
      </label>
      <span className="text-zinc-500 text-xs">
        {value}%
      </span>
    </div>
    <div className="relative">
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={styles.slider}
        style={{
          background: `linear-gradient(to right, rgb(244,244,245) ${value}%, rgb(39,39,42) ${value}%)`
        }}
      />
    </div>
  </div>
);