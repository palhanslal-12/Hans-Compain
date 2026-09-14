const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add import
if (!code.includes('WelcomeOnboardingModal')) {
    code = code.replace(
        "import { AuthGateView } from './components/AuthGateView';",
        "import { AuthGateView } from './components/AuthGateView';\nimport { WelcomeOnboardingModal } from './components/WelcomeOnboardingModal';"
    );
}

// 2. Add state
if (!code.includes('showWelcomeProfile')) {
    const userStateRegex = /const \[user, setUser\] = useState<\{.*?\}\s*\|\s*null>\(\(\) => \{/;
    code = code.replace(
        userStateRegex,
        "const [showWelcomeProfile, setShowWelcomeProfile] = useState(false);\n  const [user, setUser] = useState<{ email: string; name: string; userId?: string; role?: string; avatarUrl?: string; targetExam?: string } | null>(() => {"
    );
}

// 3. Add useEffect
const useEffectBlock = `
  useEffect(() => {
    if (user) {
      const hasCompleted = localStorage.getItem('hansai-onboarding-completed');
      if (!hasCompleted) {
        // Show after a small delay to make it feel natural after login
        setTimeout(() => setShowWelcomeProfile(true), 1500);
      }
    } else {
      setShowWelcomeProfile(false);
    }
  }, [user]);
`;

if (!code.includes("localStorage.getItem('hansai-onboarding-completed')")) {
    const activeViewEffect = "useEffect(() => {\n    prevActiveViewRef.current = activeView;\n  }, [activeView]);";
    code = code.replace(activeViewEffect, activeViewEffect + "\n" + useEffectBlock);
}

// 4. Add the component rendering near the modals
const modalBlock = `
      {showWelcomeProfile && user && (
        <WelcomeOnboardingModal 
          user={user}
          onComplete={(profile) => {
            console.log("Profile Saved:", profile);
            localStorage.setItem('hansai-onboarding-completed', 'true');
            localStorage.setItem('hansai-user-profile-data', JSON.stringify(profile));
            setShowWelcomeProfile(false);
            showToast("आपका प्रोफ़ाइल सेट हो गया! शुभकामनाएँ 🚀", "success");
          }}
          onSkip={() => {
            localStorage.setItem('hansai-onboarding-completed', 'true'); // don't show again
            setShowWelcomeProfile(false);
          }}
        />
      )}
`;

if (!code.includes('<WelcomeOnboardingModal')) {
    // Find a good place to insert, like before {isAuthRegisterOpen &&
    code = code.replace(
      "{isAuthRegisterOpen && (",
      modalBlock + "\n      {isAuthRegisterOpen && ("
    );
}

fs.writeFileSync('src/App.tsx', code);
console.log("Successfully injected WelcomeOnboardingModal");
