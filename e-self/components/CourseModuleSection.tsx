'use client';
import { useState } from 'react';
import { CourseModule } from '../app/types/module';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function CourseModuleSection({ module }: { module: CourseModule }) {
  const [open, setOpen] = useState(false);

  const totalDuration = module.lectures.reduce((acc, lecture) => {
    const [min, sec] = lecture.duration.split(':').map(Number);
    return acc + (min * 60 + sec);
  }, 0);

  const formattedDuration = `${Math.floor(totalDuration / 60)}min`;

  return (
    <div className="border rounded-md mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 flex justify-between items-center"
      >
        <span>{module.title}</span>
        <span className="text-sm text-gray-500">{module.lectures.length} lectures • {formattedDuration}</span>
        {open ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
      </button>

      {open && (
        <ul className="bg-white px-4 py-2">
          {module.lectures.map((lecture, index) => (
            <li key={index} className="py-1 flex justify-between">
              <span className="text-sm">{lecture.title}</span>
              <span className="text-sm text-gray-500">{lecture.duration}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
