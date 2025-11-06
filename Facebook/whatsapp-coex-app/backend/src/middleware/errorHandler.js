// Middleware de tratamento de erros
const errorHandler = (err, req, res, next) => {
  console.error('Erro capturado pelo middleware:', err);

  // Erros de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      errors: err.errors
    });
  }

  // Erros do Axios (requisições HTTP)
  if (err.response) {
    return res.status(err.response.status || 500).json({
      success: false,
      message: err.response.data?.error?.message || err.message,
      details: err.response.data
    });
  }

  // Erros genéricos
  res.status(500).json({
    success: false,
    message: err.message || 'Erro interno do servidor'
  });
};

module.exports = errorHandler;
