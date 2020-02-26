export default function() {
  return {
    user: null,
    account: {
      admin: false,
    },
    authSet: false,
    profiles: null,
    activeProfile: null,
    defaultProfile: null,
    profileSettings: {
      editProfile: false,
      addProfile: false,
    },
    userError: null,
  };
}
