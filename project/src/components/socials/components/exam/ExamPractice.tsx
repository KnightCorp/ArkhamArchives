import React, { useState } from 'react';
import { Book, GraduationCap, Timer, Brain, ChevronDown } from 'lucide-react';

interface Stream {
  id: string;
  name: string;
  exams: {
    id: string;
    name: string;
  }[];
}

const streams: Stream[] = [
  {
    id: 'law',
    name: 'Law',
    exams: [
      { id: 'lsat', name: 'LSAT' },
      { id: 'lnat', name: 'LNAT' },
      { id: 'clat', name: 'CLAT' }
    ]
  },
  {
    id: 'management',
    name: 'Management',
    exams: [
      { id: 'cat', name: 'CAT' },
      { id: 'xat', name: 'XAT' },
      { id: 'mat', name: 'MAT' }
    ]
  },
  {
    id: 'engineering',
    name: 'Engineering',
    exams: [
      { id: 'iitjee', name: 'IIT JEE' },
      { id: 'bitsat', name: 'BITSAT' },
      { id: 'viteee', name: 'VITEEE' }
    ]
  },
  {
    id: 'arts',
    name: 'Arts',
    exams: [
      { id: 'ba', name: 'BA Entrance' },
      { id: 'nid', name: 'NID' },
      { id: 'nift', name: 'NIFT' }
    ]
  }
];

export const ExamPractice = () => {
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [showStreamDropdown, setShowStreamDropdown] = useState(false);
  const [showExamDropdown, setShowExamDropdown] = useState(false);

  const selectedStreamData = streams.find(s => s.id === selectedStream);

  return (
    <div className="space-y-8">
      {/* Selection Area */}
      <div className="grid grid-cols-2 gap-6">
        {/* Stream Selection */}
        <div className="relative">
          <button
            onClick={() => setShowStreamDropdown(!showStreamDropdown)}
            className="w-full flex items-center justify-between px-6 py-3 bg-black/50 text-matrix border border-matrix/30 rounded-lg hover:bg-matrix/10 transition-all font-code"
          >
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-5 h-5" />
              <span>{selectedStream ? streams.find(s => s.id === selectedStream)?.name : 'Select Stream'}</span>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${showStreamDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showStreamDropdown && (
            <div className="absolute z-10 w-full mt-2 bg-black/90 border border-matrix/30 rounded-lg shadow-lg">
              {streams.map(stream => (
                <button
                  key={stream.id}
                  onClick={() => {
                    setSelectedStream(stream.id);
                    setSelectedExam(null);
                    setShowStreamDropdown(false);
                  }}
                  className="w-full px-6 py-3 text-left hover:bg-matrix/10 transition-colors font-code text-matrix/80 hover:text-matrix first:rounded-t-lg last:rounded-b-lg"
                >
                  {stream.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Exam Selection */}
        <div className="relative">
          <button
            onClick={() => selectedStream && setShowExamDropdown(!showExamDropdown)}
            disabled={!selectedStream}
            className={`w-full flex items-center justify-between px-6 py-3 bg-black/50 border rounded-lg font-code transition-all ${
              selectedStream
                ? 'text-matrix border-matrix/30 hover:bg-matrix/10'
                : 'text-matrix/40 border-matrix/10 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Book className="w-5 h-5" />
              <span>{selectedExam ? selectedStreamData?.exams.find(e => e.id === selectedExam)?.name : 'Select Exam'}</span>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${showExamDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showExamDropdown && selectedStreamData && (
            <div className="absolute z-10 w-full mt-2 bg-black/90 border border-matrix/30 rounded-lg shadow-lg">
              {selectedStreamData.exams.map(exam => (
                <button
                  key={exam.id}
                  onClick={() => {
                    setSelectedExam(exam.id);
                    setShowExamDropdown(false);
                  }}
                  className="w-full px-6 py-3 text-left hover:bg-matrix/10 transition-colors font-code text-matrix/80 hover:text-matrix first:rounded-t-lg last:rounded-b-lg"
                >
                  {exam.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Practice Area */}
      {selectedExam ? (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-black/50 border border-matrix/30 rounded-lg p-6">
              <div className="flex items-center space-x-2 text-matrix/70 mb-4">
                <Timer className="w-5 h-5" />
                <span className="font-code">Practice Time</span>
              </div>
              <div className="text-3xl text-matrix font-code">24h</div>
            </div>
            <div className="bg-black/50 border border-matrix/30 rounded-lg p-6">
              <div className="flex items-center space-x-2 text-matrix/70 mb-4">
                <Brain className="w-5 h-5" />
                <span className="font-code">Questions Solved</span>
              </div>
              <div className="text-3xl text-matrix font-code">150</div>
            </div>
            <div className="bg-black/50 border border-matrix/30 rounded-lg p-6">
              <div className="flex items-center space-x-2 text-matrix/70 mb-4">
                <Book className="w-5 h-5" />
                <span className="font-code">Topics Covered</span>
              </div>
              <div className="text-3xl text-matrix font-code">8/12</div>
            </div>
          </div>

          {/* Practice Actions */}
          <div className="grid grid-cols-2 gap-6">
            <button className="px-6 py-4 bg-black/50 text-matrix border border-matrix/30 rounded-lg hover:bg-matrix/10 transition-all font-code">
              Start Practice Session
            </button>
            <button className="px-6 py-4 bg-black/50 text-matrix border border-matrix/30 rounded-lg hover:bg-matrix/10 transition-all font-code">
              View Previous Sessions
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-black/50 border border-matrix/30 rounded-lg p-8 text-center">
          <Book className="w-12 h-12 text-matrix/50 mx-auto mb-4" />
          <p className="text-matrix/70 font-code">Select a stream and exam to start practicing</p>
        </div>
      )}
    </div>
  );
};