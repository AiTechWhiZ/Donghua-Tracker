import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDonghua } from "../../contexts/DonghuaContext";
import DonghuaForm from "../../components/donghua/DonghuaForm";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";

const DonghuaEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { donghuaList, updateDonghua } = useDonghua();
  const [donghua, setDonghua] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const foundDonghua = donghuaList.find((d) => d._id === id);
    if (foundDonghua) {
      setDonghua(foundDonghua);
    } else {
      toast.error("❌ Donghua not found");
      navigate("/donghua");
    }
  }, [id, donghuaList, navigate]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await updateDonghua(id, formData);
      toast.success("✅ Donghua updated successfully! Changes saved!");
      navigate(`/donghua/${id}`);
    } catch (err) {
      toast.error(`❌ ${err.message || "Failed to update donghua"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/donghua/${id}`);
  };

  if (!donghua) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen p-4 rounded-xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Edit Donghua
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update information for "{donghua.title}"
          </p>
        </div>
      </div>

      {isSubmitting ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <DonghuaForm
          initialData={donghua}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default DonghuaEdit;
