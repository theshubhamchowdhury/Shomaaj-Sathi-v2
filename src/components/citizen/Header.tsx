import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Bell, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";


export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Example Admin Notifications (connected to DB)
 const [notifications, setNotifications] = useState([]);


  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  // PASTE THIS NEW useEffect BELOW

useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const userRes = await axios.get(
        "http://localhost:5000/api/user/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const wardNumber = userRes.data.wardNumber;

      const alertRes = await axios.get(
        `http://localhost:5000/api/alerts/${wardNumber}`
      );

      setNotifications(alertRes.data);

    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  fetchNotifications();
}, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">

        {/* Left Section */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center shadow-md overflow-hidden border-2 border-primary/20">
            <img
              src="/munilogo.png"
              alt="Municipal Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl lg:text-2xl font-extrabold text-primary leading-tight">
              সমাজ সাথী
            </h1>
            <h2 className="text-sm md:text-base font-semibold text-primary/85 -mt-1">
              Shomaaj Sathi
            </h2>
            <p className="text-xs text-gray-500 leading-tight">
              Building a Better Tomorrow
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          {/* 🔔 Notification Icon */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => {
                setIsNotificationOpen(!isNotificationOpen);
                setIsDropdownOpen(false);
              }}
              className="w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
            >
              <Bell className="w-5 h-5 text-gray-600" />

              {/* Red Badge */}
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Notification Panel */}
            {isNotificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 animate-fade-in">
                
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Notifications
                  </h3>
                  <button onClick={() => setIsNotificationOpen(false)}>
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* Notifications List */}
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500 px-4 py-6 text-center">
                      No notifications
                    </p>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                      >
                        <p className="text-sm font-medium text-gray-800">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {item.message}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {item.date}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {item.time}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 👤 Profile Icon */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                setIsNotificationOpen(false);
              }}
              className="w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
            >
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                <button
                  onClick={() => navigate('/citizen/profile')}
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
