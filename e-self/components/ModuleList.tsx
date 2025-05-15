import { CourseModule } from '../app/types/module';


interface ModuleListProps {
  modules: CourseModule[];
}

export default function ModuleList({ modules }: ModuleListProps) {
  return (
    <ul className="space-y-4 list-disc list-inside">
      {modules.map((module, index) => (
        <li key={index}>
          <p className="font-semibold">{module.title}</p>
          <p className="text-gray-600">{module.description}</p>
        </li>
      ))}
    </ul>
  );
}
