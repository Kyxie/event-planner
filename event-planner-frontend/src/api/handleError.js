export const handleError = (error) => {
  if (axios.isAxiosError(error)) {
    console.error('API error:', error.response?.data || error.message);
  } else {
    console.error('Unexpected error:', error);
  }
};
