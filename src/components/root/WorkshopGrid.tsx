import React from 'react';
import {
  fetchAvailableWorkshops,
  fetchWorkshops,
} from '@/actions/workshop/fetchWorkshopsActions';
import Link from 'next/link';
import WorkshopCard from './WorkshopCard';
import EnrollStudentModal from './EnrollStudentModal';

interface WorkshopGridProps {
  query: string;
  page: number;
  type?: 'all' | 'available';
}

const WorkshopGrid = async ({ query, page, type }: WorkshopGridProps) => {
  const workshops =
    type === 'all'
      ? await fetchWorkshops(query, page)
      : await fetchAvailableWorkshops(query, page);

  if (workshops.length === 0) return null;

  return (
    <div className="workshop-grid">
      {type === 'all'
        ? workshops.map((workshop) => (
            <Link href={`/workshops/${workshop.id}`} key={workshop.id}>
              <WorkshopCard workshop={workshop} />
            </Link>
          ))
        : workshops.map((workshop) => (
            <EnrollStudentModal workshop={workshop} key={workshop.id} />
          ))}
    </div>
  );
};

export default WorkshopGrid;
