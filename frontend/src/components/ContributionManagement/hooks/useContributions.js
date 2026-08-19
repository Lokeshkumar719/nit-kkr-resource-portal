import { useState, useCallback } from 'react';
import {
  getContributions,
  approveContribution as apiApproveContribution,
  rejectContribution as apiRejectContribution,
  updateContribution as apiUpdateContribution,
} from '../../../services/api';
import toast from 'react-hot-toast';

export const useContributions = () => {
  const [contributions, setContributions] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isApprovingId, setIsApprovingId] = useState(null);
  const [isRejectingId, setIsRejectingId] = useState(null);
  const [isSavingId, setIsSavingId] = useState(null);

  const fetchContributionsList = useCallback(async (status = 'PENDING') => {
    setIsFetching(true);
    try {
      const res = await getContributions({ status });
      setContributions(res.data?.data || []);
    } catch (e) {
      toast.error('Failed to fetch contributions');
      setContributions([]);
    } finally {
      setIsFetching(false);
    }
  }, []);

  const approveContribution = async (id, onSuccess) => {
    setIsApprovingId(id);
    try {
      await apiApproveContribution(id);
      setContributions((prev) => prev.filter((c) => c._id !== id));
      toast.success('Contribution approved successfully.');
      if (onSuccess) onSuccess();
      return true;
    } catch (e) {
      toast.error('Approve failed: ' + (e.response?.data?.message || 'Unknown error'));
      return false;
    } finally {
      setIsApprovingId(null);
    }
  };

  const rejectContribution = async (id, reason, onSuccess) => {
    setIsRejectingId(id);
    try {
      // Assuming reject API takes id only, as reason is frontend-only requested by user
      await apiRejectContribution(id);
      setContributions((prev) => prev.filter((c) => c._id !== id));
      toast.success('Contribution rejected.');
      if (onSuccess) onSuccess();
      return true;
    } catch (e) {
      toast.error('Reject failed: ' + (e.response?.data?.message || 'Unknown error'));
      return false;
    } finally {
      setIsRejectingId(null);
    }
  };

  const updateContribution = async (id, data, onSuccess) => {
    setIsSavingId(id);
    try {
      await apiUpdateContribution(id, data);
      setContributions((prev) => prev.map((c) => (c._id === id ? { ...c, ...data } : c)));
      toast.success('Contribution updated successfully.');
      if (onSuccess) onSuccess();
      return true;
    } catch (e) {
      toast.error('Update failed: ' + (e.response?.data?.message || 'Unknown error'));
      return false;
    } finally {
      setIsSavingId(null);
    }
  };

  return {
    contributions,
    isFetching,
    isApprovingId,
    isRejectingId,
    isSavingId,
    fetchContributionsList,
    approveContribution,
    rejectContribution,
    updateContribution,
  };
};
