'use client';
import { useState } from "react";
import {
  BookOpenIcon, TagIcon, AcademicCapIcon, DocumentTextIcon,
  ArrowRightIcon, VideoCameraIcon, DevicePhoneMobileIcon, DeviceTabletIcon
} from "@heroicons/react/24/outline";
import { BookOpenIcon as SolidBookOpenIcon } from "@heroicons/react/24/solid";

export default function AddCourse() {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("web");
  const [level, setLevel] = useState("beginner");
  const [description, setDescription] = useState("");
  const [learningObjectives, setLearningObjectives] = useState([""]);
  const [prerequisites, setPrerequisites] = useState("");
  const [courseAudience, setCourseAudience] = useState("");
  const [videoTime, setVideoTime] = useState("");
  const [numArticles, setNumArticles] = useState("");
  const [accessDevices, setAccessDevices] = useState("");
  const [certificate, setCertificate] = useState(false);
  const [numSections, setNumSections] = useState(1);
  const [sections, setSections] = useState([{ numLectures: 0, links: [] }]);

  const handleNextStep = () => setStep(step + 1);
  const handleAddLearningObjective = () => setLearningObjectives([...learningObjectives, ""]);
  const handleLearningObjectiveChange = (i: number, value: string) => {
    const updated = [...learningObjectives];
    updated[i] = value;
    setLearningObjectives(updated);
  };
  const handleSectionChange = (i: number, field: string, value: any) => {
    const updated = [...sections];
    updated[i][field] = value;
    setSections(updated);
  };

  const Label = ({ icon: Icon, text }: { icon: any, text: string }) => (
    <label className="text-sm text-gray-700 font-medium flex items-center gap-1 mb-1">
      <Icon className="h-5 w-5 text-red-500" />
      {text}
    </label>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
      <SolidBookOpenIcon className="h-6 w-6 text-red-500" />
      {title}
    </h2>
  );

  return (
    <div className="w-full min-h-screen p-6 bg-gray-50 rounded-lg space-y-6">
      {step === 1 && (
        <>
          <SectionHeader title="Create a New Course" />
          <p className="text-sm text-gray-500 mb-4">Start by adding the course basics.</p>

          <div>
            <Label icon={BookOpenIcon} text="Course Title" />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Enter course title"
            />
          </div>

          <div>
            <Label icon={TagIcon} text="Category" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="web">Web Development</option>
              <option value="ui">UI/UX Design</option>
              <option value="video editing">Video Editing</option>
            </select>
          </div>

          <div>
            <Label icon={AcademicCapIcon} text="Level" />
            <div className="flex gap-4 text-sm text-gray-600">
              {["beginner", "intermediate", "expert"].map((lvl) => (
                <label key={lvl} className="flex items-center gap-2">
                  <input
                    type="radio"
                    value={lvl}
                    checked={level === lvl}
                    onChange={() => setLevel(lvl)}
                  />
                  {lvl[0].toUpperCase() + lvl.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label icon={DocumentTextIcon} text="Description" />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief course description..."
              maxLength={2000}
              className="w-full h-32 p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button className="text-sm border border-gray-300 px-4 py-2 rounded hover:bg-gray-200">Save Draft</button>
            <button onClick={handleNextStep} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm">
              Save and Continue <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <SectionHeader title="Course Details" />

          <div>
            <Label icon={DocumentTextIcon} text="Learning Objectives" />
            {learningObjectives.map((obj, i) => (
              <input
                key={i}
                value={obj}
                onChange={(e) => handleLearningObjectiveChange(i, e.target.value)}
                placeholder={`Objective ${i + 1}`}
                className="w-full mb-2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-400"
              />
            ))}
            <button onClick={handleAddLearningObjective} className="text-sm text-red-600 mt-1">+ Add more</button>
          </div>

          <div>
            <Label icon={TagIcon} text="Prerequisites" />
            <textarea
              value={prerequisites}
              onChange={(e) => setPrerequisites(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-red-400"
              placeholder="Skills or tools required before taking this course"
            />
          </div>

          <div>
            <Label icon={AcademicCapIcon} text="Target Audience" />
            <textarea
              value={courseAudience}
              onChange={(e) => setCourseAudience(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-red-400"
              placeholder="Who is this course designed for?"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button className="text-sm border border-gray-300 px-4 py-2 rounded hover:bg-gray-200">Save Draft</button>
            <button onClick={handleNextStep} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm">
              Save and Continue <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <SectionHeader title="Course Content" />

          <div className="grid gap-4">
            <div>
              <Label icon={VideoCameraIcon} text="Total Video Time" />
              <input
                value={videoTime}
                onChange={(e) => setVideoTime(e.target.value)}
                placeholder="e.g., 2h 30m"
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div>
              <Label icon={DocumentTextIcon} text="Number of Articles" />
              <input
                value={numArticles}
                onChange={(e) => setNumArticles(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div>
              <Label icon={DevicePhoneMobileIcon} text="Access Devices" />
              <input
                value={accessDevices}
                onChange={(e) => setAccessDevices(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>

          <div>
            <Label icon={DocumentTextIcon} text="Number of Sections" />
            <input
              type="number"
              value={numSections}
              onChange={(e) => setNumSections(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-red-400"
            />
          </div>

          {Array.from({ length: numSections }).map((_, i) => (
            <div key={i} className="mt-4 space-y-2">
              <p className="text-sm text-gray-600">Section {i + 1}</p>
              <input
                type="number"
                value={sections[i]?.numLectures}
                onChange={(e) => handleSectionChange(i, "numLectures", Number(e.target.value))}
                placeholder="Number of Lectures"
                className="w-full p-2 border border-gray-300 rounded"
              />
              {Array.from({ length: sections[i]?.numLectures }).map((_, j) => (
                <input
                  key={j}
                  type="text"
                  value={sections[i]?.links[j] || ""}
                  onChange={(e) => {
                    const links = [...(sections[i].links || [])];
                    links[j] = e.target.value;
                    handleSectionChange(i, "links", links);
                  }}
                  placeholder={`Lecture ${j + 1} link`}
                  className="w-full p-2 border border-gray-200 rounded"
                />
              ))}
            </div>
          ))}

          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              checked={certificate}
              onChange={() => setCertificate(!certificate)}
            />
            <span className="text-sm text-gray-700">Students receive certificate upon completion</span>
          </div>

          <div className="flex justify-between pt-4">
            <button className="text-sm border border-gray-300 px-4 py-2 rounded hover:bg-gray-200">Save Draft</button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm">
              Save and Continue <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
