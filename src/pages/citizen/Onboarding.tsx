import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { WEST_BENGAL_DATA } from "@/data/westBengal";
import { useAuth } from "@/contexts/AuthContext";


export default function Onboarding() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { user } = useAuth();
  const [language, setLanguage] = useState<string>(() => {
    return user?.language || localStorage.getItem('appLanguage') || "";
  });
  const [district, setDistrict] = useState<string>(
    localStorage.getItem('district') || ""
  );
  const [municipality, setMunicipality] = useState<string>(
    localStorage.getItem('municipality') || ""
  );

  const districts = Object.keys(WEST_BENGAL_DATA);
  const municipalities = district ? WEST_BENGAL_DATA[district] : [];
  const { updateUser } = useAuth();

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language]);
  const handleNext = () => {
  if (!language || !district || !municipality) {
    alert("Please select all fields");
    return;
  }

  localStorage.setItem("appLanguage", language);
  localStorage.setItem("district", district);
  localStorage.setItem("municipality", municipality);

  // ✅ Update Auth user state
  updateUser({
    language: language,
  });

  i18n.changeLanguage(language);

  navigate("/citizen/profile-setup");
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-card p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center">
          Select Your Preferences
        </h2>

        {/* Language */}
        <div>
          <label className="block mb-2 font-medium">Select Language</label>
          <select
            className="w-full border rounded p-2"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">Choose</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="bn">Bengali</option>
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block mb-2 font-medium">Select District</label>
          <select
            className="w-full border rounded p-2"
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              setMunicipality("");
            }}
          >
            <option value="">Choose</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Municipality */}
        <div>
          <label className="block mb-2 font-medium">Select Municipality</label>
          <select
            className="w-full border rounded p-2"
            value={municipality}
            onChange={(e) => setMunicipality(e.target.value)}
            disabled={!district}
          >
            <option value="">Choose</option>
            {municipalities.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-primary text-white py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}