/* Firebase integration for MD MILON MIA portfolio. Public web config is not a server secret. */
const firebaseConfig = {
  apiKey: "AIzaSyAJB_g1W2CL-wMobBxCpKFMtD6VckJ66yg",
  authDomain: "milon-portfolio.firebaseapp.com",
  projectId: "milon-portfolio",
  storageBucket: "milon-portfolio.firebasestorage.app",
  messagingSenderId: "1000018252283",
  appId: "1:1000018252283:web:01f1b2db4974d3bd5a7b5e",
  measurementId: "G-FX0T3BLYG0"
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
window.milonAuth = firebase.auth();
window.milonDb = firebase.firestore();
window.MILON_CONTENT_REF = window.milonDb.collection('portfolio').doc('content');
window.MILON_FIREBASE_LOAD = async function () {
  try {
    const snap = await window.MILON_CONTENT_REF.get();
    if (snap.exists && snap.data().content && typeof snap.data().content === 'object') {
      const remote = snap.data().content;
      const merged = { ...Store.get(), ...remote };
      localStorage.setItem('MILON_PRO_V6', JSON.stringify(merged));
      return merged;
    }
  } catch (e) { console.warn('Could not load portfolio content from Firestore:', e.code || e.message); }
  return Store.get();
};
window.MILON_FIREBASE_SAVE = async function (content) {
  if (!window.milonAuth.currentUser) throw new Error('Please log in first.');
  const safeContent = { ...content };
  delete safeContent.admin; // Never publish legacy local username/password fields.
  await window.MILON_CONTENT_REF.set({ content: safeContent, updatedAt: firebase.firestore.FieldValue.serverTimestamp(), updatedBy: window.milonAuth.currentUser.uid });
  localStorage.setItem('MILON_PRO_V6', JSON.stringify(content));
};
