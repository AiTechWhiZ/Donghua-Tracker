import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDonghua } from "../../contexts/DonghuaContext";
import DonghuaForm from "../../components/donghua/DonghuaForm";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";

const DonghuaAdd = () => {
  const navigate = useNavigate();
  const { addDonghua } = useDonghua();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await addDonghua(formData);
      toast.success("🎉 Donghua added successfully! Your collection is growing!");
      navigate("/donghua");
    } catch (err) {
      toast.error(`❌ ${err.message || "Failed to add donghua"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/donghua");
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen p-4 rounded-xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Add New Donghua
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add a new donghua to your collection
          </p>
        </div>
      </div>

      {isSubmitting ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <DonghuaForm onSubmit={handleSubmit} onCancel={handleCancel} />
      )}
    </div>
  );
};

export default DonghuaAdd;
