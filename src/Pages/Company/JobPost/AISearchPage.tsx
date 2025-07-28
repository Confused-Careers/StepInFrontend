import { CompanyDashboardShell } from "../Dashboard/CompanyDashboardShell";
import { AIApplicantSearch } from "./AIApplicantSearch";
import { useParams } from "react-router-dom";

export function AISearchPage() {
  const { jobId } = useParams();

  return (
    <CompanyDashboardShell>
      <div className="max-w-6xl mx-auto">
        <AIApplicantSearch jobId={jobId} />
      </div>
    </CompanyDashboardShell>
  );
}