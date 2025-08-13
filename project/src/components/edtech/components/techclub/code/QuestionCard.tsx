import React, { useState } from "react";
import { CodeEditor } from "./CodeEditor";

const QuestionCard = ({ question }: { question: any }) => {
  return (
    <>
      <h3 className="text-lg font-bold text-[#C0C0C0] mb-1 mt-4">{question.title}</h3>
      <div className="text-base text-white mb-2">{question.description}</div>
    </>
  );
};

export default QuestionCard; 