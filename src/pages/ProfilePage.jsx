import { useStateContext } from "../contexts/AppContext";
import profileImg from "../assets/profile.jpg";

export default function ProfilePage() {
  const { user } = useStateContext();

  const defaultUser = {
    name: "Test",
    emp_id: "11111",
    image: "https://via.placeholder.com/150",
    roles: "Test",
  };

  const userInfo = user?.user || defaultUser;
  const roles = user?.roles || defaultUser.roles;
  if(!user){
    window.location.href = "/login";
  }

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        <img
          src={profileImg}
          alt="Profile"
          className="w-32 h-32 mx-auto rounded-full mb-4 border border-blue-500"
        />
        <h2 className="text-2xl font-bold mb-2">{userInfo.name}</h2>
        <p className="text-gray-600 mb-4">Employee ID: {userInfo.emp_id}</p>
        <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
          {roles}
        </button>
      </div>
    </div>
  );
}
