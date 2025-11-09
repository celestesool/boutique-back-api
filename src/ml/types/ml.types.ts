import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class PrediccionML {
  @Field()
  label: string;

  @Field(() => Float)
  confidence: number;
}

@ObjectType()
export class ClasificacionMLResponse {
  @Field()
  success: boolean;

  @Field()
  product_id: string;

  @Field(() => PrediccionML)
  tipo_prenda: PrediccionML;

  @Field(() => PrediccionML, { nullable: true })
  tipo_cuello?: PrediccionML;

  @Field(() => PrediccionML, { nullable: true })
  tipo_manga?: PrediccionML;

  @Field(() => PrediccionML, { nullable: true })
  patron?: PrediccionML;

  @Field(() => PrediccionML)
  color_principal: PrediccionML;

  @Field(() => PrediccionML)
  estilo: PrediccionML;

  @Field(() => Int)
  processing_time_ms: number;
}

@ObjectType()
export class ProductoSimilar {
  @Field()
  product_id: string;

  @Field(() => Float)
  similarity_score: number;

  @Field(() => [String], { nullable: true })
  matched_attributes?: string[];
}

@ObjectType()
export class RecomendacionML {
  @Field()
  product_id: string;

  @Field(() => Float)
  score: number;

  @Field()
  reason: string; // 'visual_similarity', 'collaborative_filtering', 'content_based'
}

@ObjectType()
export class MetricasML {
  @Field(() => Int)
  total_images_processed: number;

  @Field(() => Int)
  total_products_indexed: number;

  @Field(() => Float)
  avg_classification_time_ms: number;

  @Field()
  model_version: string;

  @Field(() => Float)
  model_accuracy: number;

  @Field(() => Int)
  uptime_hours: number;
}

@ObjectType()
export class ModeloInfo {
  @Field()
  model_name: string;

  @Field()
  version: string;

  @Field(() => Float)
  accuracy: number;

  @Field()
  architecture: string;

  @Field()
  trained_at: string;
}