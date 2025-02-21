import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Badge } from '../ui/badge';
import {
  AcademicCapIcon,
  CalendarIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { formatDate } from '@/lib/utils';
import { workshopStatusStyles } from '@/lib/constants';

const WorkshopCard = ({ workshop, ...props }: { workshop: Workshop }) => {
  return (
    <Card className="workshop-card" {...props}>
      <CardHeader>
        <CardTitle className="truncate text-xl font-bold text-blue-600">
          {workshop.title}
        </CardTitle>
        <CardDescription className="flex items-center text-blue-500">
          <AcademicCapIcon className="mr-2 h-4 w-4" />
          {workshop.professor.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex items-center text-gray-600">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDate(workshop.startDate)} - {formatDate(workshop.endDate)}
        </div>
        <div className="mb-4 flex items-center text-gray-600">
          <UserIcon className="mr-2 h-4 w-4" />
          {workshop.enrollmentsCount} participantes
        </div>
        <Badge
          variant="outline"
          className={
            workshopStatusStyles[
              workshop.status as keyof typeof workshopStatusStyles
            ]
          }
        >
          {workshop.status}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default WorkshopCard;
