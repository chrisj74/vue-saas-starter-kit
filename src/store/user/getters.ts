export const user = (state: any) => {
  return state.user;
};

export const profile = (state: any) => {
  return state.activeProfile;
};

export const profiles = (state: any) => {
  return state.profiles;
};

export const getAuthSet = (state: any) => {
  return state.authSet;
};

export const isAdmin = (state: any) => {
  return state.account.admin && state.activeProfile && state.activeProfile.default;
};

export const getProfileSettings = (state: any) => {
  return state.profileSettings;
};

/* export const getProfileById: (state: any) => (id) => {
  let profile = null;
  if (state.profiles && state.profiles.length > 0)
  state.profiles.forEach(prof => {
    if (prof.id === id) {
      profile = prof;
    }
  });
  return profile;
}; */

export const getUserError = (state: any) => {
  return state.userError;
};

export const getAccount = (state: any) => {
  return state.account;
};
