import { useState, useCallback } from 'react';
import {
  api,
  updateSubject as apiUpdateSubject,
  deleteSubject as apiDeleteSubject,
} from '../../../services/api';
import toast from 'react-hot-toast';

export const useSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [isFetchingSubjects, setIsFetchingSubjects] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(null);

  const fetchSubjectsList = useCallback(async (branch, semester) => {
    if (!branch || !semester) {
      setSubjects([]);
      return;
    }

    setIsFetchingSubjects(true);
    try {
      const res = await api.get('/subjects', { params: { branch, semester } });
      setSubjects(res.data?.data?.subjects || res.data?.data || []);
    } catch (e) {
      console.error(e);
      setSubjects([]);
    } finally {
      setIsFetchingSubjects(false);
    }
  }, []);

  const createSubject = async (formData, onSuccess) => {
    try {
      const payload = {
        subjectName: formData.subjectName,
        subjectCode: formData.subjectCode,
        offeredTo: formData.offeredTo,
      };
      await api.post('/subjects', payload);
      toast.success('Subject created.');
      if (onSuccess) onSuccess();
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Operation failed.';
      toast.error(errorMsg);
      return false;
    }
  };

  const updateSubject = async (id, payload, onSuccess, currentBranch, currentSemester) => {
    setIsSaving(true);
    try {
      await apiUpdateSubject(id, payload);
      toast.success('Subject updated successfully.');
      if (onSuccess) onSuccess();
      if (currentBranch && currentSemester) {
        fetchSubjectsList(currentBranch, currentSemester);
      }
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update subject.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteSubject = async (id, onSuccess, currentBranch, currentSemester) => {
    setIsDeletingId(id);
    try {
      await apiDeleteSubject(id);
      toast.success('Subject deleted successfully.');
      if (onSuccess) onSuccess(id);
      if (currentBranch && currentSemester) {
        fetchSubjectsList(currentBranch, currentSemester);
      }
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete subject.');
      return false;
    } finally {
      setIsDeletingId(null);
    }
  };

  return {
    subjects,
    isFetchingSubjects,
    isSaving,
    isDeletingId,
    fetchSubjectsList,
    createSubject,
    updateSubject,
    deleteSubject,
  };
};
