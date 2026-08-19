import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../../services/api';

export const useSeniorManagement = () => {
  const [mentors, setMentors] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdatingId, setIsUpdatingId] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState(null);

  const fetchMentors = useCallback(async (branch, year) => {
    if (!branch) {
      setMentors([]);
      return;
    }

    setIsFetching(true);
    try {
      const params = { branch };
      if (year && year !== 'ALL') {
        params.currentYear = year;
      }

      const res = await api.get('/mentors', { params });
      setMentors(res.data?.data?.mentors || res.data?.data || []);
    } catch (err) {
      toast.error('Failed to fetch mentors');
      setMentors([]);
    } finally {
      setIsFetching(false);
    }
  }, []);

  const createMentor = async (payload, onSuccess) => {
    setIsCreating(true);
    try {
      await api.post('/mentors', payload);
      toast.success('Profile added successfully.');
      if (onSuccess) onSuccess();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add profile.');
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const updateMentor = async (id, payload, onSuccess) => {
    setIsUpdatingId(id);
    try {
      const res = await api.patch(`/mentors/${id}`, payload);
      setMentors((prev) => prev.map((m) => (m._id === id ? { ...m, ...res.data.data } : m)));
      toast.success('Profile updated successfully.');
      if (onSuccess) onSuccess();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
      return false;
    } finally {
      setIsUpdatingId(null);
    }
  };

  const deleteMentor = async (id, onSuccess) => {
    setIsDeletingId(id);
    try {
      await api.delete(`/mentors/${id}`);
      setMentors((prev) => prev.filter((m) => m._id !== id));
      toast.success('Profile deleted successfully.');
      if (onSuccess) onSuccess();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
      return false;
    } finally {
      setIsDeletingId(null);
    }
  };

  return {
    mentors,
    isFetching,
    isCreating,
    isUpdatingId,
    isDeletingId,
    fetchMentors,
    createMentor,
    updateMentor,
    deleteMentor,
  };
};
