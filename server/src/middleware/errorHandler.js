export const notFound = (req, res) => res.status(404).json({ error: 'Route not found.' });
export const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ error: err.userMessage || 'Something went wrong. Try again.' });
};
