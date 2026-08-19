import { useState, useCallback } from 'react';
import {
  getResources,
  updateResource as apiUpdateResource,
  deleteResource as apiDeleteResource,
} from '../../../services/api';
import toast from 'react-hot-toast';

export const useResources = () => {
  const [resources, setResources] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isSavingId, setIsSavingId] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState(null);

  const fetchResources = useCallback(async (subjectId) => {
    if (!subjectId) {
      setResources([]);
      return;
    }

    setIsFetching(true);
    try {
      const res = await getResources(subjectId);
      setResources(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setResources([]);
      toast.error('Failed to load resources.');
    } finally {
      setIsFetching(false);
    }
  }, []);

  const updateResource = async (id, payload, onSuccess) => {
    setIsSavingId(id);
    try {
      const res = await apiUpdateResource(id, payload);
      const updatedResource = res.data?.data;

      // Update local state immediately
      if (updatedResource) {
        setResources((prev) => prev.map((r) => (r._id === id ? { ...r, ...updatedResource } : r)));
      } else {
        // Fallback if backend doesn't return full object
        setResources((prev) => prev.map((r) => (r._id === id ? { ...r, ...payload } : r)));
      }

      toast.success('Resource updated successfully.');
      if (onSuccess) onSuccess();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update resource.');
      return false;
    } finally {
      setIsSavingId(null);
    }
  };

  const deleteResource = async (id, onSuccess) => {
    setIsDeletingId(id);
    try {
      await apiDeleteResource(id);

      // Remove from local state immediately
      setResources((prev) => prev.filter((r) => r._id !== id));

      toast.success('Resource deleted successfully.');
      if (onSuccess) onSuccess();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete resource.');
      return false;
    } finally {
      setIsDeletingId(null);
    }
  };

  return {
    resources,
    isFetching,
    isSavingId,
    isDeletingId,
    fetchResources,
    updateResource,
    deleteResource,
  };
};
