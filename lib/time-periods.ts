export const today = new Date();
// export const tomorrow = new Date(today);
// tomorrow.setDate(tomorrow.getDate() + 1);

export const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
