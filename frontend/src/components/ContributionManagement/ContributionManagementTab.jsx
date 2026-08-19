import React, { useState, useEffect } from 'react';
import { MessageSquare, RefreshCw } from 'lucide-react';
import useStickyState from '../../hooks/useStickyState';
import { useContributions } from './hooks/useContributions.js';
import ContributionFilters from './ContributionFilters.jsx';
import ContributionList from './ContributionList.jsx';
import EditContributionModal from './EditContributionModal.jsx';
import ApproveContributionModal from './ApproveContributionModal.jsx';
import RejectContributionModal from './RejectContributionModal.jsx';
import PageHeader from '../admin/common/PageHeader.jsx';

export default function ContributionManagementTab() {
  const [resourceFilter, setResourceFilter] = useStickyState('ALL', 'admin_contrib_filter');

  // Modal states
  const [editingContribution, setEditingContribution] = useState(null);
  const [approvingContribution, setApprovingContribution] = useState(null);
  const [rejectingContribution, setRejectingContribution] = useState(null);

  const {
    contributions,
    isFetching,
    isApprovingId,
    isRejectingId,
    isSavingId,
    fetchContributionsList,
    approveContribution,
    rejectContribution,
    updateContribution,
  } = useContributions();

  useEffect(() => {
    fetchContributionsList();
  }, [fetchContributionsList]);

  const handleSaveEdit = async (id, payload) => {
    await updateContribution(id, payload, () => setEditingContribution(null));
  };

  const handleConfirmApprove = async (id) => {
    await approveContribution(id, () => setApprovingContribution(null));
  };

  const handleConfirmReject = async (id, reason) => {
    await rejectContribution(id, reason, () => setRejectingContribution(null));
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={MessageSquare} title="Pending Contributions">
        <ContributionFilters
          contributions={contributions}
          currentFilter={resourceFilter}
          onFilterChange={setResourceFilter}
        />
        <button
          onClick={() => fetchContributionsList()}
          disabled={isFetching}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </PageHeader>

      <ContributionList
        contributions={contributions}
        isFetching={isFetching}
        currentFilter={resourceFilter}
        onEdit={setEditingContribution}
        onApprove={setApprovingContribution}
        onReject={setRejectingContribution}
        isApprovingId={isApprovingId}
        isRejectingId={isRejectingId}
      />

      {editingContribution && (
        <EditContributionModal
          contribution={editingContribution}
          isSaving={isSavingId === editingContribution._id}
          onSave={handleSaveEdit}
          onCancel={() => setEditingContribution(null)}
        />
      )}

      {approvingContribution && (
        <ApproveContributionModal
          contribution={approvingContribution}
          isApproving={isApprovingId === approvingContribution._id}
          onConfirm={handleConfirmApprove}
          onCancel={() => setApprovingContribution(null)}
        />
      )}

      {rejectingContribution && (
        <RejectContributionModal
          contribution={rejectingContribution}
          isRejecting={isRejectingId === rejectingContribution._id}
          onConfirm={handleConfirmReject}
          onCancel={() => setRejectingContribution(null)}
        />
      )}
    </div>
  );
}
