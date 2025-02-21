import { calculateDuration, cn, formatDate } from '@/lib/utils';
import React from 'react';
import { Badge } from '../ui/badge';
import { workshopStatusStyles } from '@/lib/constants';
import {
  AcademicCapIcon,
  CalendarIcon,
  ClockIcon,
  EnvelopeIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import {
  DeleteWorkshopButton,
  EditWorkshopButton,
} from '@/components/root/WorkshopButtons';
import { CancelEnrollmentButton } from '@/components/root/EnrollmentButtons';

const WorkshopDetails = ({
  workshop,
  user,
}: {
  workshop: Workshop;
  user: loggedUser;
}) => {
  const duration = calculateDuration(workshop.startDate, workshop.endDate);

  return (
    <div className="mb-10">
      <div className="flex-between mb-8">
        <h1 className="text-3xl font-bold text-blue-600">{workshop.title}</h1>
        <Badge
          variant={'outline'}
          className={cn(
            'px-3 py-1 text-lg',
            workshopStatusStyles[
              workshop.status as keyof typeof workshopStatusStyles
            ]
          )}
        >
          {workshop.status}
        </Badge>
      </div>
      <div className="mb-8 grid gap-5 md:grid-cols-2">
        <div>
          <h2 className="workshop-section">Detalhes do Workshop</h2>
          <div className="space-y-3">
            <div className="workshop-info">
              <CalendarIcon className="workshop-icon" />
              <span>
                {formatDate(workshop.startDate)} -{' '}
                {formatDate(workshop.endDate)}
              </span>
            </div>
            <div className="workshop-info">
              <ClockIcon className="workshop-icon" />
              <span>{duration}</span>
            </div>
            <div className="workshop-info">
              <UserIcon className="workshop-icon" />
              <span>{workshop.enrollmentsCount} participantes</span>
            </div>
          </div>
        </div>
        <div>
          <h2 className="workshop-section">Informações do Professor</h2>
          <div className="space-y-3">
            <div className="workshop-info">
              <AcademicCapIcon className="workshop-icon" />
              <span>{workshop.professor.name}</span>
            </div>
            <div className="workshop-info">
              <EnvelopeIcon className="workshop-icon" />
              <span>{workshop.professor.email}</span>
            </div>
          </div>
        </div>
      </div>
      {workshop.description && (
        <div className="mb-10">
          <h2 className="workshop-section">Descrição</h2>
          <p className="text-gray-600">{workshop.description}</p>
        </div>
      )}
      {user.role === 'user' ? (
        <CancelEnrollmentButton workshopId={workshop.id} />
      ) : (
        <div className="flex gap-4">
          <EditWorkshopButton id={workshop.id} />
          <DeleteWorkshopButton id={workshop.id} />
        </div>
      )}
    </div>
  );
};

export default WorkshopDetails;
