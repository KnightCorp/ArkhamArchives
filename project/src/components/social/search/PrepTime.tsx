import React from 'react';
import { StrategicAnalysis } from './prep-time/StrategicAnalysis';
import { MentalModels } from './mental-models/MentalModels';
import { Frameworks } from './prep-time/Frameworks';
import { Scenarios } from './prep-time/Scenarios';

export const PrepTime = () => (
  <div className="space-y-12">
    <StrategicAnalysis />
    <Frameworks />
    <Scenarios />
    <MentalModels />
  </div>
);