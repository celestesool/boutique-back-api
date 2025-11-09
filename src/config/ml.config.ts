
export const mlConfig = {
  apiUrl: process.env.ML_API_URL || 'http://localhost:8000',
  apiKey: process.env.ML_API_KEY || 'ml_secret_key_boutique_2025',
  timeout: 30000, // 30 segundos
  trainingTimeout: 300000, // 5 minutos para reentrenamiento
  healthTimeout: 5000, // 5 segundos para health check
} as const;

export const ML_ENDPOINTS = {
  // Health
  HEALTH: '/health',

  // Classification
  CLASSIFY_IMAGE: '/api/ml/classify-image',

  // Similarity (productos similares)
  SIMILAR_IMAGE: '/api/ml/similar-products',
  SIMILAR_PRODUCT: '/api/ml/similar-products',

  // Search (búsqueda visual)
  SEARCH_VISUAL: '/api/ml/search-by-image',

  // Recommendations (sistema de recomendaciones)
  RECOMMENDATIONS_INTERACTION: '/api/ml/recommendations/interaction',
  RECOMMENDATIONS_GET: '/api/ml/recommendations/get',
  RECOMMENDATIONS_STATS: '/api/ml/recommendations/stats',
  RECOMMENDATIONS_BATCH: '/api/ml/recommendations/batch-interactions',

  // Embeddings (vectores de características)
  EMBEDDINGS_EXTRACT: '/api/ml/embeddings/extract',
  EMBEDDINGS_SIMILARITY: '/api/ml/embeddings/similarity',
  EMBEDDINGS_FIND_SIMILAR: '/api/ml/embeddings/find-similar',
  EMBEDDINGS_STATS: '/api/ml/embeddings/stats',
  EMBEDDINGS_INDEX_BUILD: '/api/ml/embeddings/index/build',
  EMBEDDINGS_INDEX_LOAD: '/api/ml/embeddings/index/load',

  // Training (entrenamiento del modelo)
  TRAINING_START: '/api/ml/train',
  TRAINING_STATUS: '/api/ml/training-status',

  // Supervision (validación humana)
  SUPERVISION_PENDING: '/api/ml/supervision/pending',
  SUPERVISION_APPROVE: '/api/ml/supervision/approve',
  SUPERVISION_REJECT: '/api/ml/supervision/reject',
  SUPERVISION_HISTORY: '/api/ml/supervision/history',
  SUPERVISION_METRICS: '/api/ml/supervision/metrics',
  SUPERVISION_TRIGGER_RETRAIN: '/api/ml/supervision/trigger-retraining',

  // Metrics (métricas del modelo)
  METRICS_OVERALL: '/api/ml/metrics/overall',
  METRICS_PER_CLASS: '/api/ml/metrics/per-class',
  METRICS_CONFUSION_MATRIX: '/api/ml/metrics/confusion-matrix',
  METRICS_INFERENCE_STATS: '/api/ml/metrics/inference-stats',
  METRICS_TRAINING_HISTORY: '/api/ml/metrics/training-history',
  METRICS_REPORT: '/api/ml/metrics/report',
  METRICS_CLASS_DISTRIBUTION: '/api/ml/metrics/class-distribution',
} as const;
