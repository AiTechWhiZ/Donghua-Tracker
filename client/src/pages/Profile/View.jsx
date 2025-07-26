import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";

const ProfileView = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>
        <div className="flex space-x-3">
          <Button as={Link} to="/profile/edit" variant="secondary">
            Edit Profile
          </Button>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-shrink-0 h-16 w-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              {user.avatar ? (
                <img
                  className="h-full w-full object-cover"
                  src={user.avatar}
                  alt={user.username}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <svg
                    className="h-10 w-10"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user.username}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {user.email || "Not provided"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Bio
              </h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {user.bio || "No bio yet."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
