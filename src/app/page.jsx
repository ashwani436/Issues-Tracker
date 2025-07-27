"use client";

import { IssuesTable } from '@/components/IssuesTable';
import { useIssues } from '@/lib/queries';

export default function Home() {
  const { data: issues = [], isLoading, error } = useIssues();

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">
          Error loading issues: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Issues Tracker</h1>
        <p className="text-muted-foreground mt-2">
          Manage and track your project issues
        </p>
      </div>
      
      <IssuesTable data={issues} loading={isLoading} />
    </div>
  );
}
