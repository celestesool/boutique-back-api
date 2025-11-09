import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MLService } from './ml.service';
import {
  ClasificacionMLResponse,
  ProductoSimilar,
  RecomendacionML,
  MetricasML,
  ModeloInfo,
} from './types/ml.types';

@Resolver()
export class MLResolver {
  constructor(private readonly mlService: MLService) {}

  // ==================== CLASSIFICATION ====================

  @Mutation(() => ClasificacionMLResponse)
  async clasificarImagen(
    @Args('productId') productId: string,
    @Args('imageBase64') imageBase64: string,
  ): Promise<ClasificacionMLResponse> {
    return await this.mlService.clasificarImagen(productId, imageBase64);
  }

  // ==================== SEARCH ====================

  @Query(() => [ProductoSimilar])
  async busquedaVisual(
    @Args('imageBase64') imageBase64: string,
    @Args('limit', { nullable: true, defaultValue: 20 }) limit: number,
  ): Promise<ProductoSimilar[]> {
    const result = await this.mlService.busquedaVisual(imageBase64, limit);
    return result.results || [];
  }

  // ==================== RECOMMENDATIONS ====================

  @Query(() => [RecomendacionML])
  async recomendacionesPorUsuario(
    @Args('userId') userId: string,
    @Args('limit', { nullable: true, defaultValue: 10 }) limit: number,
  ): Promise<RecomendacionML[]> {
    const result = await this.mlService.recomendacionesPorUsuario(userId, limit);
    return result.recommendations || [];
  }

  @Mutation(() => Boolean)
  async registrarInteraccion(
    @Args('userId') userId: string,
    @Args('productId') productId: string,
    @Args('interaction') interaction: string,
  ): Promise<boolean> {
    const result = await this.mlService.registrarInteraccion(userId, productId, interaction);
    return result.success || false;
  }

  // ==================== SIMILARITY ====================

  @Query(() => [ProductoSimilar])
  async buscarSimilaresPorProducto(
    @Args('productId') productId: string,
    @Args('limit', { nullable: true, defaultValue: 10 }) limit: number,
  ): Promise<ProductoSimilar[]> {
    const result = await this.mlService.buscarSimilaresPorProducto(productId, limit);
    return result.similar_products || [];
  }

  // ==================== METRICS ====================

  @Query(() => MetricasML)
  async obtenerMetricasML(): Promise<MetricasML> {
    return await this.mlService.obtenerMetricas();
  }

  // ==================== HEALTH ====================

  @Query(() => String)
  async mlServiceHealth(): Promise<string> {
    const result = await this.mlService.verificarSalud();
    return JSON.stringify(result);
  }

  // ==================== EMBEDDINGS & INDEX ====================

  @Mutation(() => String, { description: 'Construir índice FAISS para búsquedas rápidas' })
  async construirIndiceML(): Promise<string> {
    const result = await this.mlService.construirIndice();
    return JSON.stringify(result);
  }

  @Mutation(() => String, { description: 'Cargar índice FAISS desde disco' })
  async cargarIndiceML(): Promise<string> {
    const result = await this.mlService.cargarIndice();
    return JSON.stringify(result);
  }

  @Mutation(() => String, { description: 'Extraer embeddings de una imagen' })
  async extraerEmbeddingsML(
    @Args('imageBase64') imageBase64: string,
  ): Promise<string> {
    const result = await this.mlService.extraerEmbeddings(imageBase64);
    return JSON.stringify(result);
  }
}
