import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { mlConfig, ML_ENDPOINTS } from '../config/ml.config';

@Injectable()
export class MLService {
  private readonly logger = new Logger(MLService.name);

  constructor(private readonly httpService: HttpService) {}

  // ==================== CLASSIFICATION ====================

  async clasificarImagen(productId: string, imageBase64: string) {
    try {
      this.logger.log(`Clasificando producto ${productId}`);

      const { data } = await firstValueFrom(
        this.httpService.post(
          `${mlConfig.apiUrl}${ML_ENDPOINTS.CLASSIFY_IMAGE}`,
          {
            product_id: productId,
            image_base64: imageBase64,
          },
          {
            headers: {
              'X-API-Key': mlConfig.apiKey,
              'Content-Type': 'application/json',
            },
            timeout: mlConfig.timeout,
          }
        )
      );

      this.logger.log(`Clasificación exitosa para ${productId}`);
      return data;
    } catch (error) {
      this.handleMLError(error, 'clasificarImagen');
    }
  }

  // ==================== SIMILARITY ====================

  async buscarSimilaresPorImagen(imageBase64: string, limit: number = 10) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${mlConfig.apiUrl}${ML_ENDPOINTS.SIMILAR_IMAGE}`,
          {
            image_base64: imageBase64,
            top_k: limit,
          },
          {
            headers: { 'X-API-Key': mlConfig.apiKey },
            timeout: mlConfig.timeout,
          }
        )
      );
      return data;
    } catch (error) {
      this.handleMLError(error, 'buscarSimilaresPorImagen');
    }
  }

  async buscarSimilaresPorProducto(productId: string, limit: number = 10) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${mlConfig.apiUrl}${ML_ENDPOINTS.SIMILAR_PRODUCT}`,
          {
            product_id: productId,
            top_k: limit,
          },
          {
            headers: { 'X-API-Key': mlConfig.apiKey },
            timeout: mlConfig.timeout,
          }
        )
      );
      return data;
    } catch (error) {
      this.handleMLError(error, 'buscarSimilaresPorProducto');
    }
  }

  // ==================== SEARCH ====================

  async busquedaVisual(imageBase64: string, limit: number = 20) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${mlConfig.apiUrl}${ML_ENDPOINTS.SEARCH_VISUAL}`,
          {
            image_base64: imageBase64,
            top_k: limit,
          },
          {
            headers: { 'X-API-Key': mlConfig.apiKey },
            timeout: mlConfig.timeout,
          }
        )
      );
      return data;
    } catch (error) {
      this.handleMLError(error, 'busquedaVisual');
    }
  }

  // ==================== RECOMMENDATIONS ====================

  async recomendacionesPorUsuario(userId: string, limit: number = 10) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${mlConfig.apiUrl}${ML_ENDPOINTS.RECOMMENDATIONS_GET}`,
          {
            user_id: userId,
            top_k: limit,
          },
          {
            headers: { 'X-API-Key': mlConfig.apiKey },
            timeout: mlConfig.timeout,
          }
        )
      );
      return data;
    } catch (error) {
      this.handleMLError(error, 'recomendacionesPorUsuario');
    }
  }

  async registrarInteraccion(userId: string, productId: string, interaction: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${mlConfig.apiUrl}${ML_ENDPOINTS.RECOMMENDATIONS_INTERACTION}`,
          {
            user_id: userId,
            product_id: productId,
            interaction_type: interaction, // 'view', 'click', 'cart', 'purchase', 'like'
            timestamp: new Date().toISOString(),
          },
          {
            headers: { 'X-API-Key': mlConfig.apiKey },
            timeout: mlConfig.timeout,
          }
        )
      );
      return data;
    } catch (error) {
      this.handleMLError(error, 'registrarInteraccion');
    }
  }

  // ==================== EMBEDDINGS ====================

  async extraerEmbeddings(imageBase64: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${mlConfig.apiUrl}${ML_ENDPOINTS.EMBEDDINGS_EXTRACT}`,
          { image_base64: imageBase64 },
          {
            headers: { 'X-API-Key': mlConfig.apiKey },
            timeout: mlConfig.timeout,
          }
        )
      );
      return data;
    } catch (error) {
      this.handleMLError(error, 'extraerEmbeddings');
    }
  }

  async construirIndice() {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${mlConfig.apiUrl}${ML_ENDPOINTS.EMBEDDINGS_INDEX_BUILD}`,
          {},
          {
            headers: { 'X-API-Key': mlConfig.apiKey },
            timeout: mlConfig.timeout,
          }
        )
      );
      return data;
    } catch (error) {
      this.handleMLError(error, 'construirIndice');
    }
  }

  async cargarIndice() {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${mlConfig.apiUrl}${ML_ENDPOINTS.EMBEDDINGS_INDEX_LOAD}`,
          {},
          {
            headers: { 'X-API-Key': mlConfig.apiKey },
            timeout: mlConfig.timeout,
          }
        )
      );
      return data;
    } catch (error) {
      this.handleMLError(error, 'cargarIndice');
    }
  }

  // ==================== METRICS ====================

  async obtenerMetricas() {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${mlConfig.apiUrl}${ML_ENDPOINTS.METRICS_OVERALL}`,
          {
            headers: { 'X-API-Key': mlConfig.apiKey },
            timeout: mlConfig.timeout,
          }
        )
      );
      return data;
    } catch (error) {
      this.handleMLError(error, 'obtenerMetricas');
    }
  }

  // ==================== TRAINING ====================

  async iniciarEntrenamiento(config?: any) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${mlConfig.apiUrl}${ML_ENDPOINTS.TRAINING_START}`,
          config || {},
          {
            headers: { 'X-API-Key': mlConfig.apiKey },
            timeout: mlConfig.trainingTimeout,
          }
        )
      );
      return data;
    } catch (error) {
      this.handleMLError(error, 'iniciarEntrenamiento');
    }
  }

  async obtenerEstadoEntrenamiento(jobId: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${mlConfig.apiUrl}${ML_ENDPOINTS.TRAINING_STATUS}/${jobId}`,
          {
            headers: { 'X-API-Key': mlConfig.apiKey },
            timeout: mlConfig.timeout,
          }
        )
      );
      return data;
    } catch (error) {
      this.handleMLError(error, 'obtenerEstadoEntrenamiento');
    }
  }

  // ==================== SUPERVISION ====================

  async obtenerPrediccionesPendientes(limit: number = 50) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${mlConfig.apiUrl}${ML_ENDPOINTS.SUPERVISION_PENDING}`,
          {
            params: { limit },
            headers: { 'X-API-Key': mlConfig.apiKey },
            timeout: mlConfig.timeout,
          }
        )
      );
      return data;
    } catch (error) {
      this.handleMLError(error, 'obtenerPrediccionesPendientes');
    }
  }

  async aprobarPrediccion(predictionId: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${mlConfig.apiUrl}${ML_ENDPOINTS.SUPERVISION_APPROVE}`,
          { prediction_id: predictionId },
          {
            headers: { 'X-API-Key': mlConfig.apiKey },
            timeout: mlConfig.timeout,
          }
        )
      );
      return data;
    } catch (error) {
      this.handleMLError(error, 'aprobarPrediccion');
    }
  }

  async rechazarPrediccion(predictionId: string, correctLabels: any) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${mlConfig.apiUrl}${ML_ENDPOINTS.SUPERVISION_REJECT}`,
          {
            prediction_id: predictionId,
            correct_labels: correctLabels,
          },
          {
            headers: { 'X-API-Key': mlConfig.apiKey },
            timeout: mlConfig.timeout,
          }
        )
      );
      return data;
    } catch (error) {
      this.handleMLError(error, 'rechazarPrediccion');
    }
  }

  async activarReentrenamiento() {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${mlConfig.apiUrl}${ML_ENDPOINTS.SUPERVISION_TRIGGER_RETRAIN}`,
          {},
          {
            headers: { 'X-API-Key': mlConfig.apiKey },
            timeout: mlConfig.timeout,
          }
        )
      );
      return data;
    } catch (error) {
      this.handleMLError(error, 'activarReentrenamiento');
    }
  }

  // ==================== HEALTH ====================

  async verificarSalud() {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${mlConfig.apiUrl}${ML_ENDPOINTS.HEALTH}`, {
          timeout: mlConfig.healthTimeout,
        })
      );
      return data;
    } catch (error) {
      this.logger.error('ML Service no disponible');
      return { status: 'unhealthy', error: error.message };
    }
  }

  // ==================== ERROR HANDLING ====================

  private handleMLError(error: any, operation: string): never {
    this.logger.error(`Error en ${operation}:`, error.message);

    if (error instanceof AxiosError) {
      if (error.response) {
        // Error del ML Service
        throw new HttpException(
          {
            statusCode: error.response.status,
            message: `ML Service error: ${error.response.data?.message || error.message}`,
            operation,
          },
          error.response.status
        );
      } else if (error.request) {
        // No hay respuesta (ML Service caído)
        throw new HttpException(
          {
            statusCode: HttpStatus.SERVICE_UNAVAILABLE,
            message: 'ML Service no disponible',
            operation,
          },
          HttpStatus.SERVICE_UNAVAILABLE
        );
      }
    }

    // Error desconocido
    throw new HttpException(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error interno: ${error.message}`,
        operation,
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
